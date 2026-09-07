import { useState } from "react";
import api from "../api/api";
import "./Register.css";
import expenseLogo from "../assets/expense-logo.png";

function Register({
  onRegister,
  onBackToLogin,
  darkMode,
  onToggleTheme,
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("register/", {
        username,
        email,
        password,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.username);

      onRegister(token);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.username?.[0] ||
          error.response?.data?.password?.[0] ||
          error.response?.data?.email?.[0] ||
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`register-page ${darkMode ? "dark-mode" : ""}`}>
      {/* =====================================
          THEME SWITCH
      ====================================== */}
      <div className="register-theme-control">
        <span className="register-theme-icon">
          {darkMode ? "🌙" : "☀️"}
        </span>

        <span className="register-theme-text">
          {darkMode
            ? "Dark mode enabled"
            : "We recommend dark mode for better experience"}
        </span>

        <button
          type="button"
          className={`register-theme-toggle ${
            darkMode ? "dark" : ""
          }`}
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <span className="register-theme-circle"></span>
        </button>
      </div>

      {/* =====================================
          BACKGROUND GLOW
      ====================================== */}
      <div className="register-glow glow-one"></div>
      <div className="register-glow glow-two"></div>

      {/* =====================================
          REGISTER CARD
      ====================================== */}
      <div className="register-card">

        {/* HEADER */}
        <div className="register-header">
          <img
            src={expenseLogo}
            alt="Expense Tracker Logo"
            className="register-logo"
          />

          <h1>Expense Tracker</h1>

          <h2>Create Account</h2>

          <p>
            Take control of your money.
            <br />
            <span>Track. Manage. Grow.</span>
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister}>

          {/* USERNAME */}
          <div className="register-field">
            <label htmlFor="register-username">
              Username
            </label>

            <div className="input-wrapper">
              <span className="input-icon">👤</span>

              <input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="register-field">
            <label htmlFor="register-email">
              Email
            </label>

            <div className="input-wrapper">
              <span className="input-icon">✉</span>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="register-field">
            <label htmlFor="register-password">
              Password
            </label>

            <div className="input-wrapper">
              <span className="input-icon">🔒</span>

              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="register-field">
            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>

            <div className="input-wrapper">
              <span className="input-icon">🔐</span>

              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm password"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="register-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* REGISTER BUTTON */}
          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* LOGIN */}
        <div className="register-login">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={onBackToLogin}
          >
            Login
          </button>
        </div>

        {/* FOOTER */}
        <div className="register-footer">
          <span>Secure</span>
          <span>•</span>
          <span>Simple</span>
          <span>•</span>
          <span>Smart</span>
        </div>
      </div>
    </div>
  );
}

export default Register;