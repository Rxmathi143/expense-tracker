import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Login.css";
import logo from "../assets/expense-logo.png";

function Login({ onLogin, onRegister, darkMode, onToggleTheme }) {

  const navigate = useNavigate();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("login/", {
        username,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      onLogin(token);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.non_field_errors?.[0] ||
          "Invalid username or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-page ${darkMode ? "dark-mode" : ""}`}>
      {/* =========================
          THEME SWITCH
      ========================== */}
      <div className="theme-switch">
        <span className="theme-icon">{darkMode ? "🌙" : "☀️"}</span>

        <button
          type="button"
          className={`theme-toggle ${darkMode ? "dark" : ""}`}
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
        >
          <span className="theme-toggle-circle"></span>
        </button>
      </div>

      {/* =========================
          BACKGROUND GLOW
      ========================== */}
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      {/* =========================
          MAIN CONTAINER
      ========================== */}
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <img src={logo} alt="Expense Tracker Logo" />
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h1>Expense Tracker</h1>

          <p>Manage your money smarter</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-card-heading">
            <h2>Welcome Back</h2>

            <p>Login to continue to your dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Username */}
            <div className="login-field">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="login-forgot-password">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Error */}
            {error && <div className="login-error">{error}</div>}

            {/* Login Button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Register */}
            <div className="login-register">
              <span>Don't have an account?</span>

              <button type="button" onClick={onRegister}>
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="login-footer">Secure token-based authentication</p>
      </div>
    </div>
  );
}

export default Login;
