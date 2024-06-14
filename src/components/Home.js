import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MailComposer from "./MailComposer";
import MailList from "./MailList";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="home">
      <h1>Welcome, {user.email}</h1>
      <MailComposer />
      <MailList />
    </div>
  );
};

export default Home;
