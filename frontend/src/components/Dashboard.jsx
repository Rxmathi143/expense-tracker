import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import api from "../api/api";
import Transactions from "./Transactions";
import "./Dashboard.css";
import ExpenseChart from "./ExpenseChart";
import Sidebar from "./Sidebar";
import Profile from "./Profile";

function Dashboard({ onLogout, darkMode, onToggleTheme }) {
  const location = useLocation();

  const activePage =
    location.pathname === "/dashboard/transactions"
      ? "transactions"
      : location.pathname === "/dashboard/analytics"
        ? "analytics"
        : location.pathname === "/dashboard/profile"
          ? "profile"
          : "dashboard";

  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    onLogout();
  }, [onLogout]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("dashboard/");
        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);

        if (error.response?.status === 401) {
          handleUnauthorized();
          return;
        }

        setError("Failed to load dashboard.");
      }
    };

    fetchDashboard();
  }, [handleUnauthorized]);

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!dashboard) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  const formatMoney = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  return (
    <div className={`app-layout ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* SIDEBAR */}

      <Sidebar
        onLogout={onLogout}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}

      <main className="main-content">
        {/* MOBILE MENU */}

        <button
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          ☰
        </button>

        <div className="dashboard-page">
          {/* =====================================================
              DASHBOARD PAGE
          ===================================================== */}

          {activePage === "dashboard" && (
            <>
              {/* HEADER */}

              <header className="dashboard-header">
                <div className="brand">
                  <div className="brand-icon">₹</div>

                  <div>
                    <h1>Expense Tracker</h1>

                    <span>Manage your money smarter</span>
                  </div>
                </div>

                {/* THEME SWITCH */}

                <div className="theme-switch">
                  <span className="theme-icon">{darkMode ? "🌙" : "☀️"}</span>

                  <button
                    type="button"
                    className={`theme-toggle ${darkMode ? "dark" : "light"}`}
                    onClick={onToggleTheme}
                    aria-label="Toggle theme"
                  >
                    <span className="theme-toggle-circle"></span>
                  </button>
                </div>
              </header>

              {/* =====================================================
                  SUMMARY CARDS
              ===================================================== */}

              <section className="summary-grid">
                {/* INCOME */}

                <div className="summary-card income-card">
                  <div className="card-icon">↗</div>

                  <div>
                    <p>Total Income</p>

                    <h2>{formatMoney(dashboard.total_income)}</h2>
                  </div>
                </div>

                {/* EXPENSE */}

                <div className="summary-card expense-card">
                  <div className="card-icon">↘</div>

                  <div>
                    <p>Total Expense</p>

                    <h2>{formatMoney(dashboard.total_expense)}</h2>
                  </div>
                </div>

                {/* BALANCE */}

                <div className="summary-card balance-card">
                  <div className="card-icon">₹</div>

                  <div>
                    <p>Current Balance</p>

                    <h2>{formatMoney(dashboard.balance)}</h2>
                  </div>
                </div>
              </section>

              {/* =====================================================
                  DASHBOARD ANALYTICS
              ===================================================== */}

              <div className="dashboard-analytics">
                {/* CHART */}

                <div className="dashboard-card category-chart-card">
                  <div className="card-heading">
                    <div>
                      <h3>Expense Breakdown</h3>

                      <p>Where your money is going</p>
                    </div>
                  </div>

                  <div className="chart-safe-area">
                    <ExpenseChart
                      categoryExpenses={dashboard?.category_expenses || []}
                      darkMode={darkMode}
                    />
                  </div>
                </div>

                {/* CATEGORY LIST */}

                <div className="dashboard-card category-list-card">
                  <div className="card-heading">
                    <div>
                      <h3>Category Expenses</h3>

                      <p>Spending by category</p>
                    </div>
                  </div>

                  <div className="category-expense-list">
                    {dashboard?.category_expenses?.length === 0 ? (
                      <div className="empty-state">
                        No expense data available.
                      </div>
                    ) : (
                      dashboard?.category_expenses?.map((item) => (
                        <div
                          className="category-expense-row"
                          key={item.category}
                        >
                          <span>{item.category}</span>

                          <strong>{formatMoney(item.amount)}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* =====================================================
                  CATEGORY-WISE EXPENSES
              ===================================================== */}

              <section className="content-card category-section">
                <div className="section-heading">
                  <div>
                    <h2>Category-wise Expenses</h2>

                    <p>Where your money is going</p>
                  </div>
                </div>

                {dashboard.category_expenses.length === 0 ? (
                  <div className="empty-state">No expense data available.</div>
                ) : (
                  <div className="category-list">
                    {dashboard.category_expenses.map((item) => {
                      const percentage =
                        dashboard.total_expense > 0
                          ? (item.amount / dashboard.total_expense) * 100
                          : 0;

                      return (
                        <div className="category-item" key={item.category}>
                          <div className="category-info">
                            <span className="category-name">
                              {item.category}
                            </span>

                            <span className="category-amount">
                              {formatMoney(item.amount)}
                            </span>
                          </div>

                          <div className="progress-background">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <span className="category-percentage">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* =====================================================
                  RECENT TRANSACTIONS
              ===================================================== */}

              <section className="content-card transactions-section">
                <div className="section-heading">
                  <div>
                    <h2>Recent Transactions</h2>

                    <p>Track your latest financial activity</p>
                  </div>

                  <button
                    className="add-transaction-button"
                    onClick={() => setShowAddTransaction(true)}
                  >
                    + Add Transaction
                  </button>
                </div>

                <div className="transactions-wrapper">
                  <Transactions
                    onLogout={onLogout}
                    onTransactionChanged={() => {
                      window.location.reload();
                    }}
                  />
                </div>
              </section>

              {/* ADD TRANSACTION */}

              {showAddTransaction && (
                <AddTransaction
                  onClose={() => setShowAddTransaction(false)}
                  onLogout={onLogout}
                  onTransactionAdded={() => {
                    window.location.reload();
                  }}
                />
              )}
            </>
          )}

          {/* =====================================================
              TRANSACTIONS PAGE
          ===================================================== */}

          {activePage === "transactions" && (
            <section className="page-section">
              <div className="page-header">
                <div>
                  <h1>Transactions</h1>

                  <p>View and manage all your transactions</p>
                </div>

                <button
                  className="add-transaction-button"
                  onClick={() => setShowAddTransaction(true)}
                >
                  + Add Transaction
                </button>
              </div>

              <div className="content-card transactions-wrapper">
                <Transactions
                  onLogout={onLogout}
                  onTransactionChanged={() => {
                    window.location.reload();
                  }}
                />
              </div>

              {showAddTransaction && (
                <AddTransaction
                  onClose={() => setShowAddTransaction(false)}
                  onLogout={onLogout}
                  onTransactionAdded={() => {
                    window.location.reload();
                  }}
                />
              )}
            </section>
          )}

          {/* =====================================================
              ANALYTICS PAGE
          ===================================================== */}

          {activePage === "analytics" && (
            <section className="page-section">
              <div className="page-header">
                <div>
                  <h1>Analytics</h1>

                  <p>Understand your spending habits</p>
                </div>
              </div>

              {/* ANALYTICS SUMMARY */}

              <section className="summary-grid">
                <div className="summary-card income-card">
                  <div className="card-icon">↗</div>

                  <div>
                    <p>Total Income</p>

                    <h2>{formatMoney(dashboard.total_income)}</h2>
                  </div>
                </div>

                <div className="summary-card expense-card">
                  <div className="card-icon">↘</div>

                  <div>
                    <p>Total Expense</p>

                    <h2>{formatMoney(dashboard.total_expense)}</h2>
                  </div>
                </div>

                <div className="summary-card balance-card">
                  <div className="card-icon">₹</div>

                  <div>
                    <p>Current Balance</p>

                    <h2>{formatMoney(dashboard.balance)}</h2>
                  </div>
                </div>
              </section>

              {/* EXPENSE OVERVIEW */}

              <div className="analytics-graph-card">
                <div className="card-heading">
                  <div>
                    <h3>Expense Overview</h3>

                    <p>Compare your spending across categories</p>
                  </div>
                </div>

                <div className="expense-bar-chart">
                  {dashboard.category_expenses.length === 0 ? (
                    <div className="empty-state">
                      No expense data available.
                    </div>
                  ) : (
                    dashboard.category_expenses.map((item) => {
                      const percentage =
                        dashboard.total_expense > 0
                          ? (item.amount / dashboard.total_expense) * 100
                          : 0;

                      return (
                        <div className="expense-bar-item" key={item.category}>
                          <div className="expense-bar-label">
                            <span>{item.category}</span>

                            <strong>{formatMoney(item.amount)}</strong>
                          </div>

                          <div className="expense-bar-background">
                            <div
                              className="expense-bar-fill"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <span className="expense-bar-percentage">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ANALYTICS GRID */}

              <div className="analytics-grid">
                {/* PIE CHART */}

                <div className="dashboard-card analytics-chart-card">
                  <div className="card-heading">
                    <div>
                      <h3>Expense Breakdown</h3>

                      <p>Distribution of your expenses</p>
                    </div>
                  </div>

                  <div className="chart-safe-area analytics-chart-area">
                    <ExpenseChart
                      categoryExpenses={dashboard?.category_expenses || []}
                      darkMode={darkMode}
                    />
                  </div>
                </div>

                {/* CATEGORY DETAILS */}

                <div className="dashboard-card">
                  <div className="card-heading">
                    <div>
                      <h3>Spending by Category</h3>

                      <p>Detailed expense distribution</p>
                    </div>
                  </div>

                  <div className="analytics-category-list">
                    {dashboard.category_expenses.length === 0 ? (
                      <div className="empty-state">
                        No expense data available.
                      </div>
                    ) : (
                      dashboard.category_expenses.map((item) => {
                        const percentage =
                          dashboard.total_expense > 0
                            ? (item.amount / dashboard.total_expense) * 100
                            : 0;

                        return (
                          <div
                            className="analytics-category"
                            key={item.category}
                          >
                            <div className="analytics-category-top">
                              <span>{item.category}</span>

                              <strong>{formatMoney(item.amount)}</strong>
                            </div>

                            <div className="progress-background">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>

                            <span className="category-percentage">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* =====================================================
              PROFILE PAGE
          ===================================================== */}

          {activePage === "profile" && (
            <section className="page-section">
              <Profile />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
