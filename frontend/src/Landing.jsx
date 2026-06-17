import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>✨ Powered by Fine-Tuned AI</div>
        <h1 style={styles.heroTitle}>
          Turn Any Document Into <span style={styles.highlight}>Smart Quiz Questions</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Upload a PDF, Word doc, or text file. Our AI reads it and instantly generates
          high-quality questions and answers — perfect for students, teachers, and trainers.
        </p>
        <div style={styles.heroActions}>
          <button onClick={() => navigate("/login")} style={styles.ctaPrimary}>
            Get Started Free
          </button>
          <button onClick={() => navigate("/login")} style={styles.ctaSecondary}>
            See How It Works
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why QuizGen AI?</h2>
        <div style={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.steps}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.stepGrid}>
          {steps.map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{i + 1}</div>
              <h3 style={styles.featureTitle}>{s.title}</h3>
              <p style={styles.featureText}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={styles.finalCta}>
        <h2 style={styles.finalCtaTitle}>Ready to generate your first quiz?</h2>
        <button onClick={() => navigate("/login")} style={styles.ctaPrimary}>
          Start Now — It's Free
        </button>
      </section>

      <footer style={styles.footer}>
        <p>© 2026 QuizGen AI. Built as a learning project.</p>
      </footer>
    </div>
  );
}

const features = [
  { icon: "⚡", title: "Instant Generation", text: "Upload a document and get questions in under a minute." },
  { icon: "🎯", title: "Difficulty Levels", text: "Questions are automatically tagged easy, medium, or hard." },
  { icon: "🔒", title: "Secure & Private", text: "Your documents and account are protected with industry-standard encryption." },
];

const steps = [
  { title: "Upload", text: "Drop in a PDF, DOCX, or TXT file." },
  { title: "AI Processes", text: "Our fine-tuned model reads and understands the content." },
  { title: "Get Questions", text: "Receive ready-to-use questions and answers instantly." },
];

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  hero: {
    textAlign: "center",
    padding: "100px 20px 80px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroBadge: {
    display: "inline-block",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "20px",
    padding: "6px 16px",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--accent-primary)",
    marginBottom: "24px",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: 800,
    lineHeight: 1.2,
    marginBottom: "20px",
  },
  highlight: {
    color: "var(--accent-primary)",
  },
  heroSubtitle: {
    fontSize: "18px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    marginBottom: "36px",
  },
  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  ctaPrimary: {
    background: "var(--accent-primary)",
    color: "#fff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 700,
  },
  ctaSecondary: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 700,
  },
  features: {
    padding: "80px 20px",
    backgroundColor: "var(--bg-secondary)",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: 800,
    marginBottom: "48px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  featureCard: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "32px 24px",
    boxShadow: "0 4px 12px var(--shadow)",
  },
  featureIcon: {
    fontSize: "32px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  featureText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  },
  steps: {
    padding: "80px 20px",
  },
  stepGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  stepCard: {
    textAlign: "center",
    padding: "24px",
  },
  stepNumber: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "var(--accent-primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "18px",
    margin: "0 auto 16px",
  },
  finalCta: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "var(--bg-secondary)",
  },
  finalCtaTitle: {
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "28px",
  },
  footer: {
    textAlign: "center",
    padding: "32px",
    color: "var(--text-secondary)",
    fontSize: "13px",
    borderTop: "1px solid var(--border-color)",
  },
};

export default Landing;