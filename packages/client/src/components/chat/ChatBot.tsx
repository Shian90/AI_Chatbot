import { useRef, useState } from "react";

import type { ChatFormData } from "./ChatInput";
import ChatInput from "./ChatInput";
import type { ChatMessage } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import axios from "axios";

type ChatResponse = {
  message: ChatMessage;
};

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

      setIsLoading(true);

      const reqBody = {
        prompt: formData.prompt,
        chatThreadId: chatThreadId.current,
      };

      const response = await axios.post<ChatResponse>("/api/chat", reqBody);

      setMessages((prev) => [...prev, response.data.message]);
    } catch (error) {
      console.error(error);
      setError("Something went wrong, try again!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="custom-scroll flex flex-col flex-1 mb-5 overflow-y-auto px-3">
        <ChatMessages messages={messages} />
        {isLoading && <TypingIndicator />}
        {error && <p className="text-red-500 p-4">{error}</p>}
      </div>
      <ChatInput onSubmit={onSubmit} />
    </div>
  );
};

export default ChatBot;
