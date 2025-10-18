import React, { useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";

export type ChatMessage = {
  response_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

type Props = {
  messages: ChatMessage[];
};

const ChatMessages = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selectedMessage = window.getSelection()?.toString().trim();
    if (selectedMessage) {
      e.preventDefault();
      e.clipboardData.setData("text/plain", selectedMessage);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`bg-[#1b567592] text-white rounded-3xl px-3 py-2 ${
            message.role === "user" ? "self-end" : "self-start"
          }`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
