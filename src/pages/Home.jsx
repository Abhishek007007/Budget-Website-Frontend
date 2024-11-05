import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard } from "mdb-react-ui-kit";
import { useNavigate } from "react-router";

import "./Home.css";
import { userLogout } from "../redux/authSlice";
import Dashboard from "../components/Dashboard";
import Transactions from "../components/Transactions";
import Expenses from "../components/Expenses";
import Income from "../components/Income";
import Settings from "../components/Settings";

function Home() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("Dashboard");

  function handleLogout() {
    dispatch(userLogout());
    navigate("/");
  }

  function Tab({ selectedTab }) {
    if (selectedTab === "Dashboard") {
      return <Dashboard />;
    } else if (selectedTab === "Transactions") {
      return <Transactions />;
    } else if (selectedTab === "Expenses") {
      return <Expenses />;
    } else if (selectedTab === "Income") {
      return <Income />;
    } else if (selectedTab === "Settings") {
      return <Settings />;
    } else {
      setSelectedTab("Dashboard");
    }
  }
  return (
    <div className="vh-100 vw-100 p-3 d-flex flex-row gap-3">
      <MDBCard className="w-25 h-100 p-3 bg-primary d-flex flex-column justify-content-between">
        <div className="d-flex flex-column justify-content">
          <button onClick={() => setSelectedTab("Dashboard")} className="btn">
            Dashboard
          </button>
          <button
            onClick={() => setSelectedTab("Transactions")}
            className="btn"
          >
            Transactions
          </button>
          <button onClick={() => setSelectedTab("Expenses")} className="btn">
            Expenses
          </button>
          <button onClick={() => setSelectedTab("Income")} className="btn">
            Income
          </button>
          <button onClick={() => setSelectedTab("Settings")} className="btn">
            Settings
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="btn"
          data-mdb-ripple-init
          data-mdb-ripple-color="dark"
        >
          Logout
        </button>
      </MDBCard>
      <Tab selectedTab={selectedTab} />
    </div>
  );
}

export default Home;
