import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import API from "../api/api"; // your axios wrapper
import { useNavigate } from "react-router-dom";

function ResetPasswordPage() {
     const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // read ?email=... from link

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await API.post("/auth/reset-password", { email, password }); 
     setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage("Failed: " + (err.response?.data || err.message));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Reset Password</h2>
      <p>Reset password for: <strong>{email}</strong></p>

      <form onSubmit={handleReset}>
        <div>
          <label>New Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetPasswordPage;
