import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import Vote4ULogo from "../Vote4U logo.jpg"; // Your logo

function Home() {
  const user = JSON.parse(localStorage.getItem("user")); // check login
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // remove all user data
    navigate("/"); // redirect to home
  };

  return (
    <div className="home-container">
      {/* Top header */}
      <header className="top-bar">
        <div className="logo-section">
          <img src={Vote4ULogo} alt="Vote4U Logo" className="logo" />
          <span className="logo-text">Vote4U</span>
        </div>
        <div className="user-section">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button className="auth-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <div>
              <Link to="/signup" className="auth-btn">Signup</Link>
              <Link to="/login" className="auth-btn">Login</Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero section */}
      <section className="hero-section">
        <h1>Empower Your Voice. Shape Your Nation.</h1>
        <p>
          Vote4U makes voting easy, informative, and engaging. Know your
          candidates, check your voter registration, and participate in
          democracy confidently.
        </p>
        {!user && (
          <Link to="/signup">
            <button className="cta-btn">Get Started</button>
          </Link>
        )}
      </section>

      {/* About voting section */}
      <section className="about-voting">
        <h2>Why Voting Matters</h2>
        <p>
          Voting is your fundamental right and your power to influence policies
          and leadership. Each vote counts in shaping the future of your
          community, state, and nation.
        </p>
      </section>

      {/* Key info cards */}
      <section className="info-cards">
        <div className="card">
          <h3>Universal Adult Suffrage</h3>
          <p>
            Since 1950, India allows every adult citizen to vote, ensuring
            equality and democracy for all.
          </p>
        </div>
        <div className="card">
          <h3>Make Your Voice Heard</h3>
          <p>
            Voting is the most direct way to influence government decisions and
            hold leaders accountable.
          </p>
        </div>
        <div className="card">
          <h3>Electronic Voting</h3>
          <p>
            EVMs and modern technology make voting efficient, secure, and
            transparent across the nation.
          </p>
        </div>
        <div className="card">
          <h3>Vote4U Support</h3>
          <p>
            We provide information about elections, candidates, polling
            stations, and voter registration status.
          </p>
        </div>
      </section>

      {/* How Vote4U helps */}
      <section className="vote4u-section">
        <h2>How Vote4U Helps</h2>
        <p>
          Vote4U empowers every citizen by consolidating all election-related
          info in one place. From checking your voter ID to understanding
          candidates’ policies, we make it easy to participate in democracy
          responsibly.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          For any queries, contact:{" "}
          <a href="mailto:sathwikinavolu@gmail.com">sathwikinavolu@gmail.com</a>
        </p>
        <p>Copyright © 2025 | Vote4U | All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default Home;
