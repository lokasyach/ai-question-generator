import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadFile, generateQuestions } from "./api";

function Upload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("upload"); // upload -> generating -> done
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setError("");
    setLoading(true);
    setStep("uploading");

    try {
      const uploadRes = await uploadFile(file);
      const fileId = uploadRes.data.file_id;

      setStep("generating");
      const questionsRes = await generateQuestions(fileId, 5);

      // Pass questions to results page via navigation state
      navigate("/results", { state: { questions: questionsRes.data.questions, filename: uploadRes.data.filename } });
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
      setStep("upload");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "100px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Upload a Document</h2>
        <button onClick={handleLogout} style={{ height: "35px" }}>Logout</button>
      </div>
      <p>Upload a PDF, DOCX, or TXT file to generate questions from it.</p>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} style={{ marginBottom: "10px" }} />
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
          {step === "uploading" && "Uploading..."}
          {step === "generating" && "Generating questions (this takes ~20-30 seconds)..."}
          {step === "upload" && "Upload & Generate Questions"}
        </button>
      </form>
    </div>
  );
}

export default Upload;