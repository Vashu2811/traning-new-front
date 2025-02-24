import AdminvbeeHeader from "./AdminvbeeHeader";
import { useEffect, useState } from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useStateContext } from "../../contexts/ContextProvider";

import AdminvbeeSidebar from "./AdminvbeeSidebar";
import { useAuthInfo } from "@propelauth/react";
const Adminvbee = () => {
  const indexPage = useMatch("/");
  const [isIndex, setIsIndex] = useState(indexPage || false);
  const { activeMenu, activeHeader } = useStateContext();
  const navigate = useNavigate();
  const auth = useAuthInfo();
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

    if (userAssignedRole !== "adminvbee") {
      navigate("/unauthorized");
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
    <AdminvbeeHeader />
    <AdminvbeeSidebar />

    <main className={twMerge(
      consultantSidebarStyles,
      activeMenu ? "hidden md:block" : ""
    )}>
      <Outlet />
    </main>
  </div> 
  );
};
export default Adminvbee;
