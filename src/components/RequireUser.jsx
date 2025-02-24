
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserRole } from "../services/api"; // Import a function to fetch user role after login

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RequireUser = () => {
  // const { user } = useAuth();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [userRole, setUserRole] = useState(""); // State to store user role

  useEffect(() => {
    // Update isAuthenticated when the token changes in localStorage
    const handleTokenChange = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, []);

  useEffect(() => {
    // Fetch user role after getting the token
    const fetchUserRole = async () => {
      try {
        const response = await getUserRole(); // Call API to get user role
        // const { role } = response; // Adjust this based on the actual API response structure
        // Set the user role in state
        setUserRole(response);

        // Handle redirection based on user role
      } catch (error) {
        
toast.error("Something Went Wrong, Please Try Again.", {
  autoClose: 3000,
});
      }
    };

    // If authenticated, fetch the user role
    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);
  // Render based on user role or authentication status
  // if (!isAuthenticated) {
  //   return <Navigate to="/signin" />;
  // } else if (userRole === "admin") {
  //   return <Outlet />;
  // } else {
  //   return <Navigate to="/home" />;
  // }
};

export default RequireUser;
