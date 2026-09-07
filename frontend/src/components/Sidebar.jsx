
import "./Sidebar.css";
import expenseLogo from "../assets/expense-logo.png";
import dashboardIcon from "../assets/dashboard.png";
import transactionsIcon from "../assets/transactions.png";
import analyticsIcon from "../assets/analytics.png";
import profileIcon from "../assets/profile.png";
import logoutIcon from "../assets/logout.png";

import { NavLink } from "react-router-dom";

function Sidebar({ onLogout, isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Overlay */}

      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={
          isOpen
            ? "sidebar sidebar-open"
            : "sidebar"
        }
      >
        {/* Logo */}

        <div className="sidebar-logo">
          <div className="expense-logo-glow">
            <img
              src={expenseLogo}
              alt="Expense Tracker"
              className="expense-logo"
            />
          </div>

          <div className="sidebar-brand-text">
            <h2>Expense Tracker</h2>

            <span>Finance Manager</span>
          </div>
        </div>

        {/* Navigation */}

        <nav className="sidebar-navigation">

          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setIsOpen(false)}
          >
            <img
              src={dashboardIcon}
              alt="Dashboard"
              className="sidebar-icon"
            />

            Dashboard
          </NavLink>


          <NavLink
            to="/dashboard/transactions"
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setIsOpen(false)}
          >
            <img
              src={transactionsIcon}
              alt="Transactions"
              className="sidebar-icon"
            />

            Transactions
          </NavLink>


          <NavLink
            to="/dashboard/analytics"
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setIsOpen(false)}
          >
            <img
              src={analyticsIcon}
              alt="Analytics"
              className="sidebar-icon"
            />

            Analytics
          </NavLink>


          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() => setIsOpen(false)}
          >
            <img
              src={profileIcon}
              alt="Profile"
              className="sidebar-icon"
            />

            Profile
          </NavLink>

        </nav>

        {/* Logout */}

        <div className="sidebar-bottom">
          <button
            className="logout-button"
            onClick={onLogout}
          >
            <img
              src={logoutIcon}
              alt="Logout"
              className="logout-icon"
            />

            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;