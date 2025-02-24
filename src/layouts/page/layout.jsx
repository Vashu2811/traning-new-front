/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useStateContext } from "../../contexts/ContextProvider";
// import ConsultantHeader from "../consultant/header";
// import ConsultantSidebar from "../consultant/sidebar";
import Header from "./header";
import Sidebar from "./sidebar";
import { useAuthInfo, useOrgHelper } from "@propelauth/react";
// import ConsultantHeader from "../consultant/";
const PageLayout = () => {
  const orgHelper = useOrgHelper();
  const indexPage = useMatch("/");
  const [isIndex, setIsIndex] = useState(indexPage || false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeMenu, activeHeader } = useStateContext();
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

    if (userAssignedRole !== 'trainer-bee') {
      navigate('/unauthorized'); 
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
    <Header />
    <Sidebar />

    <main className={twMerge(
      consultantSidebarStyles,
      activeMenu ? "hidden md:block" : ""
    )}>
      <Outlet />
    </main>
  </div>
  );
};
export default PageLayout;
