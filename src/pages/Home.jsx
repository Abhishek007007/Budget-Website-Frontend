import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard } from "mdb-react-ui-kit";
import { useNavigate } from "react-router";

import "./Home.css";
import { userLogout } from "../redux/authSlice";

function Home() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(userLogout());
    navigate("/");
  }
  return (
    <div className="vh-100 vw-100 p-3 d-flex gap-3">
      <MDBCard className="w-25 h-100 p-3 bg-primary d-flex flex-column justify-content-between">
        <div>
          <h1>Home page</h1>
          <p>ID : {auth.user.id}</p>
          <p>Username : {auth.user.username}</p>
          <p>Email : {auth.user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger btn-rounded"
          data-mdb-ripple-init
          data-mdb-ripple-color="dark"
        >
          Logout
        </button>
      </MDBCard>
      <MDBCard className="w-100 h-100 p-3 ">
        <h1>Home page</h1>
        <p>ID : {auth.user.id}</p>
        <p>Username : {auth.user.username}</p>
        <p>Email : {auth.user.email}</p>
      </MDBCard>
    </div>
  );
}

export default Home;
