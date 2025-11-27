import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VoterHome from "./pages/VoterHome";
import ContestantHome from "./pages/ContestantHome";
import AdminHome from "./pages/AdminHome";
import AdminPage from "./pages/AdminPage";
import VoterProfile from "./pages/VoterProfile";
import ContestantProfile from "./pages/ContestantProfile";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { signin } from "./api/app"; // import the signin you created

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login signin={signin} />} />
        <Route path="/voter" element={<VoterHome />} />
        <Route path="/contestant" element={<ContestantHome />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/adminpage" element={<AdminPage />} />
        <Route path="/voter/profile" element={<VoterProfile />} />
        <Route path="/contestant/profile" element={<ContestantProfile />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </>
  );
}

export default App;
