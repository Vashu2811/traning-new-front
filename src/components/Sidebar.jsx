import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import {
  AiOutlineCalendar,
  AiOutlineShoppingCart,
  AiOutlineStock,
} from "react-icons/ai";
import { IoMdContacts } from "react-icons/io";
import { RiContactsLine } from "react-icons/ri";
import { BsKanban } from "react-icons/bs";
import { BiColorFill } from "react-icons/bi";
import logo from "../data/logo-light.svg";

const Sidebar = () => {
  const { activeMenu, setActiveMenu, screenSize, currentColor } =
    useStateContext();
  const convertToValidRoute = (name) => {
    return name.replace(/\s+/g, "-");
  };
  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const links = [
    // {
    //   title: "Training",
    //   links: [
    //     {
    //       name: "Lesson 1",
    //       icon: <FiShoppingBag />,
    //     },
    //   ],
    // },
    {
      title: "Training",
      links: [
        {
          name: "Modules",
          icon: <BiColorFill />,
        },
        {
          name: "Lessons",
          icon: <AiOutlineShoppingCart />,
        },
        {
          name: "Quizzes",
          icon: <IoMdContacts />,
        },
        {
          name: "Exercises",
          icon: <RiContactsLine />,
        },
        {
          name: "Resources",
          icon: <BsKanban />,
        },
      ],
    },
    {
      title: "Interview Prep",
      links: [
        {
          name: "Interview Prep",
          icon: <AiOutlineCalendar />,
        },
        // {
        //   name: "kanban",
        //   icon: <BsKanban />,
        // },
        // {
        //   name: "editor",
        //   icon: <FiEdit />,
        // },
        // {
        //   name: "color-picker",
        //   icon: <BiColorFill />,
        // },
      ],
    },
    {
      title: "Real-time scenarios",
      links: [
        {
          name: "Real-time scenarios",
          icon: <AiOutlineStock />,
        },
        // {
        //   name: "area",
        //   icon: <AiOutlineAreaChart />,
        // },
        // {
        //   name: "bar",
        //   icon: <AiOutlineBarChart />,
        // },
        // {
        //   name: "pie",
        //   icon: <FiPieChart />,
        // },
        // {
        //   name: "financial",
        //   icon: <RiStockLine />,
        // },
        // {
        //   name: "color-mapping",
        //   icon: <BsBarChart />,
        // },
        // {
        //   name: "pyramid",
        //   icon: <GiLouvrePyramid />,
        // },
        // {
        //   name: "stacked",
        //   icon: <AiOutlineBarChart />,
        // },
      ],
    },
    {
      title: "Job Support",
      links: [
        {
          name: "Job Support",
          icon: <AiOutlineStock />,
        },
      ],
    },
  ];

  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link
              to="/"
              onClick={handleCloseSidebar}
              className="items-center  gap-3 ml-3 mt-4 flex text-xl uppercase font-extrabold tracking-tight dark:text-white text-slate-900"
            >
                            <span><img src={logo} alt="logo"></img></span>

            </Link>
            {/* TooltipComponent code */}
          </div>
          <div className="mt-8">
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-[#5B53E7] font-bold m-3 capitalize">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  <NavLink
                    to={`/${convertToValidRoute(link.name)}`}
                    key={link.name}
                    onClick={handleCloseSidebar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? "#FFF" : "",
                      color: isActive ? "#8B85E7" : "",
                    })}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                  >
                    {link.icon}
                    <span className="text-sm font-bold capitalize">
                      {link.name}
                    </span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
