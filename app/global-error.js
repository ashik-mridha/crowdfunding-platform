"use client";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          textAlign: "center",
          margin: 0,
        }}
      >
        <main role="alert">
          <h1>Fundora hit a snag</h1>
          <p>A critical error occurred. Please reload the page.</p>
          <button
            onClick={reset}
            style={{
              minHeight: 44,
              padding: "0 20px",
              borderRadius: 12,
              border: 0,
              background: "#ee7a1c",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
