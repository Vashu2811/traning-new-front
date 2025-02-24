import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserHeader from "../user/header";
import UserSidebar from "../user/sidebar";
import Header from "./header";
import Sidebar from "./sidebar";
import { useAuthInfo } from "@propelauth/react";
import { AuthContext } from "contexts/authProvider";

const ConsultantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [busy, setBusy] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const loginAt = localStorage.getItem("__PROPEL_AUTH_LOGGED_IN_AT");
  const { auth, setAuth } = useContext(AuthContext);
  const role = auth.role;
  const isTraineeBee = role === "trainee-bee";

  const authInfo = useAuthInfo();

 


  const authorizedRoles = {
    traineebee: "/training",
    adminvbee: "/adminvbee/ManageCourses",
    "trainer-bee": "/admin/courses",
    mentor: "/mentor"
  };

  const userSpecificRoutes = [
    "/training",
    "/interviewprep",
    "/training/courses/:courseId",
    "/training/courses/:courseId/module/:moduleId", 
    "/training/courses/:courseId/module/:moduleId/lesson/:lessonId",
  ];

  const isUserSpecificRoute = userSpecificRoutes.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(route)
  );

  useEffect(() => {

    return () => setBusy(false);
  }, []);

  useEffect(() => {
    if (!authInfo) {
      setBusy(false);
      return;
    }

    try {
      const { orgIdToUserOrgInfo } = authInfo.userClass || {};

      if (orgIdToUserOrgInfo) {
        const orgIds = Object.keys(orgIdToUserOrgInfo);

        for (const orgId of orgIds) {
          const userAssignedRole = orgIdToUserOrgInfo[orgId].userAssignedRole;
          // const isAuthorizedRole = allowedRoles.includes(userAssignedRole);
          setAuth({
            isAuthorized: true,
            role: userAssignedRole,
            user: authInfo.user,
          });
          if (!["traineebee", "adminvbee", "trainerbeee", "mentor", "trainer-bee"].includes(userAssignedRole)) {
            navigate("/unauthorized", { replace: true });
            return;
          }
          // navigate(authorizedRoles[userAssignedRole], { replace: true });s
          if (!busy && !loginAt) {
            navigate(authorizedRoles[userAssignedRole], { replace: true });
          } else if (location.pathname === "/") {
            navigate(authorizedRoles[userAssignedRole], { replace: true });
          }
        }
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setBusy(false);
      }, 1000);
    }
  }, [authInfo.isLoggedIn]);

  if (busy) return <>Loading...</>;

  return (
    <div
      className={`dark:bg-main-dark-bg bg-[#242728] min-h-screen w-full ${
        sidebarOpen ? "pl-72" : "pl-0"
      }`}
    >
      {isUserSpecificRoute ? (
        <>
          <UserSidebar sidebarOpen={sidebarOpen} />
          <UserHeader
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
          />
        </>
      ) : (
        <>
          <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
          {/* <Sidebar sidebarOpen={sidebarOpen} /> */}
        </>
      )}
      <div className={` ${!isUserSpecificRoute ? "pl-0" : "pl-[4.5rem]"}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default ConsultantLayout;
