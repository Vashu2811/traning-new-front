/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@mui/material";
import { useAuthInfo, useRedirectFunctions } from "@propelauth/react";
import { useStateContext } from "contexts/ContextProvider";
import useAuth from "hooks/useAuth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "styles/Consultant.css";
import logo from "../../data/logo-light.svg";
import { useDispatch, useSelector } from "react-redux";
import { setActiveHeader } from "store/Customer/customerAction";


const Header = ({ sidebarOpen, setSidebarOpen }) => {
  // const { auth } = useAuth();
  const { redirectToLoginPage, redirectToSignupPage, redirectToAccountPage } =
    useRedirectFunctions();
  const authInfo = useAuthInfo(); // Assuming useAuthInfo() provides the JSON response

  const navigate = useNavigate();
  const {
    handleClick,
    
    setScreenSize,
    
  } = useStateContext();
  const { currentColor, activeHeader, isClicked, screenSize, } = useSelector(state => state.customer);

  const dispatch = useDispatch();

  const [color, setColor] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setColor(true);
      } else {
        setColor(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if (screenSize <= 900) {
      dispatch(setActiveHeader(false));
    } else {
      dispatch(setActiveHeader(true));
    }
  }, [screenSize]);

  const handleActiveMenu = () => dispatch(setActiveHeader(!activeHeader));
  const handleLoginClick = () => {
    

    if (authInfo && authInfo.isLoggedIn) {
      const userOrgInfo = authInfo.userClass.orgIdToUserOrgInfo;
      const orgIds = Object.keys(userOrgInfo);

      for (const orgId of orgIds) {
        const userAssignedRole = userOrgInfo[orgId].userAssignedRole;
      
      }
    }


    redirectToLoginPage({
      postLoginRedirectUrl: "http://localhost:3000/",
    });
  };
  return (
    <header
    className={`flex items-center py-3 px-5 font-semibold bg-[#1A1C1E] z-50 fixed w-full top-0`}
  >
    <div className={`w-full transition-all duration-300 ${sidebarOpen ? "pr-80" : "pr-8"}`}>
      <div className="flex  justify-between items-center">
        <div className="flex justify-center md:justify-start items-center mb-4 md:mb-0">
          <Link to="/" className="logo">
            <img src={logo} alt="logo" className="w-24 h-auto" />
          </Link>
        </div>
  
        <div className="flex gap-4 items-center">
          <Button
            style={{
              color: "#5B53E7",
              background: "white",
              borderRadius: "12px",
              textTransform: "capitalize",
            }}
            className="signin-btn"
            onClick={() =>
              redirectToLoginPage({
                // postLoginRedirectUrl: "http://localhost:3000/",
                postLoginRedirectUrl: "https://training.hcomb.ai/",
              })
            }
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
    
  </header>
  );
};
export default Header;
