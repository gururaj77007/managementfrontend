import { createContext, useEffect, useState } from "react";
import firebaseApp from "../firebase/firebase-config";

export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token, role, houseid) => {},
  logout: async () => {},
  role: "",
  houseid: "",
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [role, setRole] = useState(null);
  const [houseid, setHouseId] = useState(null);

  useEffect(() => {
    const gettoken = async () => {
      const token = await localStorage.getItem("clienttoken");
      console.log("called");
      const rolet = await localStorage.getItem("role");

      const houseidt = await localStorage.getItem("houseid");
      setRole(rolet);
      setHouseId(houseidt);

      const user = firebaseApp.currentUser;
      if (user) {
        user.getIdTokenResult().then((idTokenResult) => {
          console.log(idTokenResult.claims.type);
          setRole(idTokenResult.claims.role);
          setHouseId(idTokenResult.claims.houseid);
          console.log("role set");
        });
      }
      setAuthToken(token);
    };

    gettoken();
  }, []);

  async function authenticate(token, role, houseid) {
    console.log("function called");
    const user = firebaseApp.currentUser;
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        console.log(idTokenResult.claims);
        setRole(idTokenResult.claims.role);
        alert(idTokenResult.claims.role);
        setHouseId(idTokenResult.claims.houseid);
        localStorage.setItem("role", idTokenResult.claims.type);
        localStorage.setItem("houseid", idTokenResult.claims.houseid);
      });
    }

    setAuthToken(token);
    localStorage.setItem("clienttoken", token);
  }

  async function logout() {
    try {
      const re = await firebaseApp.signOut();
      console.log(re);

      setAuthToken(null);
      setRole(null);
      setHouseId(null);
      localStorage.clear();
    } catch (e) {
      console.log(e);
    }
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    role: role,
    houseid: houseid,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
