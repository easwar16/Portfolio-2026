"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import * as CANNON from "cannon-es";

const BOX_HEIGHT = 1;
const ORIGINAL_BOX_SIZE = 3;

interface Layer {
  threejs: THREE.Mesh;
  cannonjs: CANNON.Body;
  width: number;
  depth: number;
  direction?: "x" | "z";
}

export default function StackGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    camera: THREE.OrthographicCamera | null;
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    world: CANNON.World | null;
    stack: Layer[];
    overhangs: Layer[];
    lastTime: number;
    autopilot: boolean;
    gameEnded: boolean;
    robotPrecision: number;
    score: number;
    animationId: number | null;
  }>({
    camera: null,
    scene: null,
    renderer: null,
    world: null,
    stack: [],
    overhangs: [],
    lastTime: 0,
    autopilot: true,
    gameEnded: false,
    robotPrecision: 0,
    score: 0,
    animationId: null,
  });

  const scoreRef = useRef<HTMLDivElement>(null);
  const instructionsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const setRobotPrecision = useCallback(() => {
    stateRef.current.robotPrecision = Math.random() * 1 - 0.5;
  }, []);

  const generateBox = useCallback(
    (
      x: number,
      y: number,
      z: number,
      width: number,
      depth: number,
      falls: boolean
    ): Layer => {
      const s = stateRef.current;

      const geometry = new THREE.BoxGeometry(width, BOX_HEIGHT, depth);
      const color = new THREE.Color(
        `hsl(${30 + s.stack.length * 4}, 100%, 50%)`
      );
      const material = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      s.scene!.add(mesh);

      const shape = new CANNON.Box(
        new CANNON.Vec3(width / 2, BOX_HEIGHT / 2, depth / 2)
      );
      let mass = falls ? 5 : 0;
      mass *= width / ORIGINAL_BOX_SIZE;
      mass *= depth / ORIGINAL_BOX_SIZE;
      const body = new CANNON.Body({ mass, shape });
      body.position.set(x, y, z);
      s.world!.addBody(body);

      return { threejs: mesh, cannonjs: body, width, depth };
    },
    []
  );

  const addLayer = useCallback(
    (
      x: number,
      z: number,
      width: number,
      depth: number,
      direction?: "x" | "z"
    ) => {
      const s = stateRef.current;
      const y = BOX_HEIGHT * s.stack.length;
      const layer = generateBox(x, y, z, width, depth, false);
      layer.direction = direction;
      s.stack.push(layer);
    },
    [generateBox]
  );

  const addOverhang = useCallback(
    (x: number, z: number, width: number, depth: number) => {
      const s = stateRef.current;
      const y = BOX_HEIGHT * (s.stack.length - 1);
      const overhang = generateBox(x, y, z, width, depth, true);
      s.overhangs.push(overhang);
    },
    [generateBox]
  );

  const cutBox = useCallback(
    (
      topLayer: Layer,
      overlap: number,
      size: number,
      delta: number
    ) => {
      const direction = topLayer.direction!;
      const newWidth = direction === "x" ? overlap : topLayer.width;
      const newDepth = direction === "z" ? overlap : topLayer.depth;

      topLayer.width = newWidth;
      topLayer.depth = newDepth;

      topLayer.threejs.scale[direction] = overlap / size;
      topLayer.threejs.position[direction] -= delta / 2;
      topLayer.cannonjs.position[direction] -= delta / 2;

      const shape = new CANNON.Box(
        new CANNON.Vec3(newWidth / 2, BOX_HEIGHT / 2, newDepth / 2)
      );
      topLayer.cannonjs.shapes = [];
      topLayer.cannonjs.addShape(shape);
    },
    []
  );

  const missedTheSpot = useCallback(() => {
    const s = stateRef.current;
    const topLayer = s.stack[s.stack.length - 1];

    addOverhang(
      topLayer.threejs.position.x,
      topLayer.threejs.position.z,
      topLayer.width,
      topLayer.depth
    );

    s.world!.removeBody(topLayer.cannonjs);
    s.scene!.remove(topLayer.threejs);

    s.gameEnded = true;
    if (resultsRef.current && !s.autopilot) {
      resultsRef.current.style.display = "flex";
    }
  }, [addOverhang]);

  const splitBlockAndAddNextOneIfOverlaps = useCallback(() => {
    const s = stateRef.current;
    if (s.gameEnded) return;

    const topLayer = s.stack[s.stack.length - 1];
    const previousLayer = s.stack[s.stack.length - 2];
    const direction = topLayer.direction!;

    const size = direction === "x" ? topLayer.width : topLayer.depth;
    const delta =
      topLayer.threejs.position[direction] -
      previousLayer.threejs.position[direction];
    const overhangSize = Math.abs(delta);
    const overlap = size - overhangSize;

    if (overlap > 0) {
      cutBox(topLayer, overlap, size, delta);

      const overhangShift =
        (overlap / 2 + overhangSize / 2) * Math.sign(delta);
      const overhangX =
        direction === "x"
          ? topLayer.threejs.position.x + overhangShift
          : topLayer.threejs.position.x;
      const overhangZ =
        direction === "z"
          ? topLayer.threejs.position.z + overhangShift
          : topLayer.threejs.position.z;
      const overhangWidth =
        direction === "x" ? overhangSize : topLayer.width;
      const overhangDepth =
        direction === "z" ? overhangSize : topLayer.depth;

      addOverhang(overhangX, overhangZ, overhangWidth, overhangDepth);

      const nextX = direction === "x" ? topLayer.threejs.position.x : -10;
      const nextZ = direction === "z" ? topLayer.threejs.position.z : -10;
      const nextDirection = direction === "x" ? "z" : "x";

      s.score = s.stack.length - 1;
      if (scoreRef.current) scoreRef.current.innerText = String(s.score);
      addLayer(nextX, nextZ, topLayer.width, topLayer.depth, nextDirection);
    } else {
      missedTheSpot();
    }
  }, [cutBox, addOverhang, addLayer, missedTheSpot]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    s.autopilot = false;
    s.gameEnded = false;
    s.lastTime = 0;
    s.stack = [];
    s.overhangs = [];
    s.score = 0;

    if (instructionsRef.current)
      instructionsRef.current.style.display = "none";
    if (resultsRef.current) resultsRef.current.style.display = "none";
    if (scoreRef.current) scoreRef.current.innerText = "0";

    if (s.world) {
      while (s.world.bodies.length > 0) {
        s.world.removeBody(s.world.bodies[0]);
      }
    }

    if (s.scene) {
      const meshes = s.scene.children.filter(
        (c) => c.type === "Mesh"
      ) as THREE.Mesh[];
      meshes.forEach((m) => s.scene!.remove(m));

      addLayer(0, 0, ORIGINAL_BOX_SIZE, ORIGINAL_BOX_SIZE);
      addLayer(-10, 0, ORIGINAL_BOX_SIZE, ORIGINAL_BOX_SIZE, "x");
    }

    if (s.camera) {
      s.camera.position.set(4, 4, 4);
      s.camera.lookAt(0, 0, 0);
    }
  }, [addLayer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const s = stateRef.current;
    s.autopilot = true;
    s.gameEnded = false;
    s.lastTime = 0;
    s.stack = [];
    s.overhangs = [];
    setRobotPrecision();

    // Cannon
    s.world = new CANNON.World();
    s.world.gravity.set(0, -10, 0);
    s.world.broadphase = new CANNON.NaiveBroadphase();
    (s.world.solver as CANNON.GSSolver).iterations = 40;

    // Three
    const aspect = container.clientWidth / container.clientHeight;
    const width = 10;
    const height = width / aspect;

    s.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      0,
      100
    );
    s.camera.position.set(4, 4, 4);
    s.camera.lookAt(0, 0, 0);

    s.scene = new THREE.Scene();

    addLayer(0, 0, ORIGINAL_BOX_SIZE, ORIGINAL_BOX_SIZE);
    addLayer(-10, 0, ORIGINAL_BOX_SIZE, ORIGINAL_BOX_SIZE, "x");

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    s.scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 0);
    s.scene.add(dirLight);

    s.renderer = new THREE.WebGLRenderer({ antialias: true });
    s.renderer.setSize(container.clientWidth, container.clientHeight);
    s.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(s.renderer.domElement);

    // Animation loop
    function animation(time: number) {
      const st = stateRef.current;
      if (st.lastTime) {
        const timePassed = time - st.lastTime;
        const speed = 0.008;

        const topLayer = st.stack[st.stack.length - 1];
        const previousLayer = st.stack[st.stack.length - 2];

        if (topLayer && previousLayer) {
          const boxShouldMove =
            !st.gameEnded &&
            (!st.autopilot ||
              (st.autopilot &&
                topLayer.threejs.position[topLayer.direction!] <
                  previousLayer.threejs.position[topLayer.direction!] +
                    st.robotPrecision));

          if (boxShouldMove) {
            topLayer.threejs.position[topLayer.direction!] +=
              speed * timePassed;
            topLayer.cannonjs.position[topLayer.direction!] +=
              speed * timePassed;

            if (topLayer.threejs.position[topLayer.direction!] > 10) {
              missedTheSpot();
            }
          } else {
            if (st.autopilot) {
              splitBlockAndAddNextOneIfOverlaps();
              setRobotPrecision();
            }
          }

          if (
            st.camera!.position.y <
            BOX_HEIGHT * (st.stack.length - 2) + 4
          ) {
            st.camera!.position.y += speed * timePassed;
          }

          // Physics
          st.world!.step(timePassed / 1000);
          st.overhangs.forEach((element) => {
            element.threejs.position.copy(
              element.cannonjs.position as unknown as THREE.Vector3
            );
            element.threejs.quaternion.copy(
              element.cannonjs.quaternion as unknown as THREE.Quaternion
            );
          });

          st.renderer!.render(st.scene!, st.camera!);
        }
      }
      st.lastTime = time;
      st.animationId = requestAnimationFrame(animation);
    }

    s.animationId = requestAnimationFrame(animation);

    // Resize
    const handleResize = () => {
      const st = stateRef.current;
      if (!container || !st.camera || !st.renderer) return;
      const aspect = container.clientWidth / container.clientHeight;
      const w = 10;
      const h = w / aspect;
      st.camera.top = h / 2;
      st.camera.bottom = h / -2;
      st.camera.updateProjectionMatrix();
      st.renderer.setSize(container.clientWidth, container.clientHeight);
      st.renderer.render(st.scene!, st.camera);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (s.animationId) cancelAnimationFrame(s.animationId);
      if (s.renderer) {
        s.renderer.dispose();
        if (s.renderer.domElement.parentNode) {
          s.renderer.domElement.parentNode.removeChild(s.renderer.domElement);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Event handlers
  useEffect(() => {
    const handleEvent = () => {
      const s = stateRef.current;
      if (s.autopilot) startGame();
      else splitBlockAndAddNextOneIfOverlaps();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        handleEvent();
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        startGame();
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousedown", handleEvent);
    container.addEventListener("touchstart", handleEvent);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("mousedown", handleEvent);
      container.removeEventListener("touchstart", handleEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [startGame, splitBlockAndAddNextOneIfOverlaps]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        cursor: "pointer",
        borderRadius: "14px",
        overflow: "hidden",
      }}
    >
      {/* Score */}
      <div
        ref={scoreRef}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "white",
          fontSize: "2em",
          fontWeight: "bold",
          fontFamily: "var(--font-clash)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        0
      </div>

      {/* Instructions overlay */}
      <div
        ref={instructionsRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(20, 20, 20, 0.75)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            maxWidth: 280,
            padding: 40,
            borderRadius: 20,
            color: "white",
            textAlign: "center",
            fontFamily: "var(--font-clash)",
            fontSize: 14,
          }}
        >
          <p>Stack the blocks on top of each other</p>
          <p style={{ opacity: 0.7, marginTop: 8 }}>
            Click, tap or press Space to start
          </p>
        </div>
      </div>

      {/* Results overlay */}
      <div
        ref={resultsRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(20, 20, 20, 0.75)",
          zIndex: 3,
        }}
      >
        <div
          style={{
            maxWidth: 280,
            padding: 40,
            borderRadius: 20,
            color: "white",
            textAlign: "center",
            fontFamily: "var(--font-clash)",
            fontSize: 14,
          }}
        >
          <p style={{ fontWeight: 600, fontSize: 18 }}>You missed!</p>
          <p style={{ opacity: 0.7, marginTop: 12 }}>
            Press R or click to restart
          </p>
        </div>
      </div>
    </div>
  );
}
