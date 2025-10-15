import { Button } from "./ui/button";
import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";

type FormData = {
  prompt: string;
};

const ChatBot = () => {
  const { handleSubmit, register, reset, formState } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    reset();
  };

  const onEnterKeySubmit = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
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
  );
};

export default ChatBot;
