import { useLogoutFunction } from "@propelauth/react";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Unauthorized = () => {
  const logout = useLogoutFunction();

  const handleLogout = async () => {
    console.log("Logging out...");
    try {
      localStorage.removeItem("__PROPEL_AUTH_LOGGED_IN_AT");
      localStorage.removeItem("__PROPEL_AUTH_LOGGED_OUT_AT");

      localStorage.removeItem("storedJobDetails");
      localStorage.clear();
      logout(true);
      const redirectToUrl = `/`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = redirectToUrl;
    } catch (error) {
      toast.error("Something Went Wrong, Please Try Again.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#1a1e1c] text-white text-shadow-lg">
        <h1 className="text-6xl mb-2 font-bold">401 | Unauthorized!</h1>
        <p className="text-lg mb-4 opacity-70 font-semibold">
          Please login again!!
        </p>
        <button
          className="w-24 bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-center text-base rounded cursor-pointer transition duration-300"
          onClick={() => handleLogout()}
        >
          Login
        </button>
      </div>
    </>
  );
};

export default Unauthorized;
