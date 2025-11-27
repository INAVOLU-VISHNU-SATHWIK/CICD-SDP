import React, { useEffect, useState } from "react";
import API from "../api/api.js";
import { useNavigate } from "react-router-dom";
import "./ContestantHome.css"; // CSS for styling
import { FaUserCircle } from "react-icons/fa";

function ContestantHome() {
  const [elections, setElections] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser) {
      alert("Please login first!");
      navigate("/login");
      return;
    }
    setUser(loggedUser);
    fetchElections(loggedUser);
  }, [navigate]);

  const fetchElections = async (currentUser) => {
    try {
      const res = await API.get("/admin/elections");
      let electionsData = res.data;

      electionsData = electionsData.map((e) => ({
        ...e,
        isRegistered: currentUser
          ? e.contestants.some((c) => c.userId === currentUser.userId)
          : false,
      }));

      setElections(electionsData);
    } catch (err) {
      console.error("Error fetching elections", err);
    }
  };

  const handleRegister = async (electionId) => {
    if (!user) return;
    try { 1
      await API.post(`/admin/elections/${electionId}/register/${user.userId}`);
      alert("Successfully registered!");
      fetchElections(user);
    } catch (err) {
      console.error("Error registering", err);
      alert("Failed to register: " + (err.response?.data || err.message));
    }
  };

  const handleUnregister = async (electionId) => {
    if (!user) return;
    try {
      await API.delete(`/admin/elections/${electionId}/unregister/${user.userId}`);
      alert("Registration undone!");
      fetchElections(user);
    } catch (err) {
      console.error("Error unregistering", err);
      alert("Failed to unregister: " + (err.response?.data || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // back to Home page
  };

  if (!user) return null;

  return (
    
    <div className="contestant-container">
              <div className="profile-icon" onClick={() => navigate("/contestant/profile")}>
          <FaUserCircle size={30} style={{ cursor: "pointer" }} />
        </div>
      {/* Top bar with Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* 3 columns */}
      <div className="columns">
        {/* UPCOMING */}
        <div className="column">
          <h2>Upcoming Elections</h2>
          {elections.filter((e) => e.status === "UPCOMING").map((e) => (
            <div className="election-card" key={e.electionId}>
              <strong>{e.name}</strong> ({e.state} - {e.region}) <br />
              {e.startDate} {e.startTime} → {e.endDate} {e.endTime} <br />

              {!e.isRegistered ? (
                <button onClick={() => handleRegister(e.electionId)}>Register</button>
              ) : (
                <>
                  <span style={{ color: "green", marginRight: "10px" }}>Registered</span>
                  <button onClick={() => handleUnregister(e.electionId)}>Undo</button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* ONGOING */}
        <div className="column">
          <h2>Ongoing Elections</h2>
          {elections.filter((e) => e.status === "ONGOING").map((e) => (
            <div className="election-card" key={e.electionId}>
              <strong>{e.name}</strong> ({e.state} - {e.region}) <br />
              {e.startDate} {e.startTime} → {e.endDate} {e.endTime} <br />
              <span className="status ongoing">Ongoing</span>
            </div>
          ))}
        </div>

        {/* COMPLETED */}
        <div className="column">
          <h2>Completed Elections</h2>
          {elections.filter((e) => e.status === "CLOSED").map((e) => (
            <div className="election-card" key={e.electionId}>
              <strong>{e.name}</strong> ({e.state} - {e.region}) <br />
              {e.winnerName ? (
                <p>
                  Winner: <strong>{e.winnerName}</strong> <br />
                  Details: {e.winnerDetails}
                </p>
              ) : (
                <p>Winner not declared yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContestantHome;
