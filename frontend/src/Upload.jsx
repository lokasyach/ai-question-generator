import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, generateQuestions } from "./api";
import Navbar from "./Navbar";

function Upload() {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState("");
  const [step, setStep] = useState("upload"); // upload -> uploading -> generating
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setError("");
    setStep("uploading");

    try {
      const uploadRes = await uploadFile(file);
      const fileId = uploadRes.data.file_id;

      setStep("generating");
      const questionsRes = await generateQuestions(fileId, numQuestions);

      navigate("/results", {
        state: { questions: questionsRes.data.questions, filename: uploadRes.data.filename },
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
      setStep("upload");
    }
  };

  const isBusy = step === "uploading" || step === "generating";

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>Upload a Document</h2>
          <p style={styles.subtitle}>
            Upload a PDF, DOCX, or TXT file. Works best with factual, textbook-style content.
          </p>

          <form onSubmit={handleUpload}>
            <label style={styles.dropzone}>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div style={styles.dropzoneIcon}>📄</div>
              <div style={styles.dropzoneText}>
                {file ? file.name : "Click to choose a file, or drag it here"}
              </div>
              <div style={styles.dropzoneHint}>PDF, DOCX, or TXT — up to 10MB</div>
            </label>

            <div style={styles.field}>
              <label style={styles.label}>Number of questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                style={styles.select}
              >
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
                <option value={15}>15 questions</option>
                <option value={20}>20 questions</option>
              </select>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" disabled={isBusy} style={styles.submitBtn}>
              {step === "uploading" && (
                <>
                  <span style={styles.spinner} /> Uploading file...
                </>
              )}
              {step === "generating" && (
                <>
                  <span style={styles.spinner} /> Generating questions (~30-60s)...
                </>
              )}
              {step === "upload" && "Upload & Generate Questions"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-primary)",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 70px)",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "520px",
    boxShadow: "0 8px 24px var(--shadow)",
  },
  title: {
    fontSize: "26px",
    fontWeight: 800,
    color: "var(--text-primary)",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginBottom: "28px",
    lineHeight: 1.5,
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed var(--border-color)",
    borderRadius: "12px",
    padding: "40px 20px",
    cursor: "pointer",
    backgroundColor: "var(--bg-secondary)",
    marginBottom: "20px",
    textAlign: "center",
  },
  dropzoneIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },
  dropzoneText: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "6px",
  },
  dropzoneHint: {
    fontSize: "13px",
    color: "var(--text-secondary)",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "6px",
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
  },
  error: {
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "12px",
  },
  submitBtn: {
    width: "100%",
    background: "var(--accent-primary)",
    color: "#fff",
    border: "none",
    padding: "13px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.4)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
};

export default Upload;