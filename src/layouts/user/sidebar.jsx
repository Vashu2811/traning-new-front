/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "styles/Consultant.css";
import logo_only from "../../data/logo-ico.svg";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import {
  AutoStories,
  ContactSupport,
  Logout,
  Person3,
} from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import { Tooltip } from "@mui/material";
import { useLogoutFunction } from "@propelauth/react";
import PollinatorLogo from "../../data/pollinator-logo.png";
import { FaExclamationCircle, FaArrowRight } from "react-icons/fa";

const sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const logout = useLogoutFunction();
  const handleLogout = (event) => {
    event.preventDefault();
    console.log("Logging out...");
    localStorage.removeItem("__PROPEL_AUTH_LOGGED_IN_AT");
    localStorage.removeItem("__PROPEL_AUTH_LOGGED_OUT_AT");
    localStorage.removeItem("auth");
    logout(false);
    navigate("/");
  };

  const handleOpenLogoutModal = () => {
    setOpenLogoutModal(true);
  };
  const handleCloseLogoutModal = () => setOpenLogoutModal(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className="flex fixed inset-y-0 left-0 w-[4.5rem]   bg-[#1A1C1E] text-white  ">
        <nav className="flex-1 flex flex-col pt-3  border-r border-[#37383A] ">
          <Link
            to="/training"
            className="flex items-center w-full gap-3 text-xl font-extrabold tracking-tight text-white uppercase dark:text-white"
          >
            <span className="w-full p-5 pt-0">
              <img src={logo_only} alt="logo"></img>
            </span>
          </Link>
          <Tooltip title="Training" placement="right">
            <Link
              to="/training"
              className={`nav-link ${isActive("/training") ? "active" : ""}`}
            >
              {<AutoStories />}
            </Link>
          </Tooltip>
          <Tooltip title="Interview Prep" placement="right">
            <Link
              to="/training/interviewprep"
              className={`nav-link ${
                isActive("/training/interviewprep") ? "active" : ""
              }`}
            >
              {<CoPresentIcon />}
            </Link>
          </Tooltip>
          <Tooltip title="Pollinator" placement="right">
            <Link
              to="/training/pollinator"
              className={`nav-link ${
                isActive("/training/pollinator") ? "active" : ""
              }`}
            >
              <img
                src={PollinatorLogo}
                alt="pollinator"
                height={24}
                width={24}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Mentor" placement="right">
            <Link
              to="/training/mentor"
              className={`nav-link ${
                isActive("/training/mentor") ? "active" : ""
              }`}
            >
              <Person3 />
            </Link>
          </Tooltip>
         
          <div className="flex-grow flex flex-col-reverse z-50 mb-16">
            <Tooltip title="Logout" placement="right">
              <Link onClick={handleOpenLogoutModal} className="nav-link">
                {<Logout />}
              </Link>
            </Tooltip>
            <Tooltip title="Hands on Support" placement="right">
              <Link
                to="https://discord.gg/qstwvtbQEw"
                target="_blank"
                className="nav-link"
              >
                {<ContactSupport />}
              </Link>
            </Tooltip>
          </div>
        </nav>
      </aside>
     <Modal
        open={openLogoutModal}
        onClose={handleCloseLogoutModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div className="bg-[#1f1f1f] p-6 rounded-lg shadow-lg max-w-md w-full mx-4 text-center">
          <FaExclamationCircle size={40} className="text-white mx-auto mb-4" />
          <p className="text-white text-lg font-semibold mb-6">
            Are you sure you want to logout?
          </p>
          <div className="flex justify-between space-x-4">
            <button
              onClick={handleCloseLogoutModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded w-full"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#5B53E7] hover:bg-red-600 text-white font-medium py-2 px-4 rounded w-full flex items-center justify-center space-x-2"
            >
              <span>Yes</span> <FaArrowRight />
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default sidebar;


