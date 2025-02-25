
import MentorvbeeHeader from "./MentorvbeeHeader";
import { useEffect, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useStateContext } from "../../contexts/ContextProvider";
import MentorvbeeSidebar from "./MentorvbeeSidebar";
import { useAuthInfo } from "@propelauth/react";
import { useSelector } from "react-redux";

const Mentorvbee = () => {
  const { activeMenu, activeHeader } = useSelector(state => state.customer);
  const indexPage = useMatch("/");
  const [isIndex, setIsIndex] = useState(indexPage || false);
  const {  } = useStateContext();
  const navigate = useNavigate();
  const auth = useAuthInfo()
  useEffect(() => {
    if (indexPage) setIsIndex(true);
    return () => setIsIndex(false);
  }, [indexPage]);


  useEffect(() => {
    const userClass = auth.userClass;
    let userAssignedRole = null;

    for (const orgId in userClass.orgIdToUserOrgInfo) {
      const userOrgInfo = userClass.orgIdToUserOrgInfo[orgId];
      userAssignedRole = userOrgInfo.userAssignedRole;
    }

    if (userAssignedRole !== 'mentor') {
      navigate('/unauthorized'); // Redirect to unauthorized page
    }
  }, [auth, navigate]);


  const consultantSidebarOpen = isIndex && activeHeader;
  const consultantSidebarStyles = twMerge(
    "relative top-0 w-full mb-12",
    consultantSidebarOpen ? "pl-72" : "pl-0",
    activeMenu ? "pl-72" : "pl-0"
  );

  return (
    <div className="dark:bg-main-dark-bg bg-[#242728] text-white min-h-screen w-full">
     
      <MentorvbeeHeader />
      <MentorvbeeSidebar />

      <main
        
        className={consultantSidebarStyles}
      >
        <Outlet />
      </main>
    </div>
  );
};
export default Mentorvbee;
