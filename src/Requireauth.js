import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./store/authcontext";
import { useContext } from "react";

import React from "react";

function Requireauth({ children }) {
  const storedUid = localStorage.getItem("clienttoken");
  const location = useLocation();
  const authcon = useContext(AuthContext);

  if (storedUid) {
    return children;
  } else {
    return <Navigate to="/auth" state={{ path: location.pathname }}></Navigate>;
  }
}

export default Requireauth;
