import { MdOutlineCancel } from "react-icons/md";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";
import { userProfileData } from "../data/dummy";
import { useLogoutFunction } from "@propelauth/react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UserProfile = ({auth}) => {
  const { currentColor, handleClick } = useStateContext();
  const logout = useLogoutFunction();

  const navigate = useNavigate();

  // const handleLogout = async () => {
  //   console.log("Logging out...");
  //   try {
  //     localStorage.removeItem("__PROPEL_AUTH_LOGGED_IN_AT");
  //     localStorage.removeItem("__PROPEL_AUTH_LOGGED_OUT_AT");
  //     localStorage.removeItem("auth");
  //     logout(true);
  //     const redirectToUrl = `https://training.hcomb.ai`;
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     window.location.href = redirectToUrl;
  //   } catch (error) {
  //     toast.error("Something Went Wrong, Please Try Again.", {
  //       autoClose: 3000,
  //     });
  //   }
  // };

  const handleLogout = (event) => {
    event.preventDefault();
    console.log("Logging out...");
    localStorage.removeItem("__PROPEL_AUTH_LOGGED_IN_AT");
    localStorage.removeItem("__PROPEL_AUTH_LOGGED_OUT_AT");
    localStorage.removeItem("auth");
    logout(false);
    // navigate("/");

    // window.location.href = "/";
   window.location.href  = "https://training.hcomb.ai"
  };
  const closeProfile = (e) => {
    if (!document.getElementById("profileContainer").contains(e.target)) {
      handleClick(false); // Close profile if click is outside the profile
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeProfile);

    return () => {
      document.removeEventListener("mousedown", closeProfile);
    };
  }, []);

  return (
    <>      
<ToastContainer />
    <div
      id="profileContainer"
      className="nav-item absolute right-1 top-16 bg-[#1A1C1E] text-[#BDBEBE] dark:bg-[#42464D] p-8 rounded-lg w-96"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <button
          type="button"
          onClick={() => handleClick(false)}
          style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
          className="text-2xl p-3 hover:drop-shadow-xl hover:bg-[#282B2F]"
        >
          <MdOutlineCancel />
        </button>
      </div>
      
         
          <p className="text-[#BDBEBE] text-sm font-semibold dark:text-gray-400">
          {auth?.user?.email}
          </p>
          
      {/* <div>
        {userProfileData.map((item, index) => (
          <div
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-[#282B2F] cursor-pointer  dark:hover:bg-[#42464D]"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-gray-200 ">{item.title}</p>
              <p className="text-[#BDBEBE] text-sm dark:text-gray-400">
                {" "}
                {item.desc}{" "}
              </p>
            </div>
          </div>
        ))}
      </div> */}
      <div className="mt-2">
        <Button
          color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          onClick={handleLogout}
        />

        {/* <button
          onClick={() =>
            RedirectToSignup({
              postLoginRedirectUrl: "http://localhost:3000/",
            })
          }
        >
          Logout
        </button> */}
      </div>
    </div>
    </>

  );
};

export default UserProfile;
