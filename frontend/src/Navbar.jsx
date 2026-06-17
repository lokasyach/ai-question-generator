import { useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate("/")}>
        <span style={styles.logoIcon}>📘</span> QuizGen AI
      </div>

      <div style={styles.actions}>
        <button onClick={toggleTheme} style={styles.themeBtn} aria-label="Toggle theme">
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {isLoggedIn ? (
          <button onClick={handleLogout} style={styles.outlineBtn}>
            Logout
          </button>
        ) : (
          <>
            <button onClick={() => navigate("/login")} style={styles.outlineBtn}>
              Login
            </button>
            <button onClick={() => navigate("/login")} style={styles.primaryBtn}>
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    borderBottom: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-card)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: "20px",
    fontWeight: 700,
    cursor: "pointer",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    fontSize: "22px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  themeBtn: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    width: "38px",
    height: "38px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtn: {
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    padding: "9px 18px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
  },
  primaryBtn: {
    background: "var(--accent-primary)",
    border: "none",
    color: "#fff",
    padding: "9px 18px",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
  },
};

export default Navbar;