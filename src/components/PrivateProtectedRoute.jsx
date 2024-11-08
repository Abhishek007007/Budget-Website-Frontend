import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function PrivateProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);
  useEffect(() => {}, [auth.loading]);

  if (auth.user !== null) {
    return children;
  }

  if (auth.loading) {
    return <h1>Loading</h1>;
  }

  return <Navigate to="/login" />;
}

export default PrivateProtectedRoute;
