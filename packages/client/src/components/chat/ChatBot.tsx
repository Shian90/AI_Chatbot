import { useRef, useState } from "react";

import type { ChatFormData } from "./ChatInput";
import ChatInput from "./ChatInput";
import ChatMessages, { type ChatMessage } from "./ChatMessages";
import Sidebar from "./Sidebar";
import TypingIndicator from "./TypingIndicator";
import axios from "axios";
import popSound from "@/assets/sounds/pop.mp3";

type ChatResponse = {
  message: ChatMessage;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.5;

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const chatThreadId = useRef(crypto.randomUUID());

  const onSubmit = async (formData: ChatFormData) => {
    try {
      setError("");

      const userMessage: ChatMessage = { role: "user", content: formData.prompt };
      setMessages((prev) => [...prev, userMessage]);

      popAudio.play();

      setIsLoading(true);

      const reqBody = {
        prompt: formData.prompt,
        chatThreadId: chatThreadId.current,
      };

      const response = await axios.post<ChatResponse>("/api/chat", reqBody);

      popAudio.play();
      setMessages((prev) => [...prev, response.data.message]);
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar title={messages.length > 0 ? messages[0].content : "New Thread"} />
      <div className="w-px h-full bg-assistant-message"></div>
      <div className="flex flex-1 flex-col h-full p-4">
        <div className="sticky text-white w-fit rounded-2xl">
          <h1 className="text-xl text-white">ChatBot</h1>
        </div>
        <div className="flex flex-col flex-1 gap-5 px-3 self-center w-[66%] items-center overflow-y-auto custom-scroll">
          <ChatMessages messages={messages} />
          {isLoading && <TypingIndicator />}
          {error && <p className="text-red-500 p-4 self-start">{error}</p>}
        </div>
        <ChatInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default ChatBot;
