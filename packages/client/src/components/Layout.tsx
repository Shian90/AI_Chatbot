import { Outlet } from "react-router-dom";
import Sidebar, { type ChatThread } from "./chat/Sidebar";
import { useState } from "react";

export const Layout = () => {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);

  return (
    <div className="flex bg-background h-screen">
      <Sidebar chatThreads={chatThreads} setChatThreads={setChatThreads} />
      <div className="flex-1">
        <Outlet context={{ chatThreads, setChatThreads }} />
      </div>
    </div>
  );
};
