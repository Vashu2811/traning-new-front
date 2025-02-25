import React, { useEffect } from "react";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useNavigate } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import { useStateContext } from "../../contexts/ContextProvider";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenu, setScreenSize } from "store/Customer/customerAction";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative p-3 text-xl rounded-full hover:bg-[#292B2D]"
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex w-2 h-2 rounded-full right-2 top-2"
        />
      )}
      {icon}
    </button>
  </TooltipComponent>
);

// const ProfileSection = ({ navigate }) => {
//   const { profile } = useSelector((state) => state.user);
//   return(
//   <TooltipComponent content="Profile" position="BottomCenter">
//     <div
//       className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-[#292B2D]"
//       onClick={() => navigate("/mentor/profile")}
//     >
//       <div className="">

//       </div>
//       <div>
//         <p className="ml-1 text-base font-semibold text-white">{profile.name}</p>
//         <p
//           className="ml-1 text-sm text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis w-32"
//           title="Intro of Mentor | role"
//         >
//           {profile?.user_details?.role || profile.intro}
//         </p>
//       </div>
//       {/* <MdKeyboardArrowDown className="text-sm text-white" /> */}
//     </div>
//   </TooltipComponent>
// )};

const ProfileSection = ({ navigate }) => {
  const { profile } = useSelector((state) => state.user);

  const initials = profile?.name
    ?.match(/(^\w\w?|\b\w)?/g)
    ?.join('')
    ?.match(/(^\w|\w$)?/g)
    ?.join('')
    ?.toUpperCase();

  return (
    <TooltipComponent content="Profile" position="BottomCenter">
      <div
        className="flex items-center gap-2 p-1 rounded-lg cursor-pointer hover:bg-[#292B2D]"
        onClick={() => navigate("/mentor/profile")}
      >
        {/* Initials Placeholder */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5b52e7] text-white font-semibold text-lg">
          {initials}
        </div>
        
        <div>
          <p className="ml-1 text-base font-semibold text-white">{profile.name}</p>
          <p
            className="ml-1 text-sm text-gray-400 overflow-hidden whitespace-nowrap text-ellipsis w-32"
            title="Intro of Mentor | role"
          >
            {profile?.user_details?.role || profile.intro}
          </p>
        </div>
      </div>
    </TooltipComponent>
  );
};

const MentorvbeeHeader = () => {
  const { activeMenu, screenSize, } = useSelector(state => state.customer);
  const navigate = useNavigate();
  const { } = useStateContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));
    window.addEventListener("resize", handleResize);

    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    dispatch(setActiveMenu(screenSize > 900));
  }, [screenSize, setActiveMenu]);

  const toggleMenu = () => dispatch(setActiveMenu(!activeMenu));

  return (
    <div
      className="fixed right-0 w-full z-10 bg-[#1A1C1E] border-b border-[#37383A]"
    >
      <div
        className={`flex justify-between items-center px-8 my-2.5 w-full transition-all ${activeMenu ? "pl-80" : "pl-8"
          }`}
      >
        <NavButton
          title="Menu"
          customFunc={toggleMenu}
          color="#BDBEBE"
          icon={<AiOutlineMenu />}
        />

        <ProfileSection navigate={navigate} />
      </div>
    </div>
  );
};

export default MentorvbeeHeader;
