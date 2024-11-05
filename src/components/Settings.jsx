import React from "react";
import { MDBCard } from "mdb-react-ui-kit";
import SettingsChangePassword from "./SettingsChangePassword";
function Settings() {
  return (
    <MDBCard className="w-100 h-100 p-3 d-flex flex-column ">
      <h1>Settings</h1>
      <div className="h-100 w-100">
        <SettingsChangePassword />
      </div>
    </MDBCard>
  );
}

export default Settings;
