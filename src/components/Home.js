import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MailComposer from "./MailComposer";
import MailList from "./MailList";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("compose");


  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-2xl mb-4">Welcome, {user.email}</h1>
        <button
          onClick={() => setActiveTab("compose")}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded mb-2"
        >
          Compose Mail
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded"
        >
          Sent 
        </button>
      </div>
      <div className="w-3/4 bg-white p-4 overflow-auto">
        {activeTab === "compose" && <MailComposer />}
        {activeTab === "sent" && <MailList />}
      </div>
    </div>
  );
};

export default Home;
