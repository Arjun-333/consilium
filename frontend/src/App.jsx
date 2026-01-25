import { useState } from "react";

export default function App() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submitIdea = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/evaluate/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea })
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data.council_decision);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111",
        color: "#fff",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >
      <div style={{ width: "100%", maxWidth: "700px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
          Consilium — AI Council
        </h1>

        <p style={{ color: "#aaa", marginBottom: "1.5rem" }}>
          A multi-agent AI council that evaluates startup ideas from a founder’s perspective.
        </p>

        <textarea
          placeholder="Describe your startup idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          style={{
            width: "100%",
            height: "140px",
            padding: "12px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #333",
            backgroundColor: "#1c1c1c",
            color: "#fff",
            marginBottom: "1rem"
          }}
        />

        <button
          onClick={submitIdea}
          disabled={loading || !idea.trim()}
          style={{
            padding: "10px 18px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#444" : "#fff",
            color: "#000"
          }}
        >
          {loading ? "Evaluating…" : "Evaluate with Council"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>
        )}

        {result && (
          <pre
            style={{
              marginTop: "2rem",
              padding: "1rem",
              backgroundColor: "#1c1c1c",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
              lineHeight: "1.5"
            }}
          >
            {result}
          </pre>
        )}
      </div>
    </div>
  );
}
