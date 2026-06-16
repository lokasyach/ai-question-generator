import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(username, email, password);
        setIsRegister(false);
        setError("Account created! Please log in.");
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
    <div style={{ maxWidth: "400px", margin: "100px auto", fontFamily: "sans-serif" }}>
      <h2>{isRegister ? "Create Account" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </button>
      </form>
      <p style={{ marginTop: "10px", cursor: "pointer", color: "blue" }} onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Need an account? Register"}
      </p>
    </div>
  );
}

export default Login;