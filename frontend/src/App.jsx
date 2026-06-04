import { useState, useEffect } from "react";
import "./App.css";

const agentsList = [
  { key: "visionary", name: "Visionary", role: "CEO / Founder", description: "Vision clarity, mission alignment, long-term impact" },
  { key: "product_lead", name: "Product Lead", role: "Product Manager", description: "Problem–solution fit, user needs, MVP feasibility" },
  { key: "market_analyst", name: "Market Analyst", role: "Market Researcher", description: "Market demand, competitive edge, differentiation" },
  { key: "technology_lead", name: "Technology Lead", role: "CTO", description: "Technical feasibility, architecture complexity, scaling" },
  { key: "finance_advisor", name: "Finance Advisor", role: "CFO", description: "Revenue model, cost structure, financial viability" },
  { key: "risk_compliance", name: "Risk & Compliance", role: "Risk Officer", description: "Execution hurdles, regulatory challenges, operations" },
  { key: "strategy_growth", name: "Strategy & Growth", role: "Growth Advisor", description: "GTM execution, growth channels, scaling framework" },
];

// Custom Select Dropdown to replace native HTML select
function CustomSelect({ value, onChange, options, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div className="custom-select-container">
      <button
        type="button"
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span>{selectedOption ? selectedOption.label : value}</span>
        <span className="arrow">▼</span>
      </button>
      {isOpen && (
        <>
          <div className="custom-select-overlay" onClick={() => setIsOpen(false)} />
          <ul className="custom-select-options">
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`custom-select-option ${opt.value === value ? "selected" : ""}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// SVG Radar Chart mimicking the holographic glowing portal ring in the reference image
function RadarChart({ scores }) {
  const axes = [
    { key: "visionary", label: "Vision" },
    { key: "product_lead", label: "Product" },
    { key: "market_analyst", label: "Market" },
    { key: "technology_lead", label: "CTO" },
    { key: "finance_advisor", label: "CFO" },
    { key: "risk_compliance", label: "Risk" },
    { key: "strategy_growth", label: "Growth" },
  ];
  
  const size = 300;
  const center = size / 2;
  const rMax = 85;
  const numAxes = axes.length;
  const angleStep = (2 * Math.PI) / numAxes;

  const getCoords = (index, value) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 10) * rMax;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  // Concentric Heptagonal grids
  const levels = [2, 4, 6, 8, 10];
  const gridPolygons = levels.map(level => {
    const points = Array.from({ length: numAxes }).map((_, i) => {
      const c = getCoords(i, level);
      return `${c.x},${c.y}`;
    }).join(" ");
    return (
      <polygon 
        key={level} 
        points={points} 
        fill="none" 
        stroke="rgba(6, 182, 212, 0.08)" 
        strokeWidth="1" 
      />
    );
  });

  // Holographic Concentric Circles (matching the circular portal ring from the image)
  const circularRings = [0.4, 0.7, 1.0].map((scale, i) => (
    <circle
      key={i}
      cx={center}
      cy={center}
      r={scale * rMax}
      fill="none"
      stroke={scale === 1.0 ? "rgba(6, 182, 212, 0.45)" : "rgba(6, 182, 212, 0.12)"}
      strokeWidth={scale === 1.0 ? "2" : "1"}
      strokeDasharray={scale === 1.0 ? "5 5" : "0"}
      filter={scale === 1.0 ? "url(#portal-glow)" : ""}
    />
  ));

  // Spine lines mapping out from the center
  const axisLines = Array.from({ length: numAxes }).map((_, i) => {
    const outer = getCoords(i, 10);
    return (
      <line 
        key={i} 
        x1={center} 
        y1={center} 
        x2={outer.x} 
        y2={outer.y} 
        stroke="rgba(6, 182, 212, 0.08)" 
        strokeWidth="1" 
      />
    );
  });

  // The actual evaluated metrics polygon
  const scoresPoints = axes.map((axis, i) => {
    const val = scores[axis.key] || 7;
    const c = getCoords(i, val);
    return `${c.x},${c.y}`;
  }).join(" ");

  // Labels and vertex dots
  const labelElements = axes.map((axis, i) => {
    const val = scores[axis.key] || 7;
    const textPos = getCoords(i, 12);
    const dotPos = getCoords(i, val);
    
    let textAnchor = "middle";
    if (textPos.x > center + 15) textAnchor = "start";
    if (textPos.x < center - 15) textAnchor = "end";

    return (
      <g key={axis.key}>
        <circle cx={dotPos.x} cy={dotPos.y} r="4" fill="#e0f2fe" filter="url(#dot-glow)" />
        <text
          x={textPos.x}
          y={textPos.y + 4}
          fill="rgba(224, 242, 254, 0.8)"
          fontSize="9"
          fontWeight="600"
          textAnchor={textAnchor}
          style={{ letterSpacing: "0.05em" }}
        >
          {axis.label}: {val}
        </text>
      </g>
    );
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      <defs>
        <filter id="portal-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#06b6d4" floodOpacity="0.75" />
        </filter>
        <filter id="chart-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#06b6d4" floodOpacity="0.5" />
        </filter>
        <filter id="dot-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#e0f2fe" floodOpacity="0.7" />
        </filter>
      </defs>
      
      {gridPolygons}
      {circularRings}
      {axisLines}

      <circle cx={center} cy={center} r="6" fill="#06b6d4" filter="url(#dot-glow)" />
      <circle cx={center} cy={center} r="16" fill="none" stroke="rgba(6, 182, 212, 0.25)" strokeWidth="1" />

      {scoresPoints && (
        <polygon
          points={scoresPoints}
          fill="rgba(6, 182, 212, 0.25)"
          stroke="#06b6d4"
          strokeWidth="2.5"
          filter="url(#chart-glow)"
        />
      )}

      {labelElements}
    </svg>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("evaluate");
  const [inputMode, setInputMode] = useState("quick");
  const [ideaText, setIdeaText] = useState("");
  const [structured, setStructured] = useState({
    problem: "",
    solution: "",
    market: "",
    finance: "",
  });

  const [provider, setProvider] = useState("gemini");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [loading, setLoading] = useState(false);
  
  // Results
  const [result, setResult] = useState(null);
  const [agentAnalyses, setAgentAnalyses] = useState(null);
  const [scores, setScores] = useState(null);
  
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("visionary");
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const [agentStatuses, setAgentStatuses] = useState(
    agentsList.reduce((acc, curr) => ({ ...acc, [curr.key]: "pending" }), {})
  );

  // Load history from localStorage
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("consilium_history");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync default models when provider changes
  useEffect(() => {
    if (provider === "gemini") {
      setModel("gemini-2.5-flash");
    } else if (provider === "openai") {
      setModel("gpt-4o-mini");
    } else {
      setModel("llama3");
    }
  }, [provider]);

  // Stagger agent evaluation statuses during loading
  useEffect(() => {
    let timers = [];
    if (loading) {
      setAgentStatuses(
        agentsList.reduce((acc, curr) => ({ ...acc, [curr.key]: "analyzing" }), {})
      );

      agentsList.forEach((agent, index) => {
        const timer = setTimeout(() => {
          setAgentStatuses((prev) => ({
            ...prev,
            [agent.key]: "complete",
          }));
        }, (index + 1) * 900 + Math.random() * 500);
        timers.push(timer);
      });
    } else {
      timers.forEach(clearTimeout);
      if (result) {
        setAgentStatuses(
          agentsList.reduce((acc, curr) => ({ ...acc, [curr.key]: "complete" }), {})
        );
      } else {
        setAgentStatuses(
          agentsList.reduce((acc, curr) => ({ ...acc, [curr.key]: "pending" }), {})
        );
      }
    }

    return () => timers.forEach(clearTimeout);
  }, [loading, result]);

  const submitIdea = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setAgentAnalyses(null);
    setScores(null);

    let finalIdea = "";
    if (inputMode === "quick") {
      finalIdea = ideaText;
    } else {
      finalIdea = `
Problem Statement:
${structured.problem}

Solution Concept:
${structured.solution}

Target Market & Competition:
${structured.market}

Monetization & Cost Model:
${structured.finance}
      `.trim();
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/evaluate/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: finalIdea, provider, model })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setResult(data.council_decision);
      setAgentAnalyses(data.agent_analyses);
      setScores(data.scores);
      setActiveTab("visionary");

      // Save to history ledger
      const newItem = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        title: inputMode === "quick" 
          ? ideaText.substring(0, 45) + (ideaText.length > 45 ? "..." : "")
          : structured.problem.substring(0, 45) + (structured.problem.length > 45 ? "..." : ""),
        inputMode,
        ideaText,
        structured,
        result: data.council_decision,
        agentAnalyses: data.agent_analyses,
        scores: data.scores,
        provider,
        model
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("consilium_history", JSON.stringify(updatedHistory));
      setActiveHistoryId(newItem.id);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item) => {
    setInputMode(item.inputMode || "quick");
    setIdeaText(item.ideaText || "");
    setStructured(item.structured || { problem: "", solution: "", market: "", finance: "" });
    setResult(item.result);
    setAgentAnalyses(item.agentAnalyses);
    setScores(item.scores);
    setProvider(item.provider || "gemini");
    setModel(item.model || "gemini-2.5-flash");
    setActiveHistoryId(item.id);
  };

  const deleteHistoryItem = (e, id) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("consilium_history", JSON.stringify(updated));
    if (activeHistoryId === id) {
      setResult(null);
      setAgentAnalyses(null);
      setScores(null);
      setActiveHistoryId(null);
    }
  };

  const getVerdictClass = (verdict) => {
    if (!verdict) return "cautious-go";
    const lower = verdict.toLowerCase();
    if (lower.includes("cautious")) return "cautious-go";
    if (lower.includes("no-go") || lower.includes("no go")) return "no-go";
    if (lower.includes("go")) return "go";
    return "cautious-go";
  };

  const parseInlineMarkdown = (text) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ color: "#ffffff", fontWeight: "700" }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={i} style={{ color: "var(--accent-color)" }}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const renderMarkdownContent = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith("###")) {
        return <h4 key={idx}>{parseInlineMarkdown(trimmed.substring(3).trim())}</h4>;
      }
      if (trimmed.startsWith("##")) {
        return <h3 key={idx}>{parseInlineMarkdown(trimmed.substring(2).trim())}</h3>;
      }
      if (trimmed.startsWith("#")) {
        return <h2 key={idx}>{parseInlineMarkdown(trimmed.substring(1).trim())}</h2>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const content = trimmed.substring(1).trim();
        return (
          <li key={idx} style={{ marginLeft: "15px", listStyleType: "disc", marginBottom: "8px" }}>
            {parseInlineMarkdown(content)}
          </li>
        );
      }
      if (/^\d+\./.test(trimmed)) {
        const dotIndex = trimmed.indexOf(".");
        const prefix = trimmed.substring(0, dotIndex + 1);
        const content = trimmed.substring(dotIndex + 1).trim();
        return (
          <p 
            key={idx} 
            style={{ 
              marginTop: "16px",
              color: "#ffffff"
            }}
          >
            <strong>{prefix}</strong> {parseInlineMarkdown(content)}
          </p>
        );
      }
      if (!trimmed) return <div key={idx} style={{ height: "8px" }} />;
      return <p key={idx} style={{ margin: "0 0 12px 0" }}>{parseInlineMarkdown(trimmed)}</p>;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      {/* Sticky Futuristic Header */}
      <header className="futuristic-nav">
        <div className="nav-logo" onClick={() => setActiveSection("evaluate")}>Consilium</div>
        <div className="nav-links">
          <button 
            onClick={() => setActiveSection("evaluate")} 
            className={activeSection === "evaluate" ? "active" : ""}
          >
            Council Room
          </button>
          <button 
            onClick={() => setActiveSection("ledger")} 
            className={activeSection === "ledger" ? "active" : ""}
          >
            Ledger
          </button>
          <button 
            onClick={() => setActiveSection("specs")} 
            className={activeSection === "specs" ? "active" : ""}
          >
            Specs
          </button>
        </div>
        <div className="nav-status">
          <span className={`status-pill ${provider === "ollama" ? "local" : "cloud"}`}>
            {provider === "ollama" ? "Ollama Local" : provider === "gemini" ? "Gemini Cloud" : "OpenAI Cloud"}
          </span>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="app-layout">
        
        {/* Render Sidebar ONLY when viewing Council Room */}
        {activeSection === "evaluate" && (
          <aside className="history-sidebar">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="sidebar-title">Saved Sessions</span>
              {history.length > 0 && (
                <button 
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem("consilium_history");
                    setResult(null);
                    setAgentAnalyses(null);
                    setScores(null);
                    setActiveHistoryId(null);
                  }}
                  className="btn-delete-history"
                  style={{ fontSize: "0.72rem" }}
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="history-list">
              {history.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", textAlign: "center", marginTop: "20px" }}>
                  No evaluations saved yet.
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`history-item ${activeHistoryId === item.id ? "active" : ""}`}
                  >
                    <span className="history-idea">{item.title}</span>
                    <div className="history-meta">
                      <span>{item.date}</span>
                      <button
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="btn-delete-history"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

        {/* Dynamic Section Contents */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          
          {/* 1. Evaluation Section */}
          {activeSection === "evaluate" && (
            <div className="main-content">
              <main className="glass-panel">
                {/* Configuration Panel */}
                <div className="settings-bar">
                  <div className="setting-group">
                    <label className="setting-label">LLM Provider</label>
                    <CustomSelect
                      value={provider}
                      onChange={setProvider}
                      options={[
                        { value: "gemini", label: "Gemini (Cloud)" },
                        { value: "openai", label: "OpenAI (Cloud)" },
                        { value: "ollama", label: "Ollama (Local)" }
                      ]}
                      disabled={loading}
                    />
                  </div>

                  <div className="setting-group">
                    <label className="setting-label">Model Target</label>
                    {provider === "gemini" ? (
                      <CustomSelect
                        value={model}
                        onChange={setModel}
                        options={[
                          { value: "gemini-2.5-flash", label: "gemini-2.5-flash (Recommended)" },
                          { value: "gemini-2.5-pro", label: "gemini-2.5-pro (Advanced)" }
                        ]}
                        disabled={loading}
                      />
                    ) : provider === "openai" ? (
                      <CustomSelect
                        value={model}
                        onChange={setModel}
                        options={[
                          { value: "gpt-4o-mini", label: "gpt-4o-mini (Recommended)" },
                          { value: "gpt-4o", label: "gpt-4o (Advanced)" }
                        ]}
                        disabled={loading}
                      />
                    ) : (
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        disabled={loading}
                        placeholder="e.g. llama3, mistral, phi3"
                        className="setting-input"
                      />
                    )}
                  </div>
                </div>

                {/* Input Builder Tabs */}
                <div className="toggle-bar">
                  <button
                    onClick={() => setInputMode("quick")}
                    className={`toggle-btn ${inputMode === "quick" ? "active" : ""}`}
                    disabled={loading}
                  >
                    Quick Pitch
                  </button>
                  <button
                    onClick={() => setInputMode("structured")}
                    className={`toggle-btn ${inputMode === "structured" ? "active" : ""}`}
                    disabled={loading}
                  >
                    Structured Builder
                  </button>
                </div>

                {/* Main Fields */}
                {inputMode === "quick" ? (
                  <textarea
                    placeholder="Describe your business idea in detail (e.g., target market, monetization, core value proposition)..."
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                    disabled={loading}
                    className="idea-input"
                  />
                ) : (
                  <div className="wizard-container">
                    <div className="wizard-field">
                      <label>Problem Statement</label>
                      <textarea
                        rows="2"
                        placeholder="What is the pain point? Who experiences it?"
                        value={structured.problem}
                        onChange={(e) => setStructured({ ...structured, problem: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="wizard-field">
                      <label>Proposed Solution & MVP</label>
                      <textarea
                        rows="2"
                        placeholder="How does your product solve the problem? What is the MVP?"
                        value={structured.solution}
                        onChange={(e) => setStructured({ ...structured, solution: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="wizard-field">
                      <label>Target Market & Competition</label>
                      <textarea
                        rows="2"
                        placeholder="Who are the competitors? What is your differentiation?"
                        value={structured.market}
                        onChange={(e) => setStructured({ ...structured, market: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                    <div className="wizard-field">
                      <label>Monetization & Cost Model</label>
                      <textarea
                        rows="2"
                        placeholder="How will you generate revenue? What are the key costs?"
                        value={structured.finance}
                        onChange={(e) => setStructured({ ...structured, finance: e.target.value })}
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Submissions row */}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {result && !loading && (
                      <button
                        onClick={() => window.print()}
                        className="btn-outline"
                      >
                        Export PDF Report
                      </button>
                    )}
                  </div>
                  <button
                    onClick={submitIdea}
                    disabled={loading || (inputMode === "quick" ? !ideaText.trim() : !structured.problem.trim())}
                    className="btn-primary"
                  >
                    {loading ? "Advising..." : "Evaluate with Council"}
                  </button>
                </div>

                {/* Progress trackers */}
                {(loading || result) && (
                  <div style={{ marginTop: "40px" }}>
                    <h3 style={{ fontSize: "1rem", marginBottom: "15px", fontWeight: "700", color: "var(--accent-color)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Council Session Status
                    </h3>
                    <div className="agents-grid">
                      {agentsList.map((agent) => {
                        const status = agentStatuses[agent.key] || "pending";
                        return (
                          <div 
                            key={agent.key} 
                            className={`agent-status-card ${status}`}
                          >
                            <span className="agent-name">{agent.name}</span>
                            <span className="agent-role">{agent.role}</span>
                            <span className={`status-badge ${status}`}>
                              {status === "pending" && "Idle"}
                              {status === "analyzing" && "Analyzing..."}
                              {status === "complete" && "Completed"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {error && (
                  <div 
                    style={{ 
                      marginTop: "20px", 
                      padding: "15px", 
                      backgroundColor: "rgba(239, 68, 68, 0.1)", 
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "8px",
                      color: "#f87171",
                      fontSize: "0.95rem"
                    }}
                  >
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {/* Results Visual Blocks */}
                {result && !loading && (
                  <div className="results-container">
                    <div className="glass-panel" style={{ padding: "24px", background: "rgba(6,182,212,0.01)" }}>
                      <div className="verdict-header">
                        <span className="verdict-title">Chairperson Report</span>
                        <span className={`verdict-badge ${getVerdictClass(result.verdict)}`}>
                          {result.verdict || "Evaluated"}
                        </span>
                      </div>

                      {scores && (
                        <div className="dashboard-grid">
                          <div className="radar-chart-container">
                            <RadarChart scores={scores} />
                          </div>
                        </div>
                      )}

                      <div className="structured-report">
                        <div style={{ marginBottom: "20px" }}>
                          <h3 style={{ color: "var(--success)", fontSize: "1rem", borderBottom: "1px solid rgba(6,182,212,0.1)", paddingBottom: "6px" }}>
                            ✓ Key Strengths
                          </h3>
                          <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                            {result.strengths && result.strengths.map((str, idx) => (
                              <li key={idx} style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
                                {parseInlineMarkdown(str)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                          <h3 style={{ color: "var(--danger)", fontSize: "1rem", borderBottom: "1px solid rgba(6,182,212,0.1)", paddingBottom: "6px" }}>
                            ⚠ Critical Risks
                          </h3>
                          <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                            {result.risks && result.risks.map((risk, idx) => (
                              <li key={idx} style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
                                {parseInlineMarkdown(risk)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                          <h3 style={{ color: "var(--info)", fontSize: "1rem", borderBottom: "1px solid rgba(6,182,212,0.1)", paddingBottom: "6px" }}>
                            ⚡ Strategic Recommendations
                          </h3>
                          <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                            {result.action_items && result.action_items.map((item, idx) => (
                              <li key={idx} style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
                                {parseInlineMarkdown(item)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {result.confidence && (
                        <div className="action-row" style={{ borderTop: "1px solid rgba(6,182,212,0.1)", paddingTop: "15px", marginTop: "20px" }}>
                          <div className="confidence-indicator">
                            <span>Consensus Confidence:</span>
                            <span className={`confidence-val ${result.confidence.toLowerCase()}`}>{result.confidence}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Specialist Tabs */}
                    {agentAnalyses && (
                      <div className="glass-panel" style={{ padding: "24px", background: "rgba(6,182,212,0.01)" }}>
                        <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent-color)" }}>Advisor Logs</h3>
                        
                        <div className="tabs-header">
                          {agentsList.map((agent) => (
                            <button
                              key={agent.key}
                              onClick={() => setActiveTab(agent.key)}
                              className={`tab-btn ${activeTab === agent.key ? "active" : ""}`}
                            >
                              {agent.name}
                            </button>
                          ))}
                        </div>

                        {agentsList.map((agent) => {
                          if (activeTab !== agent.key) return null;
                          return (
                            <div key={agent.key}>
                              <div style={{ marginBottom: "15px" }}>
                                <h4 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", fontWeight: "600" }}>{agent.name}</h4>
                                <div style={{ fontSize: "0.8rem", color: "var(--accent-color)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>{agent.role}</div>
                                <p style={{ margin: "8px 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                                  Focus: {agent.description}
                                </p>
                              </div>

                              <div 
                                key={activeTab}
                                className="markdown-content" 
                                style={{ 
                                  maxHeight: "550px", 
                                  overflowY: "auto", 
                                  paddingRight: "8px", 
                                  scrollbarWidth: "thin",
                                  borderTop: "1px solid rgba(6,182,212,0.12)",
                                  paddingTop: "15px"
                                }}
                              >
                                {renderMarkdownContent(agentAnalyses[agent.key])}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </main>
            </div>
          )}

          {/* 2. Ledger Comparison Board View */}
          {activeSection === "ledger" && (
            <div className="main-content">
              <div className="ledger-view-container">
                <div className="ledger-header">
                  <h2>Saved Session Ledger</h2>
                  <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Explore previously evaluated startups and reload summaries back into the boardroom.</p>
                </div>

                {history.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: "rgba(6,182,212,0.02)", border: "1px solid rgba(6,182,212,0.1)", borderRadius: "12px", color: "var(--text-secondary)" }}>
                    <p style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>No Saved Sessions Found</p>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Submit a startup idea in the Council Room to begin accumulating ledger entries.</p>
                    <button onClick={() => setActiveSection("evaluate")} className="btn-outline" style={{ marginTop: "16px" }}>Go to Council Room</button>
                  </div>
                ) : (
                  <div className="ledger-cards-grid">
                    {history.map((item) => (
                      <div key={item.id} className="ledger-detail-card">
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "600" }}>{item.date}</span>
                            <span className={`status-pill ${item.provider === "ollama" ? "local" : "cloud"}`} style={{ fontSize: "0.6rem" }}>
                              {item.model}
                            </span>
                          </div>
                          <h3 className="ledger-card-title">{item.title}</h3>
                          
                          {/* Display verdict info */}
                          <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Verdict:</span>
                            <span className={`verdict-badge ${getVerdictClass(item.result?.verdict)}`} style={{ fontSize: "0.72rem", padding: "2px 8px" }}>
                              {item.result?.verdict || "Evaluated"}
                            </span>
                          </div>

                          {/* Quick Score list */}
                          {item.scores && (
                            <div className="ledger-scores-summary">
                              {Object.entries(item.scores).map(([k, v]) => (
                                <span key={k} className="ledger-score-tag">
                                  {k.split("_")[0].toUpperCase()}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="ledger-actions">
                          <button 
                            onClick={() => {
                              loadHistoryItem(item);
                              setActiveSection("evaluate");
                            }}
                            className="btn-outline"
                            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
                          >
                            Load in Boardroom
                          </button>
                          <button 
                            onClick={(e) => deleteHistoryItem(e, item.id)}
                            className="btn-delete-history"
                            style={{ fontSize: "0.75rem", textDecoration: "underline" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Specs Documentation View */}
          {activeSection === "specs" && (
            <div className="main-content">
              <div className="specs-container">
                <div className="specs-title-block">
                  <h2>System Specs & Architecture</h2>
                  <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Detailed orchestration flow of the Consilium multi-agent boardroom model.</p>
                </div>

                <div className="specs-grid">
                  
                  {/* Orchestration flow */}
                  <div className="specs-card">
                    <h3>Orchestration Framework</h3>
                    <p>Consilium uses a concurrent worker architecture built on top of FastAPI and AsyncOpenAI endpoints. When an evaluation request starts:</p>
                    <ul style={{ paddingLeft: "15px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      <li style={{ marginBottom: "8px" }}><strong>Dynamic Prompt Loading:</strong> Specialized system prompts are fetched from file stores.</li>
                      <li style={{ marginBottom: "8px" }}><strong>Parallel Dispatches:</strong> 7 agents are queried in parallel via <code>asyncio.gather</code>, shrinking processing latency.</li>
                      <li style={{ marginBottom: "8px" }}><strong>Structured Contract:</strong> Verdicts undergo JSON-schema aggregation to deliver clean dashboard rendering.</li>
                    </ul>
                  </div>

                  {/* API specs */}
                  <div className="specs-card">
                    <h3>FastAPI Endpoints</h3>
                    <p>Fully documented, REST-compliant backend routing configuration:</p>
                    
                    <div className="api-route">
                      <span className="api-method post">POST</span>
                      <span>/evaluate/council</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "-4px 0 12px 12px" }}>
                      Submit pitch payload to start concurrent agent analyses.
                    </div>

                    <div className="api-route">
                      <span className="api-method get">GET</span>
                      <span>/</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "-4px 0 12px 12px" }}>
                      API health checks and active provider configurations.
                    </div>
                  </div>

                  {/* Agent Profiles */}
                  <div className="specs-card" style={{ gridColumn: "1 / -1" }}>
                    <h3>Boardroom Agent Configuration</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "15px", marginTop: "12px" }}>
                      {agentsList.map((agent) => (
                        <div key={agent.key} style={{ padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(6,182,212,0.06)" }}>
                          <span style={{ fontWeight: "700", color: "#fff", display: "block" }}>{agent.name}</span>
                          <span style={{ fontSize: "0.72rem", color: "var(--accent-color)", fontWeight: "600", textTransform: "uppercase" }}>{agent.role}</span>
                          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>{agent.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* System Telemetry stats bar (Nuorbit-inspired metrics footer) */}
          <div className="telemetry-bar">
            <div className="telemetry-item">
              <span className="telemetry-val">7 / 7</span>
              <span className="telemetry-lbl">Active Specialists</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-val">ASYNC</span>
              <span className="telemetry-lbl">Orchestration</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-val">JSON</span>
              <span className="telemetry-lbl">Data Schema</span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-val">{provider === "ollama" ? "LOCAL" : "CLOUD"}</span>
              <span className="telemetry-lbl">Provider Mode</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
