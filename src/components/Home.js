import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MailComposer from "./MailComposer";
import SentList from "./SentList";
import InboxList from "./InboxList";
import Logout from "./Logout";


const Home = () => {
  const user = useSelector((state) => state.auth.user);
   const unreadCount = useSelector((state) => state.mail.unreadCount);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("compose");

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h1 className="text-2xl mb-4">Welcome, {user.email}</h1>
        <button
          onClick={() => setActiveTab("compose")}
          className={`w-full py-2 px-4 rounded mb-2 ${
            activeTab === "compose" ? "bg-blue-500" : "bg-gray-500"
          } text-white`}
        >
          Compose Mail
        </button>
        <button
          onClick={() => setActiveTab("inbox")}
          className={`w-full py-2 px-4 rounded mb-2 ${
            activeTab === "inbox" ? "bg-blue-500" : "bg-gray-500"
          } text-white`}
        >
          Inbox {unreadCount > 0 && <span>({unreadCount})</span>}
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={`w-full py-2 px-4 rounded mb-2 ${
            activeTab === "sent" ? "bg-blue-500" : "bg-gray-500"
          } text-white`}
        >
          Sent
        </button>
        <button
          onClick={() => setActiveTab("logout")}
          className={`w-full py-2 px-4 rounded ${
            activeTab === "logout" ? "bg-blue-500" : "bg-gray-500"
          } text-white`}
        >
          Logout
        </button>
      </div>
      <div className="w-3/4 bg-white p-4 overflow-auto">
        {activeTab === "compose" && <MailComposer />}
        {activeTab === "inbox" && <InboxList />}
        {activeTab === "sent" && <SentList />}
        {activeTab === "logout" && <Logout setActiveTab={setActiveTab} />}
      </div>
    </div>
  );
};

export default Home;
