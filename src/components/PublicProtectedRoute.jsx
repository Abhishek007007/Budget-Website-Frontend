import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function PublicProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);
  useEffect(() => {}, [auth.loading]);

  if (auth.user !== null) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PublicProtectedRoute;
