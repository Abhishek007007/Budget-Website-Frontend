import { MDBCard } from "mdb-react-ui-kit";
import React from "react";
import { useSelector } from "react-redux";

function Dashboard() {
  const auth = useSelector((state) => state.auth);
  return (
    <MDBCard className="w-100 h-100 p-3 ">
      <h1>Dashboard</h1>
      <p>ID : {auth.user.id}</p>
      <p>Username : {auth.user.username}</p>
      <p>Email : {auth.user.email}</p>
    </MDBCard>
  );
}

export default Dashboard;
