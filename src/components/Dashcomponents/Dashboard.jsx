import React from "react";
import { Outlet } from "react-router-dom";
import DashHeader from "./Dcomponents/DashHeader";

function Dashboard() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Dashboard;
