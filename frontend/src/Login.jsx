import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./api";
import Navbar from "./Navbar";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(username, email, password);
        setIsRegister(false);
        setSuccess("Account created! Please log in.");
      } else {
        const res = await loginUser(email, password);
        localStorage.setItem("token", res.data.access_token);
        navigate("/upload");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>{isRegister ? "Create your account" : "Welcome back"}</h2>
          <p style={styles.subtitle}>
            {isRegister ? "Start generating quizzes in seconds" : "Log in to continue to your dashboard"}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {isRegister && (
              <div style={styles.field}>
                <label style={styles.label}>Username</label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
            )}
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Log In"}
            </button>
          </form>

          <p style={styles.switchText}>
            {isRegister ? "Already have an account?" : "Need an account?"}{" "}
            <span style={styles.switchLink} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? "Log in" : "Register"}
            </span>
          </p>
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
    maxWidth: "420px",
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
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  input: {
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
  },
  success: {
    color: "#22c55e",
    fontSize: "13px",
    fontWeight: 500,
  },
  submitBtn: {
    background: "var(--accent-primary)",
    color: "#fff",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "8px",
  },
  switchText: {
    textAlign: "center",
    fontSize: "14px",
    color: "var(--text-secondary)",
    marginTop: "24px",
  },
  switchLink: {
    color: "var(--accent-primary)",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Login;