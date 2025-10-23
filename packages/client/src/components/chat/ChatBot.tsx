import { useEffect, useState } from "react";

import type { ChatFormData } from "./ChatInput";
import ChatInput from "./ChatInput";
import ChatMessages, { type ChatMessage } from "./ChatMessages";
import TypingIndicator from "./TypingIndicator";
import axios from "axios";
import popSound from "@/assets/sounds/pop.mp3";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

type ChatResponse = {
  message: ChatMessage;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.5;

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { chatThreadID } = useParams();

  useEffect(() => {
    const getChatHistory = async (chatThreadID: string | undefined) => {
      try {
        if (chatThreadID) {
          const response = await axios.get(`/api/chat/${chatThreadID}`);
          setMessages(response.data.chatHistory);
        } else {
          throw Error("Invalid chat to load.");
        }
      } catch (error) {
        console.error(error);
        setError("Could not load chat.");
      }
    };

    if (chatThreadID) getChatHistory(chatThreadID);
  }, [chatThreadID]);

  const onSubmit = async (formData: ChatFormData) => {
    try {
      setError("");

      const userMessage: ChatMessage = { role: "user", content: formData.prompt };
      setMessages((prev) => [...prev, userMessage]);

      popAudio.play();

      setIsLoading(true);

      const reqBody = {
        prompt: formData.prompt,
        chatThreadID: chatThreadID,
      };

      const response = await axios.post<ChatResponse>("/api/sendMessage", reqBody);

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
      <div className="w-px h-full bg-assistant-message"></div>
      <div className="flex-1 flex flex-col h-full p-4">
        <h1 className="text-xl text-message-color">EchoAI</h1>
        <div className="flex-1 flex flex-col gap-5 px-3 w-full self-center items-center overflow-y-auto custom-scroll">
          <div className="flex flex-col gap-5 w-[66%]">
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
