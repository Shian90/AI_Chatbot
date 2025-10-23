import { Outlet } from "react-router-dom";
import Sidebar from "./chat/Sidebar";

export const Layout = () => {
  return (
    <div className="flex bg-background h-screen">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
