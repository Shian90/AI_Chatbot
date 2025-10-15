import { useRef, useState } from "react";

import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
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
  const [messages, setMessages] = useState<string[]>([]);
  const chatThreadId = useRef(crypto.randomUUID());

  const { handleSubmit, register, reset, formState } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    reset();

    setMessages((prev) => [...prev, data.prompt]);

    try {
      const reqBody = {
        prompt: data.prompt,
        chatThreadId: chatThreadId.current,
      };

      const response = await axios.post<ChatResponse>("/api/chat", reqBody);

      console.log(response.data.message.content);

      setMessages((prev) => [...prev, response.data.message.content]);
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
      <div>
        {messages.map((message, index) => (
          <p key={index} className="text-white">
            {message}
          </p>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onEnterKeySubmit}
        className="flex flex-col border-2 items-end p-4 rounded-3xl">
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
