import { useStateContext } from "contexts/ContextProvider";
import { BiBookOpen, BiSolidFileBlank, BiSolidVideos } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom"
import logo from "../../data/logo-light.svg";
import logo_gray from "../../data/logo-gray.svg";
import LogoutIcon from '@mui/icons-material/Logout';

import { useLogoutFunction } from "@propelauth/react";

const MentorvbeeSidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } =
    useStateContext();

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };
  const generatePath = (name) => {
    return `/mentor/${name.toLowerCase().replace(/\s+/g, "-")}`;
  };
  const logout = useLogoutFunction();

  const handleLogout = (event) => {
    event.preventDefault();
    console.log("Logging out...");
    localStorage.removeItem("__PROPEL_AUTH_LOGGED_IN_AT");
    localStorage.removeItem("__PROPEL_AUTH_LOGGED_OUT_AT");
    localStorage.removeItem("auth");
    localStorage.clear()
    logout(false);
    // navigate("/");

    // window.location.href = "/";
   window.location.href  = "https://training.hcomb.ai"
  };

  const links = [
    {
      title: "Mentor",
      links: [
        {
          name: "Instruction",
          icon: <BiBookOpen />,
        },
        {
          name: "Files",
          icon: <BiSolidFileBlank />,
        },
        {
          name: "Videos",
          icon: <BiSolidVideos />,
        },
      ],
    },
  ];

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white bg-[#292B2D] text-lg m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-lg text-[#8F9BB3] hover:text-white hover:bg-[#292B2D] m-2";

  return (
    <>
    <style>
      {`
      .sidebar::before {
        content: "";
        width: 100%;
        height: 30%;
        position: absolute;
        bottom: 0;
        left: -10%;
        background: url(${logo_gray}) no-repeat bottom / contain;
      }
      `}
    </style>
      {activeMenu && (
        <div className="fixed z-20 w-72 sidebar border-r border-[#37383A]">
          <div className="flex flex-col pl-3 bg-[#1A1C1E] transition-all duration-300 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
            <div className="flex items-center justify-between  border-b border-[#37383A] py-4">
              <Link
                to="/"
                onClick={handleCloseSidebar}
                className="flex items-center gap-3 ml-3 text-xl font-extrabold tracking-tight text-white uppercase dark:text-white"
              >
                <span><img src={logo} alt="logo"></img></span>
              </Link>
              {/* TooltipComponent code */}
            </div>
            <div className="mt-8">
              {links.map((item) => (
                <div key={item.title}>
                  <p className="m-3 text-lg font-bold text-white capitalize">
                    {item.title}
                  </p>
                  {item.links.map((link) => (
                    <NavLink
                      {...(link?.url ? {target: "_blank"}:{})}
                      to={link?.url ? link.url : generatePath(link.name)}
                      key={link.name}
                      onClick={handleCloseSidebar}
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? "bg-[#292B2D]" : "",
                        color: isActive ? "#FFF" : "",
                      })}
                      className={({ isActive }) =>
                        isActive ? activeLink : normalLink
                      }
                    >
                      {link.icon}
                      <span className="text-base font-bold capitalize">
                        {link.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              ))}
            </div>
             <div className="absolute bottom-4 w-full pr-7">
              <button
                className="w-full bg-[#5B53E7] text-white border-2 border-transparent rounded-lg py-2 px-4 transition-all hover:bg-red-600 flex items-center justify-center gap-2"
                onClick={handleLogout}
              >
              Logout
              <LogoutIcon className="pl-2 font-bold		" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorvbeeSidebar;
