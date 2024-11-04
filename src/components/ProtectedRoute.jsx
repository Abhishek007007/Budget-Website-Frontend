import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);

  if (auth.user !== null) {
    return children;
  }

  console.log(auth);
  return <Navigate to="/login" />;
}

export default ProtectedRoute;
