import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { logout } from "./store/authSlice";

const Logout = ({setActiveTab}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(true);

   const handleLogout = () => {
     dispatch(logout());
     navigate("/");
   };

  const closeModal = () => {
      setModalIsOpen(false);
      setActiveTab("compose");
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Logout Confirmation"
        className="modal"
        overlayClassName="overlay"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded mr-2"
          >
            Yes, Logout
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Logout;
