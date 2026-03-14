"use client";



export default function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: "100%",
        backgroundColor: "transparent",
        borderBottom: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 40px",
        }}
      >
        {/* Info columns */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "80px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              India Based
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.3,
                margin: 0,
                marginTop: "2px",
              }}
            >
              Working globally
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Building at
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.3,
                margin: 0,
                marginTop: "2px",
              }}
            >
              Fusion Practices
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                margin: 0,
              }}
            >
              Freelance availability
            </p>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "var(--text-secondary)",
                lineHeight: 1.3,
                margin: 0,
                marginTop: "2px",
              }}
            >
              March 2026
            </p>
          </div>
        </div>

        {/* CTA button */}
        <a
          href="#contact"
          style={{
            backgroundColor: "#111",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
