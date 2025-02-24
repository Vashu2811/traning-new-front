/* eslint-disable react-hooks/rules-of-hooks */
import { Link } from "react-router-dom";
import "styles/Consultant.css";
const Sidebar = ({ sidebarOpen }) => {

  return (
    <>
      <aside
        className={`w-72 flex flex-col bg-[#1A1C1E] text-white fixed inset-y-0 left-0 z-30 ${
          !sidebarOpen && "-translate-x-full"
        }`}
      >
        <nav className="flex-1 flex flex-col bg-[#1A1C1E] pt-20 border-r-2 border-[#37383A] ">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="#" className="nav-link">
            Pricing
          </Link>
          <Link to="#" className="nav-link">
            Enterprise
          </Link>
          <Link to="#" className="nav-link">
            Professions We Cover
          </Link>
          <Link to="#" className="nav-link">
            Training
          </Link>
          <Link to="/queenbee" className="nav-link">
            Queenbee
          </Link>

          <Link to="#" className="nav-link-sub" sx={{ marginTop: "48px" }}>
            FAQs
          </Link>
          <Link to="#" className="nav-link-sub">
            Support & Video Tutorials
          </Link>
          <Link to="#" className="nav-link-sub">
            Contact Us
          </Link>
          <Link to="#" className="nav-link-sub">
            Blog
          </Link>
          
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
