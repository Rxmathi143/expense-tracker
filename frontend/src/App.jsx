import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import ETLanding from "./components/ETLanding";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function AppRoutes({ darkMode, handleToggleTheme }) {
  const navigate = useNavigate();

  // =====================================
  // LOGIN
  // =====================================

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    navigate("/dashboard", { replace: true });
  };

  // =====================================
  // REGISTER
  // =====================================

  const handleRegister = (token) => {
    localStorage.setItem("token", token);
    navigate("/dashboard", { replace: true });
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/", { replace: true });
  };

  return (
    <Routes>
      {/* =====================================
          LANDING PAGE
      ====================================== */}

      <Route
        path="/"
        element={
          <div className={darkMode ? "app dark-mode" : "app"}>
            <ETLanding
              onStartTracking={() => navigate("/login")}
              darkMode={darkMode}
              onToggleTheme={handleToggleTheme}
            />
          </div>
        }
      />

      {/* =====================================
          LOGIN
      ====================================== */}

      <Route
        path="/login"
        element={
          <div className={darkMode ? "app dark-mode" : "app"}>
            <Login
              onLogin={handleLogin}
              onRegister={() => navigate("/register")}
              onBackToLanding={() => navigate("/")}
              darkMode={darkMode}
              onToggleTheme={handleToggleTheme}
            />
          </div>
        }
      />

      {/* =====================================
          REGISTER
      ====================================== */}

      <Route
        path="/register"
        element={
          <div className={darkMode ? "app dark-mode" : "app"}>
            <Register
              onRegister={handleRegister}
              onBackToLogin={() => navigate("/login")}
              darkMode={darkMode}
              onToggleTheme={handleToggleTheme}
            />
          </div>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <div className={darkMode ? "app dark-mode" : "app"}>
            <ForgotPassword
              darkMode={darkMode}
              onToggleTheme={handleToggleTheme}
            />
          </div>
        }
      />

      {/* =====================================
          PASSWORD RESET
      ====================================== */}

      <Route
        path="/reset-password/:uid/:token"
        element={
          <div className={darkMode ? "app dark-mode" : "app"}>
            <ResetPassword
              darkMode={darkMode}
              onToggleTheme={handleToggleTheme}
            />
          </div>
        }
      />

      {/* =====================================
          PROTECTED DASHBOARD ROUTES
      ====================================== */}

      <Route element={<ProtectedRoute />}>
        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={
            <div className={darkMode ? "app dark-mode" : "app"}>
              <Dashboard
                onLogout={handleLogout}
                darkMode={darkMode}
                onToggleTheme={handleToggleTheme}
              />
            </div>
          }
        />

        {/* Transactions */}

        <Route
          path="/dashboard/transactions"
          element={
            <div className={darkMode ? "app dark-mode" : "app"}>
              <Dashboard
                onLogout={handleLogout}
                darkMode={darkMode}
                onToggleTheme={handleToggleTheme}
              />
            </div>
          }
        />

        {/* Analytics */}

        <Route
          path="/dashboard/analytics"
          element={
            <div className={darkMode ? "app dark-mode" : "app"}>
              <Dashboard
                onLogout={handleLogout}
                darkMode={darkMode}
                onToggleTheme={handleToggleTheme}
              />
            </div>
          }
        />

        {/* Profile */}

        <Route
          path="/dashboard/profile"
          element={
            <div className={darkMode ? "app dark-mode" : "app"}>
              <Dashboard
                onLogout={handleLogout}
                darkMode={darkMode}
                onToggleTheme={handleToggleTheme}
              />
            </div>
          }
        />
      </Route>

      {/* =====================================
          UNKNOWN URL
      ====================================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  // =====================================
  // THEME
  // =====================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // =====================================
  // THEME TOGGLE
  // =====================================

  const handleToggleTheme = () => {
    setDarkMode((previous) => {
      const newMode = !previous;

      localStorage.setItem("darkMode", newMode);

      return newMode;
    });
  };

  return (
    <BrowserRouter>
      <AppRoutes darkMode={darkMode} handleToggleTheme={handleToggleTheme} />
    </BrowserRouter>
  );
}

export default App;
