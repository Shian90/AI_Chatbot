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
      className="sticky flex flex-col border-2 border-message-color items-end p-4 rounded-3xl w-[66%] self-center">
      <textarea
        {...register("prompt", { required: true, validate: (data) => data.trim().length > 0 })}
        className="w-full resize-none focus:outline-0 text-message-color custom-scroll"
        autoFocus
        placeholder="Ask anything"
        maxLength={1000}
      />
      <Button
        disabled={!formState.isValid}
        type="submit"
        size="icon"
        className="bg-control-color hover:bg-control-hover-color rounded-full">
        <FaArrowUp color="#1e2739" />
      </Button>
    </form>
  );
};

export default ChatInput;
