import { Button } from "../ui/button";
import { FaArrowUp } from "react-icons/fa";
import React from "react";
import { useForm } from "react-hook-form";

export type ChatFormData = {
  prompt: string;
};

type Props = {
  onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit: fnOnSubmit }: Props) => {
  const { handleSubmit, register, reset, formState } = useForm<ChatFormData>();

  const onSubmit = handleSubmit((data: ChatFormData) => {
    reset({ prompt: "" });
    fnOnSubmit(data);
  });

  const onEnterKeySubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={onSubmit}
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
  );
};

export default ChatInput;
