"use client";

import { useEffect, useRef } from "react";

export default function FluidGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 25,
      CURL: 30,
      SPLAT_RADIUS: 0.005,
    };

    interface Pointer {
      id: number;
      x: number;
      y: number;
      dx: number;
      dy: number;
      down: boolean;
      moved: boolean;
      color: number[];
    }

    const pointers: Pointer[] = [];
    const splatStack: number[] = [];

    function createPointer(): Pointer {
      return { id: -1, x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false, color: [0.4, 0.4, 0.4] };
    }
    pointers.push(createPointer());

    // WebGL setup
    const params = { alpha: true, depth: false, stencil: false, antialias: false, premultipliedAlpha: false };
    let gl = canvas.getContext("webgl2", params) as WebGLRenderingContext | null;
    const isWebGL2 = !!gl;
    if (!isWebGL2) gl = (canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext | null;
    if (!gl) return;

    const glCtx = gl;

    let halfFloat: any;
    let supportLinearFiltering: any;
    if (isWebGL2) {
      glCtx.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = glCtx.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = glCtx.getExtension("OES_texture_half_float");
      supportLinearFiltering = glCtx.getExtension("OES_texture_half_float_linear");
    }

    glCtx.clearColor(0.0, 0.0, 0.0, 0.0);

    const halfFloatTexType = isWebGL2 ? (glCtx as any).HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

    function getSupportedFormat(gl: any, internalFormat: number, format: number, type: number): any {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        switch (internalFormat) {
          case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
          case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
          default: return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl: any, internalFormat: number, format: number, type: number): boolean {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      return status === gl.FRAMEBUFFER_COMPLETE;
    }

    let formatRGBA: any, formatRG: any, formatR: any;
    if (isWebGL2) {
      const gl2 = glCtx as any;
      formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(glCtx, glCtx.RGBA, glCtx.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(glCtx, glCtx.RGBA, glCtx.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(glCtx, glCtx.RGBA, glCtx.RGBA, halfFloatTexType);
    }

    if (!formatRGBA || !formatRG || !formatR) return;

    // Shader compilation
    function compileShader(type: number, source: string): WebGLShader {
      const shader = glCtx.createShader(type)!;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
      }
      return shader;
    }

    class GLProgram {
      program: WebGLProgram;
      uniforms: Record<string, WebGLUniformLocation | null> = {};
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = glCtx.createProgram()!;
        glCtx.attachShader(this.program, vertexShader);
        glCtx.attachShader(this.program, fragmentShader);
        glCtx.linkProgram(this.program);
        if (!glCtx.getProgramParameter(this.program, glCtx.LINK_STATUS)) {
          console.error(glCtx.getProgramInfoLog(this.program));
        }
        const uniformCount = glCtx.getProgramParameter(this.program, glCtx.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = glCtx.getActiveUniform(this.program, i)!.name;
          this.uniforms[uniformName] = glCtx.getUniformLocation(this.program, uniformName);
        }
      }
      bind() { glCtx.useProgram(this.program); }
    }

    // Shaders
    const baseVertexShader = compileShader(glCtx.VERTEX_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `);

    const clearShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
    `);

    const displayShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        vec4 c = texture2D(uTexture, vUv);
        float luminance = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        gl_FragColor = vec4(vec3(luminance), c.a);
      }
    `);

    const splatShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `);

    const advectionManualFilteringShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (in sampler2D sam, in vec2 p) {
        vec4 st;
        st.xy = floor(p - 0.5) + 0.5;
        st.zw = st.xy + 1.0;
        vec4 uv = st * texelSize.xyxy;
        vec4 a = texture2D(sam, uv.xy);
        vec4 b = texture2D(sam, uv.zy);
        vec4 c = texture2D(sam, uv.xw);
        vec4 d = texture2D(sam, uv.zw);
        vec2 f = p - st.xy;
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      void main () {
        vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
        gl_FragColor = dissipation * bilerp(uSource, coord);
        gl_FragColor.a = 1.0;
      }
    `);

    const advectionShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
      }
    `);

    const divergenceShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      vec2 sampleVelocity (in vec2 uv) {
        vec2 multiplier = vec2(1.0, 1.0);
        if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
        if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
        if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
        if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
        return multiplier * texture2D(uVelocity, uv).xy;
      }
      void main () {
        float L = sampleVelocity(vL).x;
        float R = sampleVelocity(vR).x;
        float T = sampleVelocity(vT).y;
        float B = sampleVelocity(vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `);

    const curlShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
      }
    `);

    const vorticityShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vT; varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = vec2(abs(T) - abs(B), 0.0);
        force *= 1.0 / length(force + 0.00001) * curl * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `);

    const pressureShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      vec2 boundary (in vec2 uv) { return min(max(uv, 0.0), 1.0); }
      void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `);

    const gradientSubtractShader = compileShader(glCtx.FRAGMENT_SHADER, `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      vec2 boundary (in vec2 uv) { return min(max(uv, 0.0), 1.0); }
      void main () {
        float L = texture2D(uPressure, boundary(vL)).x;
        float R = texture2D(uPressure, boundary(vR)).x;
        float T = texture2D(uPressure, boundary(vT)).x;
        float B = texture2D(uPressure, boundary(vB)).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `);

    // FBO management
    let textureWidth: number, textureHeight: number;
    let density: any, velocity: any, divergenceFBO: any, curlFBO: any, pressureFBO: any;

    function createFBO(texId: number, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      glCtx.activeTexture(glCtx.TEXTURE0 + texId);
      const texture = glCtx.createTexture()!;
      glCtx.bindTexture(glCtx.TEXTURE_2D, texture);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MIN_FILTER, param);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_MAG_FILTER, param);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_S, glCtx.CLAMP_TO_EDGE);
      glCtx.texParameteri(glCtx.TEXTURE_2D, glCtx.TEXTURE_WRAP_T, glCtx.CLAMP_TO_EDGE);
      glCtx.texImage2D(glCtx.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = glCtx.createFramebuffer()!;
      glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, fbo);
      glCtx.framebufferTexture2D(glCtx.FRAMEBUFFER, glCtx.COLOR_ATTACHMENT0, glCtx.TEXTURE_2D, texture, 0);
      glCtx.viewport(0, 0, w, h);
      glCtx.clear(glCtx.COLOR_BUFFER_BIT);
      return [texture, fbo, texId];
    }

    function createDoubleFBO(texId: number, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(texId + 1, w, h, internalFormat, format, type, param);
      return {
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() { const temp = fbo1; fbo1 = fbo2; fbo2 = temp; },
      };
    }

    function initFramebuffers() {
      textureWidth = glCtx.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = glCtx.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;
      const texType = halfFloatTexType;
      const rgba = formatRGBA;
      const rg = formatRG;
      const r = formatR;
      const filtering = supportLinearFiltering ? glCtx.LINEAR : glCtx.NEAREST;
      density = createDoubleFBO(2, textureWidth, textureHeight, rgba.internalFormat, rgba.format, texType, filtering);
      velocity = createDoubleFBO(0, textureWidth, textureHeight, rg.internalFormat, rg.format, texType, filtering);
      divergenceFBO = createFBO(4, textureWidth, textureHeight, r.internalFormat, r.format, texType, glCtx.NEAREST);
      curlFBO = createFBO(5, textureWidth, textureHeight, r.internalFormat, r.format, texType, glCtx.NEAREST);
      pressureFBO = createDoubleFBO(6, textureWidth, textureHeight, r.internalFormat, r.format, texType, glCtx.NEAREST);
    }

    initFramebuffers();

    // Programs
    const clearProgram = new GLProgram(baseVertexShader, clearShader);
    const displayProgram = new GLProgram(baseVertexShader, displayShader);
    const splatProgram = new GLProgram(baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(baseVertexShader, supportLinearFiltering ? advectionShader : advectionManualFilteringShader);
    const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
    const gradientSubtractProgram = new GLProgram(baseVertexShader, gradientSubtractShader);

    // Blit quad
    const blitSetup = (() => {
      glCtx.bindBuffer(glCtx.ARRAY_BUFFER, glCtx.createBuffer());
      glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), glCtx.STATIC_DRAW);
      glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, glCtx.createBuffer());
      glCtx.bufferData(glCtx.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), glCtx.STATIC_DRAW);
      glCtx.vertexAttribPointer(0, 2, glCtx.FLOAT, false, 0, 0);
      glCtx.enableVertexAttribArray(0);
      return (destination: WebGLFramebuffer | null) => {
        glCtx.bindFramebuffer(glCtx.FRAMEBUFFER, destination);
        glCtx.drawElements(glCtx.TRIANGLES, 6, glCtx.UNSIGNED_SHORT, 0);
      };
    })();

    function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
      splatProgram.bind();
      glCtx.uniform1i(splatProgram.uniforms.uTarget, velocity.read[2]);
      glCtx.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height);
      glCtx.uniform2f(splatProgram.uniforms.point, x / canvas!.width, 1.0 - y / canvas!.height);
      glCtx.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      glCtx.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      blitSetup(velocity.write[1]);
      velocity.swap();
      glCtx.uniform1i(splatProgram.uniforms.uTarget, density.read[2]);
      glCtx.uniform3f(splatProgram.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
      blitSetup(density.write[1]);
      density.swap();
    }

    function multipleSplats(amount: number) {
      for (let i = 0; i < amount; i++) {
        const shade = Math.random() * 8 + 2;
        const color = [shade, shade, shade];
        const x = canvas!.width * Math.random();
        const y = canvas!.height * Math.random();
        const dx = 1000 * (Math.random() - 0.5);
        const dy = 1000 * (Math.random() - 0.5);
        splat(x, y, dx, dy, color);
      }
    }

    function resizeCanvas() {
      if (canvas!.width !== canvas!.clientWidth || canvas!.height !== canvas!.clientHeight) {
        canvas!.width = canvas!.clientWidth;
        canvas!.height = canvas!.clientHeight;
        initFramebuffers();
      }
    }

    let lastTime = Date.now();
    multipleSplats(Math.floor(Math.random() * 20) + 5);

    let running = true;

    function update() {
      if (!running) return;
      resizeCanvas();

      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      glCtx.viewport(0, 0, textureWidth, textureHeight);

      if (splatStack.length > 0) multipleSplats(splatStack.pop()!);

      advectionProgram.bind();
      glCtx.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      glCtx.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      glCtx.uniform1i(advectionProgram.uniforms.uSource, velocity.read[2]);
      glCtx.uniform1f(advectionProgram.uniforms.dt, dt);
      glCtx.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blitSetup(velocity.write[1]);
      velocity.swap();

      glCtx.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read[2]);
      glCtx.uniform1i(advectionProgram.uniforms.uSource, density.read[2]);
      glCtx.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blitSetup(density.write[1]);
      density.swap();

      for (let i = 0; i < pointers.length; i++) {
        const pointer = pointers[i];
        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      curlProgram.bind();
      glCtx.uniform2f(curlProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      glCtx.uniform1i(curlProgram.uniforms.uVelocity, velocity.read[2]);
      blitSetup(curlFBO[1]);

      vorticityProgram.bind();
      glCtx.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      glCtx.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read[2]);
      glCtx.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO[2]);
      glCtx.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      glCtx.uniform1f(vorticityProgram.uniforms.dt, dt);
      blitSetup(velocity.write[1]);
      velocity.swap();

      divergenceProgram.bind();
      glCtx.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      glCtx.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read[2]);
      blitSetup(divergenceFBO[1]);

      clearProgram.bind();
      let pressureTexId = pressureFBO.read[2];
      glCtx.activeTexture(glCtx.TEXTURE0 + pressureTexId);
      glCtx.bindTexture(glCtx.TEXTURE_2D, pressureFBO.read[0]);
      glCtx.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      glCtx.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blitSetup(pressureFBO.write[1]);
      pressureFBO.swap();

      pressureProgram.bind();
      glCtx.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      glCtx.uniform1i(pressureProgram.uniforms.uDivergence, divergenceFBO[2]);
      pressureTexId = pressureFBO.read[2];
      glCtx.uniform1i(pressureProgram.uniforms.uPressure, pressureTexId);
      glCtx.activeTexture(glCtx.TEXTURE0 + pressureTexId);
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        glCtx.bindTexture(glCtx.TEXTURE_2D, pressureFBO.read[0]);
        blitSetup(pressureFBO.write[1]);
        pressureFBO.swap();
      }

      gradientSubtractProgram.bind();
      glCtx.uniform2f(gradientSubtractProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      glCtx.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressureFBO.read[2]);
      glCtx.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read[2]);
      blitSetup(velocity.write[1]);
      velocity.swap();

      glCtx.viewport(0, 0, glCtx.drawingBufferWidth, glCtx.drawingBufferHeight);
      displayProgram.bind();
      glCtx.uniform1i(displayProgram.uniforms.uTexture, density.read[2]);
      blitSetup(null);

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);

    // Event handlers — always track movement (pointer always "down")
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointers[0].moved = true;
      pointers[0].down = true; // always active on hover
      pointers[0].dx = (x - pointers[0].x) * 10.0;
      pointers[0].dy = (y - pointers[0].y) * 10.0;
      pointers[0].x = x;
      pointers[0].y = y;
      // Random greyscale color on each move
      const shade = Math.random() * 0.6 + 0.4;
      pointers[0].color = [shade, shade, shade];
    };

    const handleMouseLeave = () => {
      pointers[0].down = false;
    };

    const handleMouseDown = () => {
      // Burst splats on click
      splatStack.push(Math.floor(Math.random() * 15) + 5);
    };

    const handleMouseUp = () => {};

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i] || (pointers.push(createPointer()), pointers[pointers.length - 1]);
        const x = touches[i].clientX - rect.left;
        const y = touches[i].clientY - rect.top;
        pointer.moved = true;
        pointer.dx = (x - pointer.x) * 10.0;
        pointer.dy = (y - pointer.y) * 10.0;
        pointer.x = x;
        pointer.y = y;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touches = e.targetTouches;
      for (let i = 0; i < touches.length; i++) {
        if (i >= pointers.length) pointers.push(createPointer());
        pointers[i].id = touches[i].identifier;
        pointers[i].down = true;
        pointers[i].x = touches[i].clientX - rect.left;
        pointers[i].y = touches[i].clientY - rect.top;
        const shade = Math.random() * 0.8 + 0.2;
        pointers[i].color = [shade, shade, shade];
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touches = e.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        for (let j = 0; j < pointers.length; j++) {
          if (touches[i].identifier === pointers[j].id) pointers[j].down = false;
        }
      }
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);
    parent.addEventListener("mousedown", handleMouseDown);
    parent.addEventListener("touchmove", handleTouchMove, { passive: false });
    parent.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      running = false;
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("mousedown", handleMouseDown);
      parent.removeEventListener("touchmove", handleTouchMove);
      parent.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        zIndex: 1,
      }}
    />
  );
}
