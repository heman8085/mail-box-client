import React from "react";
import "./App.css";
import "./index.css";
import Signup from "./components/auth/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Home from "./components/Home";
// import Logout from "./components/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
