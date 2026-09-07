import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword({ darkMode, onToggleTheme }) {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // RESET PASSWORD
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Check empty fields
    if (!password || !confirmPassword) {
      setError("Please enter your new password and confirm it.");
      return;
    }

    // Minimum password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reset-password/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            uid: uid,
            token: token,
            password: password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to reset your password. Please try again.",
        );

        setLoading(false);
        return;
      }

      // Password successfully changed
      setSuccess(data.message || "Password reset successfully.");

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        "Unable to connect to the server. Please make sure Django is running.",
      );
    }

    setLoading(false);
  };

  // =====================================
  // BACK TO LOGIN
  // =====================================

  const handleBackToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={
        darkMode ? "reset-password-page dark-mode" : "reset-password-page"
      }
    >
      {/* =====================================
          THEME BUTTON
      ===================================== */}

      {onToggleTheme && (
        <button
          type="button"
          className="reset-theme-button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      )}

      {/* =====================================
          RESET PASSWORD CARD
      ===================================== */}

      <div className="reset-password-card">
        {/* Logo / Brand */}

        <div className="reset-logo">
          <div className="reset-logo-icon">💰</div>

          <span>Expense Tracker</span>
        </div>

        {/* Heading */}

        <h1>Reset Password</h1>

        <p className="reset-subtitle">
          Create a new password for your Expense Tracker account.
        </p>

        {/* =====================================
            ERROR MESSAGE
        ===================================== */}

        {error && (
          <div className="reset-message reset-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* =====================================
            SUCCESS MESSAGE
        ===================================== */}

        {success && (
          <div className="reset-message reset-success">
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        {/* =====================================
            FORM
        ===================================== */}

        {!success && (
          <form onSubmit={handleSubmit} className="reset-form">
            {/* New Password */}

            <div className="reset-input-group">
              <label htmlFor="new-password">New Password</label>

              <div className="reset-password-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <small>Password must contain at least 6 characters.</small>
            </div>

            {/* Confirm Password */}

            <div className="reset-input-group">
              <label htmlFor="confirm-password">Confirm Password</label>

              <div className="reset-password-wrapper">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  disabled={loading}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password Match Indicator */}

            {confirmPassword && (
              <div
                className={
                  password === confirmPassword
                    ? "password-match valid"
                    : "password-match invalid"
                }
              >
                {password === confirmPassword
                  ? "✓ Passwords match"
                  : "✕ Passwords do not match"}
              </div>
            )}

            {/* Submit */}

            <button type="submit" className="reset-button" disabled={loading}>
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* =====================================
            SUCCESS → LOGIN
        ===================================== */}

        {success && (
          <button
            type="button"
            className="back-login-button"
            onClick={handleBackToLogin}
          >
            ← Back to Login
          </button>
        )}

        {/* Security message */}

        <p className="reset-security">🔒 Your password is securely updated.</p>
      </div>
    </div>
  );
}

export default ResetPassword;
