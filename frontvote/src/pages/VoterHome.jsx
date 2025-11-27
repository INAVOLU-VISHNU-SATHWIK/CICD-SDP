import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";
import "./VoterHome.css";
import { FaUserCircle } from "react-icons/fa";

function VoterHome() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const res = await API.get("/admin/elections");
      setElections(res.data || []);
    } catch (err) {
      console.error("Error fetching elections:", err);
      setElections([]);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/"); // go to Home
  };

  // ✅ Cast Vote
  // ✅ Cast Vote
const handleVote = async (electionId, contestantId) => {
  try {
    setVoting(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please log in to vote.");
      return;
    }

    await API.post(
      `/admin/elections/${electionId}/vote/${contestantId}/${user.userId}`
    );

    alert("Vote submitted successfully!");

    // ✅ Mark locally that this user has voted in this election
    setElections((prev) =>
      prev.map((e) =>
        e.electionId === electionId
          ? { ...e, votedVoters: [...(e.votedVoters || []), user.userId] }
          : e
      )
    );

    fetchElections(); // refresh elections after voting
  } catch (err) {
    console.error("Error voting:", err);
    alert("Failed to submit vote: " + (err.response?.data || err.message));
  } finally {
    setVoting(false);
  }
};

const renderElection = (election) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const alreadyVoted =
    election.votedVoters && user && election.votedVoters.includes(user.userId);

  return (
    <div key={election.electionId} className="election-card">
      <h3>{election.name}</h3>
      <p>{election.description}</p>
      <p>
        {election.state}, {election.region}
      </p>
      <p>
        {election.startDate} {election.startTime} - {election.endDate}{" "}
        {election.endTime}
      </p>

      {/* Ongoing & Upcoming Elections - Show Contestants */}
      {(election.status === "ONGOING" || election.status === "UPCOMING") &&
        election.contestants &&
        election.contestants.length > 0 && (
          <div className="contestants-list">
            <h4>Contestants</h4>
            <ul>
              {election.contestants.map((c) => (
                <li key={c.userId}>
                  {c.name} ({c.aadharNumber})
                  {election.status === "ONGOING" && (
                    <button
                      disabled={voting || alreadyVoted}
                      onClick={() =>
                        handleVote(election.electionId, c.userId)
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      {alreadyVoted ? "Voted" : "Vote"}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Completed Elections - Show Winner */}
      {(election.status === "CLOSED" || election.status === "COMPLETED") && (
        <div className="winner-info">
          {election.winnerName ? (
            <>
              <p>
                Winner: <strong>{election.winnerName}</strong>
              </p>
              <p>Details: {election.winnerDetails}</p>
            </>
          ) : (
            <p>Winner not declared yet.</p>
          )}
        </div>
      )}
    </div>
  );
};
  if (loading) return <p>Loading elections...</p>;
  if (!elections.length) return <p>No elections available.</p>;

  // Group by status
  const ongoing = elections.filter((e) => e.status === "ONGOING");
  const upcoming = elections.filter((e) => e.status === "UPCOMING");
  const closed = elections.filter(
    (e) => e.status === "CLOSED" || e.status === "COMPLETED"
  );

  return (
    <div className="voter-home">
      <div className="header">
        <div className="profile-icon" onClick={() => navigate("/voter/profile")}>
    <FaUserCircle size={30} style={{ cursor: "pointer" }} />
  </div>
        <h2>Available Elections</h2>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="elections-grid">
        <div className="election-column">
          <h3>Ongoing</h3>
          {ongoing.length ? ongoing.map(renderElection) : <p>No ongoing elections</p>}
        </div>

        <div className="election-column">
          <h3>Upcoming</h3>
          {upcoming.length ? upcoming.map(renderElection) : <p>No upcoming elections</p>}
        </div>

        <div className="election-column">
          <h3>Completed</h3>
          {closed.length ? closed.map(renderElection) : <p>No completed elections</p>}
        </div>
      </div>
      <div className="header">
</div>

    </div>
  );
}

export default VoterHome;
