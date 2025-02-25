import React, {useState, useEffect} from "react";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";

import { Notification, UserProfile } from "components";
import avatar from "data/avatar.jpg";
import { useStateContext } from "../../contexts/ContextProvider";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenu, setHandleIsClicked, setScreenSize } from "store/Customer/customerAction";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
      <button
        type="button"
        onClick={customFunc}
        style={{ color }}
        className="relative flex items-center justify-center text-2xl p-3 rounded-full transition duration-300 ease-in-out hover:bg-gray-800"
        aria-label={title}
      >
        <span
          style={{ background: dotColor }}
          className="absolute top-0 right-0 w-2 h-2 rounded-full"
        />
        
        {icon}
      </button>
    </TooltipComponent>
);

const AdminvbeeHeader = () => {
  const {
    handleClick,
  } = useStateContext();
  const { currentColor, activeMenu, isClicked, screenSize, } = useSelector(state => state.customer);

  const dispatch = useDispatch();


  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(setActiveMenu(false));
    } else {
      dispatch(setActiveMenu(true));
    }
  }, [screenSize]);

  const handleActiveMenu = () => dispatch(setActiveMenu(!activeMenu));

   const transformProfileData = (data) => {
      if (!data) return null;
  
      return {
        email: data.email || "-",
        role: data.role || "-",
      };
    };
    const UserProfile = () => {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
  
      useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
              throw new Error("User ID not found in localStorage");
            }
            const response = await fetch(
              `https://hcomb-container-app.victoriousbush-67842c2f.eastus.azurecontainerapps.io/user_details/${userId}`
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Raw API Response:", data);
            const transformedData = transformProfileData(data.overview);
            if (!transformedData) {
              throw new Error("Invalid profile data received");
            }
            setProfile(transformedData);
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        fetchUserProfile();
      }, []);
      if (loading) {
        return <div>Loading...</div>;
      }
      if (error) {
        return <div>Error: {error}</div>;
      }
      const getInitials = (email) => {
        if (!email) return "";
        const parts = email.split("@")[0].split(".");
        return parts.length > 1
          ? `${parts[0][0].toUpperCase()}${parts[1][0].toUpperCase()}`
          : `${email[0].toUpperCase()}${email[1].toUpperCase()}`;
      };
      return (
        <div className="profile-containerborder  rounded-lg  p-1">
            {profile ? (
              <div className="flex items-center">
                {/* Profile Image with Initials */}
                <div
                  className="flex items-center justify-center w-12 h-12  bg-[#5B53E7] text-white font-bold rounded-full"
                  style={{ fontSize: "16px" }}
                >
                  {getInitials(profile.email)}
                </div>
                <div className="ml-3">
                  <p className="text-base font-semibold text-white">
                    {profile.email}
                  </p>
                  <p className="text-sm text-gray-200 overflow-hidden whitespace-nowrap text-ellipsis w-32">
                    {profile.role}
                  </p>
                </div>
              </div>
            ) : (
              <div>No profile data available</div>
            )}
          </div>
      );
    };

  return (
    <div
      className={`fixed right-0 bg-[#1A1C1E] border-b border-[#37383A] dark:bg-main-dark-bg w-full z-10 `}
    >
      <div
        className={`flex justify-between px-8 w-full my-2.5 relative ${
          activeMenu ? "pl-80" : "pl-8"
        }`}
      >
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          color={"#BDBEBE"}
          icon={<AiOutlineMenu />}
        />
        <div className="flex justify-center items-center">
         
          {/* <NavButton
            title="Notification"
            dotColor="#F7685B"
            customFunc={() => dispatch(setHandleIsClicked("notification"))}
            color={"#BDBEBE"}
            icon={<RiNotification3Line />}
          /> */}
        
          <UserProfile/>
          {/* {isClicked.chat && <Chat />} */}
          {/* {isClicked.notification && <Notification />} */}
        </div>
      </div>
    </div>
  );
};

export default AdminvbeeHeader;
