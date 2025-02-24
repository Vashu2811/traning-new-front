import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { BsChatLeft } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiNotification3Line } from "react-icons/ri";

import {  Notification, UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative p-3 text-xl rounded-full hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex w-2 h-2 rounded-full right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

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

  return (
    <div className="relative flex justify-between px-8 mt-4">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={"#5B53E7"}
        icon={<AiOutlineMenu />}
      />
      <div className="flex">
        <NavButton
          title="Cart"
          customFunc={() => handleClick("cart")}
          color={"#5B53E7"}
          icon={<FiShoppingCart />}
        />
        <NavButton
          title="Chat"
          dotColor="#F7685B"
          customFunc={() => handleClick("chat")}
          color={"#5B53E7"}
          icon={<BsChatLeft />}
        />
        <NavButton
          title="Notification"
          dotColor="#F7685B"
          customFunc={() => handleClick("notification")}
          color={"#5B53E7"}
          icon={<RiNotification3Line />}
        />
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-light-gray"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="w-8 h-8 rounded-full"
              src={avatar}
              alt="user-profile"
            />
            <p>
              <span className="text-[#374151] font-semibold text-base">
                Hi,
              </span>{" "}
              <span className="text-[#374151] font-semibold ml-1 text-base">
                Admin
              </span>
            </p>
            <MdKeyboardArrowDown className="text-[#374151] text-sm" />
          </div>
        </TooltipComponent>

        {/* {isClicked.chat && <Chat />} */}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
