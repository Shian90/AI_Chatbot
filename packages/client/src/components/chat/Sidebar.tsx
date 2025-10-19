import { Button } from "../ui/button";
import { useState } from "react";

type Props = {
  title: string;
};

const Sidebar = ({ title }: Props) => {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex flex-col gap-2 p-2 w-[15%] bg-sidebar-primary overflow-y-auto custom-scroll">
      <Button className="hover:bg-button-hover bg-user-message text-md text-message-color my-2">New Chat</Button>
      <hr className="border-assistant-message border-1"></hr>
      <div
        onClick={() => setSelected(!selected)}
        className={`${
          selected ? "bg-select-item hover:bg-none" : "bg-none hover:bg-assistant-message"
        } px-3 py-2 text-md text-message-color rounded-lg`}>
        {title}
      </div>
    </div>
  );
};

export default Sidebar;
