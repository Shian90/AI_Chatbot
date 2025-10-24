import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../ui/button";
import axios from "axios";

export type ChatThread = {
  chatThreadID: string;
  title: string;
};

const Sidebar = () => {
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);

  const { chatThreadID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatThreads = async () => {
      try {
        const response = await axios.get("api/chat");
        const chatThreads: ChatThread[] = response.data.chatThreads;

        setChatThreads(chatThreads);
        console.log(chatThreads);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatThreads();
  }, []);

  const onClick = (chatThreadID: string, newChatButton: boolean) => {
    if (newChatButton) {
      const newThreadAlreadyExists: boolean = chatThreads.findIndex((data: ChatThread) => data.title === "") !== -1;

      if (!newThreadAlreadyExists) setChatThreads((prev) => [...prev, { chatThreadID: chatThreadID, title: "" }]);
    }

    navigate(`/chat/${chatThreadID}`);
  };

  return (
    <div className="flex flex-col h-full gap-2 p-2 w-[15%] bg-sidebar-primary overflow-y-auto custom-scroll">
      <Button
        onClick={() => {
          onClick(crypto.randomUUID(), true);
        }}
        className="hover:bg-control-hover-color bg-control-color text-md text-background my-2">
        + New Chat
      </Button>
      <hr className="border-assistant-message border-1"></hr>

      {chatThreads.map((chatThread: ChatThread) => {
        const isActive = chatThreadID === chatThread.chatThreadID;
        return (
          <div
            key={chatThread.chatThreadID}
            onClick={() => onClick(chatThread.chatThreadID, false)}
            className={`${
              isActive ? "bg-select-item hover:bg-none" : "bg-none hover:bg-assistant-message"
            } px-3 py-2 text-md truncate text-message-color rounded-lg`}>
            {chatThread.title === "" ? "New Thread" : chatThread.title}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
