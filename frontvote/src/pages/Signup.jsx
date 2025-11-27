import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; 

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    address: "",
    aadharNumber: "",
    mobileNumber: "",
    role: "VOTER",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:2005/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      alert("Signup successful!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <div>
      {/* Animated background circles */}
      

      {/* Form container */}
      <div className="form-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} maxLength={30} required />
          <input name="email" placeholder="Email" onChange={handleChange} maxLength={30} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} maxLength={12} required />
          <input name="dob" placeholder="Date of Birth (YYYY-MM-DD)" onChange={handleChange} maxLength={10} required />
          <input name="address" placeholder="Address" onChange={handleChange} maxLength={50} required />
          <input name="aadharNumber" placeholder="Aadhar Number" onChange={handleChange} minLength={12} maxLength={12} required />
          <input name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} minLength={10} maxLength={10} required />

          <div style={{ margin: "10px 0" }}>
            <label style={{ marginRight: "15px" }}>
              <input
                type="radio"
                name="role"
                value="VOTER"
                checked={form.role === "VOTER"}
                onChange={handleChange}
              /> Voter
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="CONTESTANT"
                checked={form.role === "CONTESTANT"}
                onChange={handleChange}
              /> Contestant
            </label>
          </div>

          <button type="submit">Signup</button>
        </form>

        <p style={{ marginTop: "15px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
