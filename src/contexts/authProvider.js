/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const initUser = {
  isAuthorized: false,
  role: null,
  user: null,
};

// const authInfo = useAuthInfo();
const getInitialState = () => {
  const user = localStorage.getItem("auth");
  return user ? JSON.parse(user) : initUser;
};

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialState);


  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
