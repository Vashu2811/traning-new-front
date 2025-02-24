import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";

import {  Notification, UserProfile } from "components";
import avatar from "data/avatar.jpg";
import { useStateContext } from "../../contexts/ContextProvider";
import logo from "../../data/logo-ico.svg"
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative p-3 text-xl rounded-full hover:bg-[#292B2D]"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex w-2 h-2 rounded-full right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Header = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  const [auth,setAuth] = useState()

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

useEffect(()=>{
  const authString = localStorage.getItem("auth");
  const authObject = JSON.parse(authString);
  console.log('auth?.user?.email =====', authObject?.user?.email);
  setAuth(authObject);
},[])
 const transformProfileData = (data) => {
    if (!data) return null;

    return {
      email: data.email || "N/A",
      role: data.role || "Unknown",
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
      <div className="profile-containerborder  rounded-lg">
          {profile ? (
            <div className="flex items-center">
              {/* Profile Image with Initials */}
              <div
                className="flex items-center justify-center w-11 h-11  bg-[#5B53E7] text-white font-bold rounded-full"
                style={{ fontSize: "14px" }}
              >
                {getInitials(profile.email)}
              </div>
              <div className="ml-3">
                <p className="text-[14px] font-semibold text-white">
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
      className={`fixed right-0 bg-[#1A1C1E] border-b border-[#37383A] dark:bg-main-dark-bg w-full z-10 py-3`}
    >
      <div
        className={`flex justify-between px-8 w-full relative ${
          activeMenu ? "pl-80" : "pl-1"
        }`}
        >
          <div className="flex flex-row">
            
          {/* {!activeMenu && <img src={logo} alt="logo" className="mr-2" />} */}
          <NavButton
            title="Menu"
            customFunc={handleActiveMenu}
            color={"#BDBEBE"}
            icon={<AiOutlineMenu />}
            />
            </div>
        <div className="flex justify-center items-center">
          
          {/* <NavButton
            title="Notification"
            dotColor="#F7685B"
            customFunc={() => handleClick("notification")}
            color={"#BDBEBE"}
            icon={<RiNotification3Line />}
          /> */}
          {/* <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-[#292B2D]"
              onClick={() => handleClick("userProfile")}
            >
            
              <p>
                
                <span className="ml-1 text-base font-semibold text-white">
                 Profile
                </span>
              </p>
              <MdKeyboardArrowDown className="text-sm text-white" />
            </div>
          </TooltipComponent> */}

          {/* {isClicked.chat && <Chat />} */}
          {/* {isClicked.notification && <Notification />} */}
          {/* {isClicked.userProfile && <UserProfile auth={auth}/>} */}
          <UserProfile />
        </div>
      </div>
    </div>
  );
};

export default Header;
