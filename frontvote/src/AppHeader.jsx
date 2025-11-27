import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AppHeader.css";

function AppHeader() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // go back to home page
    window.location.reload(); // optional, to reset app state
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Vote4U</h1>
      </div>

      <div className="header-right">
        {!user ? (
          <>
            <Link to="/signup" className="header-btn">Signup</Link>
            <Link to="/login" className="header-btn">Login</Link>
          </>
        ) : (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>
            <button className="header-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default AppHeader;
