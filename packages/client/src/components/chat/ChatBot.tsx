import { useRef, useState } from "react";

import type { ChatFormData } from "./ChatInput";
import ChatInput from "./ChatInput";
import type { ChatMessage } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
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

      setMessages((prev) => [...prev, response.data.message]);
      popAudio.play();
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[rgba(64,60,81,0.5)] sticky p-4 text-white w-fit rounded-2xl">
        <h1 className="text-l">ChatBot</h1>
      </div>
      <div className="custom-scroll flex flex-col flex-1 mb-5 overflow-y-auto px-3 items-center">
        <div className="flex flex-col gap-5 w-[50%]">
          <ChatMessages messages={messages} />
          {isLoading && <TypingIndicator />}
          {error && <p className="text-red-500 p-4">{error}</p>}
        </div>
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
