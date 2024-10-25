import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ element, isLoggedIn }) {
  return isLoggedIn ? element : <Navigate to={"/login/admin"} />;
}

export default PrivateRoute;
