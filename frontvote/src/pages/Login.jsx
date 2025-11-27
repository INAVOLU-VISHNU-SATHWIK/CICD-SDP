import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; 

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Hardcoded admin check
      if (form.email === "sathwikinavolu@gmail.com" && form.password === "sathwik") {
        navigate("/adminpage");
        return;
      }

      // Normal login for other users
      const response = await fetch("http://localhost:2005/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const user = await response.json();
      localStorage.setItem("user", JSON.stringify(user));
      // Role-based navigation
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "CONTESTANT") {
        navigate("/contestant", { state: { userId: user.userId } });
      } else if (user.role === "VOTER") {
        navigate("/voter", { state: { userId: user.userId } });
      } else {
        alert("Unknown role!");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div>
      {/* Animated background circles */}
      <div className="background-circles">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Form container */}
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p style={{ marginTop: "15px" }}>
          New user? <Link to="/signup">Signup</Link>
        </p>
        <p style={{ marginTop: "10px" }}>
  <a
    href="#"
    onClick={async (e) => {
      e.preventDefault();
      if (!form.email) {
        alert("Please enter your email first!");
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:2005/api/auth/forgot-password?email=${form.email}`,
          { method: "POST" }
        );
        if (res.ok) {
          alert("Password reset link sent to your email!");
        } else {
          const msg = await res.text();
          alert("Error: " + msg);
        }
      } catch (err) {
        alert("Something went wrong: " + err.message);
      }
    }}
  >
    Forgot Password?
  </a>
</p>

      </div>
    </div>
  );
}

export default Login;
