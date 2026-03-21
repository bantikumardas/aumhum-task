import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    overflow: hidden;
    position: relative;
  }

  /* Animated background blobs */
  .login-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: float 8s ease-in-out infinite;
  }
  .blob-1 {
    width: 500px; height: 500px;
    background: #6366f1;
    top: -150px; left: -100px;
    animation-delay: 0s;
  }
  .blob-2 {
    width: 400px; height: 400px;
    background: #22c55e;
    bottom: -100px; right: -80px;
    animation-delay: -3s;
  }
  .blob-3 {
    width: 300px; height: 300px;
    background: #f59e0b;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -6s;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }
  .blob-3 {
    animation-name: floatCenter;
  }
  @keyframes floatCenter {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -60%) scale(1.08); }
  }

  /* Grid lines */
  .login-grid {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  /* Left panel */
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    position: relative;
    z-index: 1;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 80px;
  }
  .brand-dot {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #6366f1, #22c55e);
    box-shadow: 0 0 20px rgba(99,102,241,0.5);
  }
  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }
  .hero-text {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 4vw, 56px);
    font-weight: 800;
    color: #fff;
    line-height: 1.1;
    letter-spacing: -2px;
    margin-bottom: 20px;
  }
  .hero-text .accent {
    background: linear-gradient(90deg, #6366f1, #22c55e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .hero-sub {
    font-size: 16px;
    color: rgba(255,255,255,0.45);
    line-height: 1.6;
    max-width: 380px;
    font-weight: 300;
  }
  .features {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
    color: rgba(255,255,255,0.6);
    font-size: 14px;
  }
  .feature-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  /* Right panel — the form card */
  .login-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    z-index: 1;
  }
  .login-card {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px;
    padding: 48px 44px;
    backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(99,102,241,0.1),
      0 40px 80px rgba(0,0,0,0.5);
    animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 6px;
    letter-spacing: -1px;
  }
  .card-sub {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 36px;
    font-weight: 300;
  }

  /* Form */
  .field {
    margin-bottom: 20px;
  }
  .field label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .input-wrap {
    position: relative;
  }
  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    opacity: 0.4;
    pointer-events: none;
  }
  .field input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    padding: 13px 14px 13px 42px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .field input::placeholder { color: rgba(255,255,255,0.2); }
  .field input:focus {
    border-color: rgba(99,102,241,0.6);
    background: rgba(99,102,241,0.07);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
  }
  .eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    line-height: 1;
    transition: color 0.2s;
  }
  .eye-btn:hover { color: rgba(255,255,255,0.7); }

  /* Error */
  .error-msg {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    color: #fca5a5;
    font-size: 13px;
    padding: 10px 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: shake 0.3s ease;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-6px); }
    75% { transform: translateX(6px); }
  }

  /* Submit button */
  .btn-login {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
  }
  .btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99,102,241,0.55);
  }
  .btn-login:active:not(:disabled) { transform: translateY(0); }
  .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
  .btn-login .shine {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
    transform: translateX(-100%);
    animation: shine 2s infinite;
  }
  @keyframes shine {
    to { transform: translateX(100%); }
  }

  /* Spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .divider {
    text-align: center;
    color: rgba(255,255,255,0.2);
    font-size: 12px;
    margin: 24px 0 0;
    letter-spacing: 0.05em;
  }

  @media (max-width: 900px) {
    .login-left { display: none; }
    .login-right { width: 100%; padding: 24px; }
  }
`;

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenType", data.type);
      setIsLoggedIn(true);
      navigate("/splitwise");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        {/* Background */}
        <div className="login-bg">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="login-grid" />

        {/* Left panel */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-dot" />
            <span className="brand-name">SplitMate</span>
          </div>
          <div className="hero-text">
            Split bills,<br />
            not <span className="accent">friendships.</span>
          </div>
          <p className="hero-sub">
            The smart way to track shared expenses with groups, trips, and roommates.
          </p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              Instant balance calculation
            </div>
            <div className="feature-item">
              <div className="feature-icon">🏷️</div>
              Organize by groups & trips
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              Secure JWT authentication
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-right">
          <div className="login-card">
            <div className="card-title">Welcome back</div>
            <div className="card-sub">Sign in to continue to SplitMate</div>

            {error && (
              <div className="error-msg">
                <span>⚠</span> {error}
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-icon">🔑</span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPw((p) => !p)}
                  tabIndex={-1}
                >
                  {showPw ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn-login"
              onClick={handleLogin}
              disabled={loading}
            >
              <span className="shine" />
              {loading ? (
                <><span className="spinner" />Signing in...</>
              ) : (
                "Sign In →"
              )}
            </button>

            <div className="divider">
              Token is stored securely in localStorage
            </div>
          </div>
        </div>
      </div>
    </>
  );
}