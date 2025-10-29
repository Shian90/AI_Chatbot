import { useEffect, useState } from "react";

import type { ChatFormData } from "./ChatInput";
import ChatInput from "./ChatInput";
import ChatMessages, { type ChatMessage } from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import axios from "axios";
import popSound from "@/assets/sounds/pop.mp3";
import { useOutletContext, useParams } from "react-router-dom";
import type { ChatThread } from "./Sidebar";

type ChatResponse = {
  message: ChatMessage;
};

type OutletContext = {
  chatThreads: ChatThread[];
  setChatThreads: React.Dispatch<React.SetStateAction<ChatThread[]>>;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.5;

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { chatThreadID } = useParams();
  const { chatThreads, setChatThreads } = useOutletContext<OutletContext>();

  useEffect(() => {
    const getChatHistory = async () => {
      if (!chatThreadID) return;
      try {
        const response = await axios.get(`/api/chat/${chatThreadID}`);
        setMessages(response.data.chatHistory);
      } catch (error) {
        console.error(error);
        setError("Could not load chat.");
      }
    };

    getChatHistory();
  }, [chatThreadID]);

  const onSubmit = async (formData: ChatFormData) => {
    try {
      setError("");

      const userMessage: ChatMessage = { role: "user", content: formData.prompt };
      setMessages((prev) => [...prev, userMessage]);

      popAudio.play();

      setChatThreads((prev) =>
        prev.map((thread) =>
          thread.chatThreadID === chatThreadID && thread.title === "" ? { ...thread, title: formData.prompt } : thread
        )
      );

      setIsLoading(true);

      const reqBody = {
        prompt: formData.prompt,
        chatThreadID: chatThreadID,
      };

      const response = await axios.post<ChatResponse>("/api/chat/sendMessage", reqBody);

      setMessages((prev) => [...prev, response.data.message]);
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again!");
    } finally {
      popAudio.play();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-px h-full bg-assistant-message"></div>
      <div className="flex-1 flex flex-col h-full">
        <h1 className="text-xl text-message-color m-4">EchoAI</h1>
        <hr className="border-b-border"></hr>
        <div className="flex-1 flex flex-col gap-5 px-2 w-full items-center overflow-y-auto custom-scroll">
          <div className="flex flex-col gap-5 w-[60%]">
            <ChatMessages messages={messages} />
            {isLoading && <TypingIndicator />}
            {error && <p className="text-red-500 p-4 self-start">{error}</p>}
          </div>
        </div>
        <ChatInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default ChatBot;
