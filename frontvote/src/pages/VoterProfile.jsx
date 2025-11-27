import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

function VoterProfile() {
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    fetchVoterDetails(user.userId);
  }, [navigate]);

  const fetchVoterDetails = async (userId) => {
    try {
      const res = await API.get(`/users/${userId}`); // ✅ backend should provide user details
      setVoter(res.data);
    } catch (err) {
      console.error("Error fetching voter details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!voter) return <p>No voter data available.</p>;

  return (
    <div className="voter-profile">
      <h2>Voter Profile</h2>
      <p><strong>Name:</strong> {voter.name}</p>
      <p><strong>Email:</strong> {voter.email}</p>
      <p><strong>Mobile:</strong>{voter.mobileNumber}</p>
      <p><strong>Aadhaar:</strong> {voter.aadharNumber}</p>
      <p><strong>Role:</strong> {voter.role}</p>

      {/* Elections they voted in */}

      <button onClick={() => navigate("/voter/")} className="back-btn">
        Back to Elections
      </button>
    </div>
  );
}

export default VoterProfile;
