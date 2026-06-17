import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, filename } = location.state || { questions: [], filename: "" };

  const difficultyColor = {
    easy: { bg: "#dcfce7", text: "#166534" },
    medium: { bg: "#fef9c3", text: "#854d0e" },
    hard: { bg: "#fee2e2", text: "#991b1b" },
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.title}>Generated Questions</h2>
          <p style={styles.subtitle}>
            From file: <strong>{filename}</strong> · {questions.length} questions generated
          </p>
        </div>

        {questions.length === 0 && (
          <div style={styles.emptyState}>
            <p>No questions were generated. Try a different file.</p>
          </div>
        )}

        <div style={styles.list}>
          {questions.map((q, index) => {
            const colors = difficultyColor[q.difficulty] || difficultyColor.medium;
            return (
              <div key={q.id || index} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.qNumber}>Q{index + 1}</span>
                  <span style={{ ...styles.badge, backgroundColor: colors.bg, color: colors.text }}>
                    {q.difficulty}
                  </span>
                </div>
                <p style={styles.question}>{q.question}</p>
                <div style={styles.answerBox}>
                  <span style={styles.answerLabel}>Answer</span>
                  <p style={styles.answer}>{q.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.actions}>
          <button onClick={() => navigate("/upload")} style={styles.primaryBtn}>
            Upload Another File
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-primary)",
  },
  wrapper: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "48px 20px 80px",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "var(--text-secondary)",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 4px 12px var(--shadow)",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  qNumber: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--accent-primary)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  badge: {
    fontSize: "12px",
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: "6px",
    textTransform: "capitalize",
  },
  question: {
    fontSize: "17px",
    fontWeight: 600,
    color: "var(--text-primary)",
    lineHeight: 1.5,
    marginBottom: "14px",
  },
  answerBox: {
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "8px",
    padding: "12px 14px",
  },
  answerLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  answer: {
    fontSize: "14px",
    color: "var(--text-primary)",
    marginTop: "4px",
  },
  actions: {
    marginTop: "32px",
    textAlign: "center",
  },
  primaryBtn: {
    background: "var(--accent-primary)",
    color: "#fff",
    border: "none",
    padding: "13px 28px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
  },
};

export default Results;