import React from "react";
import expenseLogo from "../assets/expense-logo.png";
import "./ETLanding.css";

function ETLanding({ onStartTracking, darkMode, onToggleTheme }) {
  return (
    <div className={`et-landing ${darkMode ? "dark-mode" : ""}`}>
      {/* =========================
          GOOGLE FONTS
      ========================== */}

      <link rel="preconnect" href="https://fonts.googleapis.com" />

      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* =========================
          NAVIGATION
      ========================== */}

      <nav className="et-nav">
        {/* BRAND */}

        <div className="et-brand">
          <img src={expenseLogo} alt="Expense Tracker Logo" />

          <span>Expense Tracker</span>
        </div>

        {/* NAV LINKS */}

        <div className="et-nav-links et-nav-mobile-hide">
          <a href="#home">Home</a>

          <a href="#how">How it works</a>

          <a href="#features">Features</a>
        </div>

        {/* NAV ACTIONS */}

        <div className="et-nav-actions">
          {/* THEME SWITCH */}

          <div className="theme-switch">
            <span className="theme-icon">{darkMode ? "🌙" : "☀️"}</span>

            <span className="theme-recommendation">
              We recommend you to use dark mode for better experience
            </span>



            <button
              type="button"
              className={`theme-toggle ${darkMode ? "dark" : ""}`}
              onClick={onToggleTheme}
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              <span className="theme-toggle-circle"></span>
            </button>
          </div>

        </div>
      </nav>

      {/* =========================
          HERO
      ========================== */}

      <section className="et-hero" id="home">
        <div className="et-hero-content">
          <div className="et-eyebrow">Spend smarter</div>

          <h1 className="et-headline">
            Every rupee.
            <br />
            <em>Accounted for.</em>
          </h1>

          <p className="et-subcopy">
            Expense Tracker turns scattered spending into one clear, simple view
            — so you always know what came in, what went out, and what's
            actually left to save.
          </p>

          <div className="et-cta-row">
            <button
              type="button"
              className="et-btn-primary"
              onClick={onStartTracking}
            >
              Start Tracking
              <span>→</span>
            </button>

            <a href="#how" className="et-btn-ghost">
              See how it works →
            </a>
          </div>

          <div className="et-hero-note">
            <span>✓</span>
            Simple expense tracking
            <span>✓</span>
            Clear analytics
          </div>
        </div>

        {/* RECEIPT */}

        <div className="et-receipt-wrap">
          <div className="et-receipt">
            <div className="et-receipt-badge">ON BUDGET</div>

            <div className="et-receipt-head">
              <img src={expenseLogo} alt="Expense Tracker" />

              <div>
                Expense Tracker
                <small>MONTHLY LEDGER</small>
              </div>
            </div>

            <div className="et-receipt-date">MARCH 01 — MARCH 26</div>

            <div className="et-receipt-line">
              <span>Rent</span>

              <span>₹12,000</span>
            </div>

            <div className="et-receipt-line">
              <span>Food</span>

              <span>₹2,450</span>
            </div>

            <div className="et-receipt-line">
              <span>Transport</span>

              <span>₹1,120</span>
            </div>

            <div className="et-receipt-line">
              <span>Subscriptions</span>

              <span>₹880</span>
            </div>

            <hr className="et-receipt-divider" />

            <div className="et-receipt-total">
              <span>Balance</span>

              <span>₹18,450</span>
            </div>

            <div className="et-receipt-status">
              <span className="et-status-dot"></span>
              Spending under control
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section className="et-steps" id="how">
        <div className="et-section-head">
          <div className="et-section-eyebrow">How it works</div>

          <h2 className="et-section-title">Three steps to a clear ledger.</h2>

          <p className="et-section-description">
            No complicated spreadsheets. Just a simple way to understand where
            your money goes.
          </p>
        </div>

        <div className="et-steps-grid">
          <div className="et-step-card">
            <div className="et-step-num">01</div>

            <div className="et-step-line"></div>

            <h3 className="et-step-title">Log what you spend</h3>

            <p className="et-step-desc">
              Add your income or expense in seconds and organize it into the
              right category.
            </p>
          </div>

          <div className="et-step-card">
            <div className="et-step-num">02</div>

            <div className="et-step-line"></div>

            <h3 className="et-step-title">Understand your money</h3>

            <p className="et-step-desc">
              See your income, expenses, balance and spending categories in one
              clear dashboard.
            </p>
          </div>

          <div className="et-step-card">
            <div className="et-step-num">03</div>

            <div className="et-step-line"></div>

            <h3 className="et-step-title">Make smarter decisions</h3>

            <p className="et-step-desc">
              Use your spending insights to control expenses and work towards
              your financial goals.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}

      <section className="et-features" id="features">
        <div className="et-section-head">
          <div className="et-section-eyebrow">Features</div>

          <h2 className="et-section-title">
            Everything you need to track your money.
          </h2>

          <p className="et-section-description">
            Designed to make personal finance easier, clearer and more useful.
          </p>
        </div>

        <div className="et-features-grid">
          <div className="et-feature-card">
            <div className="et-feature-icon">₹</div>

            <h3 className="et-feature-title">Quick Transactions</h3>

            <p className="et-feature-desc">
              Add income and expenses quickly without unnecessary steps.
            </p>
          </div>

          <div className="et-feature-card">
            <div className="et-feature-icon">◈</div>

            <h3 className="et-feature-title">Smart Categories</h3>

            <p className="et-feature-desc">
              Organize your spending into meaningful categories and understand
              your habits.
            </p>
          </div>

          <div className="et-feature-card">
            <div className="et-feature-icon">◒</div>

            <h3 className="et-feature-title">Live Analytics</h3>

            <p className="et-feature-desc">
              Visualize your spending and income with clear, live financial
              insights.
            </p>
          </div>

          <div className="et-feature-card">
            <div className="et-feature-icon">↗</div>

            <h3 className="et-feature-title">Financial Overview</h3>

            <p className="et-feature-desc">
              Know your balance and spending position at a glance.
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          CTA
      ========================== */}

      <section className="et-cta-band">
        <div className="et-cta-inner">
          <div className="et-cta-content">
            <div className="et-section-eyebrow">Your money. Your control.</div>

            <h3>Start your financial journey today.</h3>

            <p>Track every rupee. Understand every expense.</p>
          </div>

          <button
            type="button"
            className="et-btn-primary"
            onClick={onStartTracking}
          >
            Start Tracking
            <span>→</span>
          </button>
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer className="et-footer">
        <div className="et-footer-inner">
          <div className="et-footer-brand">
            <img src={expenseLogo} alt="Expense Tracker Logo" />

            <span>Expense Tracker</span>
          </div>

          <div className="et-footer-note">
            © 2026 Expense Tracker. Every rupee, accounted for.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ETLanding;
