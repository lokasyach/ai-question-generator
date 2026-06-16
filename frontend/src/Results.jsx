import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, filename } = location.state || { questions: [], filename: "" };

  return (
    <div style={{ maxWidth: "700px", margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Generated Questions</h2>
      <p>From file: <strong>{filename}</strong></p>

      {questions.length === 0 && <p>No questions were generated.</p>}

      {questions.map((q, index) => (
        <div
          key={q.id || index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p style={{ fontWeight: "bold" }}>
            Q{index + 1}: {q.question}
          </p>
          <p style={{ color: "#444" }}>Answer: {q.answer}</p>
          <span
            style={{
              fontSize: "12px",
              padding: "3px 8px",
              borderRadius: "4px",
              background: q.difficulty === "hard" ? "#fdd" : q.difficulty === "medium" ? "#ffd" : "#dfd",
            }}
          >
            {q.difficulty}
          </span>
        </div>
      ))}

      <button onClick={() => navigate("/upload")} style={{ padding: "10px 20px" }}>
        Upload Another File
      </button>
    </div>
  );
}

export default Results;