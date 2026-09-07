import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./ForgotPassword.css";
import logo from "../assets/expense-logo.png";

function ForgotPassword({
  darkMode,
  onToggleTheme,
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // SUBMIT FORGOT PASSWORD
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("forgot-credentials/", {
        email: trimmedEmail,
      });

      /*
       * Your Django backend should return a success response
       * when the email belongs to a registered user.
       */
      setMessage(
        response.data?.message ||
          "A password reset link has been sent to your registered email address."
      );

      setEmail("");
    } catch (error) {
      console.error("Forgot password error:", error);

      /*
       * If the backend explicitly tells us that the email
       * is not registered, show that message.
       */
      const responseData = error.response?.data;

      const backendMessage =
        responseData?.error ||
        responseData?.detail ||
        responseData?.message;

      if (
        error.response?.status === 404 ||
        error.response?.status === 400 ||
        backendMessage?.toLowerCase().includes("not registered") ||
        backendMessage?.toLowerCase().includes("not found") ||
        backendMessage?.toLowerCase().includes("does not exist")
      ) {
        setError(
          "You are not a registered user. Please check your email address."
        );
      } else {
        setError(
          backendMessage ||
            "Unable to send the password reset link. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // BACK TO LOGIN
  // =====================================

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className={`forgot-password-page ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      {/* =====================================
          THEME SWITCH
      ====================================== */}

      <div className="forgot-theme-control">
        <span className="forgot-theme-icon">
          {darkMode ? "🌙" : "☀️"}
        </span>

        <span className="forgot-theme-text">
          {darkMode
            ? "Dark mode enabled"
            : "We recommend dark mode for better experience"}
        </span>

        <button
          type="button"
          className={`forgot-theme-toggle ${
            darkMode ? "dark" : ""
          }`}
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          <span className="forgot-theme-circle"></span>
        </button>
      </div>

      {/* =====================================
          BACKGROUND GLOW
      ====================================== */}

      <div className="forgot-glow forgot-glow-one"></div>
      <div className="forgot-glow forgot-glow-two"></div>

      {/* =====================================
          CARD
      ====================================== */}

      <div className="forgot-password-card">

        {/* LOGO */}

        <div className="forgot-logo">
          <img
            src={logo}
            alt="Expense Tracker Logo"
          />
        </div>

        {/* HEADER */}

        <div className="forgot-header">
          <h1>Forgot Password?</h1>

          <p>
            Enter your registered email address.
            <br />
            If the email exists in our database,
            <br />
            we will send you a password reset link.
          </p>
        </div>

        {/* =====================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (
          <div className="forgot-message forgot-success">
            <span className="forgot-message-icon">✓</span>

            <div>
              <strong>Password reset link sent</strong>

              <p>{message}</p>
            </div>
          </div>
        )}

        {/* =====================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div className="forgot-message forgot-error">
            <span className="forgot-message-icon">!</span>

            <div>
              <strong>Email not found</strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        {/* =====================================
            FORM
        ====================================== */}

        <form
          className="forgot-form"
          onSubmit={handleSubmit}
        >
          <div className="forgot-field">
            <label htmlFor="forgot-email">
              Registered Email Address
            </label>

            <div className="forgot-input-wrapper">
              <span className="forgot-input-icon">
                ✉
              </span>

              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your registered email"
                autoComplete="email"
                disabled={loading || Boolean(message)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="forgot-submit-button"
            disabled={loading || Boolean(message)}
          >
            {loading
              ? "Sending Reset Link..."
              : "Send Reset Link"}
          </button>
        </form>

        {/* =====================================
            BACK TO LOGIN
        ====================================== */}

        <button
          type="button"
          className="forgot-back-button"
          onClick={handleBackToLogin}
        >
          ← Back to Login
        </button>

        {/* FOOTER */}

        <div className="forgot-footer">
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

export default ForgotPassword;