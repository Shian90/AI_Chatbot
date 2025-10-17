import { useRef, useState } from "react";

import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { useForm } from "react-hook-form";

type FormData = {
  prompt: string;
};

type ChatMessage = {
  response_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatResponse = {
  message: ChatMessage;
};

const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const chatThreadId = useRef(crypto.randomUUID());

  const { handleSubmit, register, reset, formState } = useForm<FormData>();

  const onSubmit = async (formData: FormData) => {
    reset();

    const userMessage: ChatMessage = { role: "user", content: formData.prompt };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsLoading(true);
      const reqBody = {
        prompt: formData.prompt,
        chatThreadId: chatThreadId.current,
      };

      const response = await axios.post<ChatResponse>("/api/chat", reqBody);

      setMessages((prev) => [...prev, response.data.message]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onEnterKeySubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-8 mb-10">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`bg-[#477070e2] text-white rounded-3xl px-4 py-2  ${
              message.role === "user" ? "self-end border-2 border-gray-600" : " border-0 border-gray-600 self-start"
            }`}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
        {isLoading && (
          <div className="flex text-gray-400 px-4 py-2 items-end">
            Thinking
            <div className="w-1 h-1 rounded-3xl bg-gray-400 animate-pulse"></div>
            <div className="w-1 h-1 rounded-3xl bg-gray-400 animate-pulse [animation-delay: 0.2s]"></div>
            <div className="w-1 h-1 rounded-3xl bg-gray-400 animate-pulse [animation-delay: 0.4s]"></div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onEnterKeySubmit}
        className="flex flex-col border-2 border-gray-400 items-end p-4 rounded-3xl">
        <textarea
          {...register("prompt", { required: true, validate: (data) => data.trim().length > 0 })}
          className="w-full resize-none focus:outline-0 text-white"
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
