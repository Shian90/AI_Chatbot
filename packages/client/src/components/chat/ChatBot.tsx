import React, { useRef, useState } from "react";

import { Button } from "../ui/button";
import type { ChatMessage } from "./ChatMessages";
import ChatMessages from "./ChatMessages";
import { FaArrowUp } from "react-icons/fa";
import TypingIndicator from "./TypingIndicator";
import axios from "axios";
import { useForm } from "react-hook-form";

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: ChatMessage;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const chatThreadId = useRef(crypto.randomUUID());

  const { handleSubmit, register, reset, formState } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    try {
      reset({ prompt: "" });
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

  const onEnterKeySubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 mb-10 overflow-y-auto">
        <ChatMessages messages={messages} />
        {isLoading && <TypingIndicator />}
        {error && <p className="text-red-500 p-4">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onEnterKeySubmit}
        className="flex flex-col border-2 border-gray-400 items-end p-4 rounded-3xl">
        <textarea
          {...register("prompt", { required: true, validate: (data) => data.trim().length > 0 })}
          className="w-full resize-none focus:outline-0 text-white"
          autoFocus
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} type="submit" variant="outline" size="icon" className="rounded-full">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
