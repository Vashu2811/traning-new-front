import { useContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/authProvider";
import { useAuthInfo } from "@propelauth/react";
import { setUserId, users } from "services/api";
import { useDispatch } from 'react-redux';
import { fetchUserProfile } from '../store/reducers/userSlice';

const Auth = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authInfo = useAuthInfo();
  const dispatch = useDispatch();
  const { auth } = useContext(AuthContext);
  const location = useLocation();


  const isAuthorizedRole = useMemo(
    () => allowedRoles.includes(auth.role),
    [allowedRoles, auth]
  );

  useEffect(() => {
    const setUser = async () => {
      const { role, user: { email, userId } } = auth;

      if (role && email && userId) {
        const data = {
          overview: {
            email,
            prople_auth_id: userId,
            role
          }
        };

        try {
          const response = await users(data);
          
          if (response?.user_id) {
            setUserId(response.user_id);
            
            // If the role is mentor, fetch the user profile
            if (role.toLowerCase() === 'mentor') {
              try {
                await dispatch(fetchUserProfile()).unwrap();
              } catch (error) {
                console.error('Error fetching mentor profile:', error);
              }
            }
          }
        } catch (error) {
          console.error('Error setting user:', error);
        }
      }
    };

    if (auth?.role && auth?.user?.email && auth?.user?.userId) {
      setUser();
    }
  }, [isAuthorizedRole, auth, dispatch]);

  if (!authInfo.userClass) {
    return null;
  }

  return (
    <>
      {isAuthorizedRole ? (
        <Outlet />
      ) : (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      )}
    </>
  );
};

export default Auth;
