import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

function ContestantProfile() {
  const [contestant, setContestant] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    fetchContestantDetails(user.userId);
  }, [navigate]);

  const fetchContestantDetails = async (userId) => {
    try {
      const res = await API.get(`/users/${userId}`); // ✅ backend should provide user details
      setContestant(res.data);
    } catch (err) {
      console.error("Error fetching contestant details:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!contestant) return <p>No contestant data available.</p>;

  return (
    <div className="contestant-profile">
      <h2>Contestant Profile</h2>
      <p><strong>Name:</strong> {contestant.name}</p>
      <p><strong>Email:</strong> {contestant.email}</p>
      <p><strong>Mobile:</strong>{contestant.mobileNumber}</p>
      <p><strong>Aadhaar:</strong> {contestant.aadharNumber}</p>
      <p><strong>Role:</strong> {contestant.role}</p>

      {/* Later you can also show elections they registered for */}
      
      <button onClick={() => navigate("/contestant/")} className="back-btn">
        Back to Elections
      </button>
    </div>
  );
}

export default ContestantProfile;
