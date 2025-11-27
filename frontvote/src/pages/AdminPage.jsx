import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

function AdminPage() {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [voters, setVoters] = useState([]);
  const [contestants, setContestants] = useState([]);
  const [newElection, setNewElection] = useState({
    name: "",
    state: "",
    region: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [activeTab, setActiveTab] = useState("elections");
  const [editingId, setEditingId] = useState(null);

  const [completedElections, setCompletedElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [selectedContestants, setSelectedContestants] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [winnerDetails, setWinnerDetails] = useState("");

  useEffect(() => {
    fetchElections();
    fetchVoters();
    fetchContestants();
  }, []);

  const fetchElections = async () => {
    const res = await API.get("/admin/elections");
    setElections(res.data);
    const closedElections = res.data.filter((e) => e.status === "CLOSED");
    setCompletedElections(closedElections);
  };

  const fetchVoters = async () => {
    const res = await API.get("/admin/voters");
    setVoters(res.data);
  };

  const fetchContestants = async () => {
    const res = await API.get("/admin/contestants");
    setContestants(res.data);
  };

  const handleInputChange = (e) => {
    setNewElection({ ...newElection, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateElection = async () => {
    if (editingId) {
      await API.put(`/admin/elections/${editingId}`, newElection);
      setEditingId(null);
    } else {
      await API.post("/admin/elections", newElection);
    }

    setNewElection({
      name: "",
      state: "",
      region: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      description: "",
    });
    fetchElections();
  };

  const handleEditElection = (election) => {
    setEditingId(election.electionId);
    setNewElection({
      name: election.name,
      state: election.state,
      region: election.region,
      startDate: election.startDate,
      endDate: election.endDate,
      startTime: election.startTime,
      endTime: election.endTime,
      description: election.description,
    });
  };

  const handleDeleteElection = async (id) => {
    await API.delete(`/admin/elections/${id}`);
    fetchElections();
  };

  const handleDeleteUser = async (id) => {
    await API.delete(`/admin/users/${id}`);
    fetchVoters();
    fetchContestants();
  };

  const handleSelectElection = (e) => {
    const electionId = e.target.value;
    setSelectedElectionId(electionId);
    const election = completedElections.find((el) => el.electionId === parseInt(electionId));

    if (election) {
      const sortedContestants = [...election.contestants].sort(
        (a, b) => (election.votes?.[b.userId] || 0) - (election.votes?.[a.userId] || 0)
      );
      setSelectedContestants(sortedContestants);
    } else {
      setSelectedContestants([]);
    }
  };

  const handleDeclareWinner = async () => {
    if (!winnerName) {
      alert("Please enter the winner's name.");
      return;
    }

    try {
      await API.post(`/admin/elections/${selectedElectionId}/declareWinner`, {
        winnerName,
        winnerDetails,
      });
      alert("Winner declared successfully!");
      setWinnerName("");
      setWinnerDetails("");
      setSelectedElectionId(null);
      setSelectedContestants([]);
      fetchElections();
    } catch (err) {
      console.error("Error declaring winner", err);
      alert("Failed to declare winner.");
    }
  };

  const handleLogout = async () => {
    // You can add your actual logout logic here, like clearing a user token
    try {
      // Example: await API.post("/logout");
      localStorage.removeItem("userToken");
      console.log("User logged out!");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          background: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Log Out
      </button>

      {/* Navigation */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("elections")}>Elections</button>
        <button onClick={() => setActiveTab("voters")}>Voters</button>
        <button onClick={() => setActiveTab("contestants")}>Contestants</button>
        <button onClick={() => setActiveTab("results")}>Results Declaration</button>
      </div>

      {/* Elections */}
      {activeTab === "elections" && (
        <section>
          <h2>{editingId ? "Edit Election" : "Create Election"}</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              maxWidth: "700px",
              background: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px",
            }}
          >
            <label>
              Election Name:
              <input
                name="name"
                value={newElection.name}
                onChange={handleInputChange}
                placeholder="Election Name"
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              State:
              <input
                name="state"
                value={newElection.state}
                onChange={handleInputChange}
                placeholder="State"
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              Region:
              <input
                name="region"
                value={newElection.region}
                onChange={handleInputChange}
                placeholder="Region"
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={newElection.startDate}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={newElection.endDate}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              Start Time:
              <input
                type="time"
                name="startTime"
                value={newElection.startTime}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label>
              End Time:
              <input
                type="time"
                name="endTime"
                value={newElection.endTime}
                onChange={handleInputChange}
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </label>

            <label style={{ gridColumn: "1 / span 2" }}>
              Description:
              <textarea
                name="description"
                value={newElection.description}
                onChange={handleInputChange}
                placeholder="Description"
                style={{ width: "100%", padding: "8px", marginTop: "5px", minHeight: "80px" }}
              />
            </label>

            <div style={{ gridColumn: "1 / span 2", textAlign: "right" }}>
              <button
                onClick={handleCreateOrUpdateElection}
                style={{
                  padding: "10px 20px",
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {editingId ? "Update Election" : "Create Election"}
              </button>
            </div>
          </div>

          <h2>All Elections</h2>
          <ul>
            {elections.map((e) => (
              <li key={e.electionId}>
                <strong>{e.name}</strong> ({e.state} - {e.region}) <br />
                {e.startDate} {e.startTime} → {e.endDate} {e.endTime} <br />
                Status: {e.status} <br />
                {e.description} <br />
                <button onClick={() => handleEditElection(e)}>Edit</button>
                <button onClick={() => handleDeleteElection(e.electionId)}>Delete</button>
                {e.contestants.length > 0 && (
                  <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                    <h4>Contestants & Votes:</h4>
                    <ul>
                      {e.contestants.map((c) => {
                        const votes = e.votes?.[c.userId] || 0;
                        return (
                          <li key={c.userId}>
                            {c.name} ({c.email}) - Votes: {votes}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <hr />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Voters */}
      {activeTab === "voters" && (
        <section>
          <h2>Voters</h2>
          <ul>
            {voters.map((v) => (
              <li key={v.userId}>
                <strong>{v.name}</strong> ({v.email}) <br />
                ID: {v.aadharNumber}, Mobile: {v.mobileNumber}
                <button onClick={() => handleDeleteUser(v.userId)}>Delete</button>
                <hr />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Contestants */}
      {activeTab === "contestants" && (
        <section>
          <h2>Contestants</h2>
          <ul>
            {contestants.map((c) => (
              <li key={c.userId}>
                <strong>{c.name}</strong> ({c.email}) <br />
                ID: {c.aadharNumber}, Mobile: {c.mobileNumber}
                <button onClick={() => handleDeleteUser(c.userId)}>Delete</button>
                <hr />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Results Declaration */}
      {activeTab === "results" && (
        <section>
          <h2>Results Declaration</h2>
          <label>
            Select Completed Election:{" "}
            <select value={selectedElectionId || ""} onChange={handleSelectElection}>
              <option value="">--Select--</option>
              {completedElections.map((e) => (
                <option key={e.electionId} value={e.electionId}>
                  {e.name} ({e.state} - {e.region})
                </option>
              ))}
            </select>
          </label>

          {selectedContestants.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h4>Contestants (Votes Descending):</h4>
              <ul>
                {selectedContestants.map((c) => (
                  <li key={c.userId}>
                    {c.name} ({c.email}) - Votes:{" "}
                    {
                      completedElections.find(
                        (e) => e.electionId === parseInt(selectedElectionId)
                      ).votes[c.userId]
                    }
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "10px" }}>
                <input
                  placeholder="Winner Name"
                  value={winnerName}
                  onChange={(e) => setWinnerName(e.target.value)}
                />
                <input
                  placeholder="Winner Details"
                  value={winnerDetails}
                  onChange={(e) => setWinnerDetails(e.target.value)}
                  style={{ marginLeft: "10px" }}
                />
                <button onClick={handleDeclareWinner} style={{ marginLeft: "10px" }}>
                  Submit Winner
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default AdminPage;