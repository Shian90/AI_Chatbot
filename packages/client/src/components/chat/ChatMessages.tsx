import React, { useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";

export type ChatMessage = {
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
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`text-message-color px-3 py-2 ${
            message.role === "user"
              ? "bg-user-message max-w-[66%] self-end rounded-3xl"
              : "bg-assistant-message w-full self-start rounded-xl"
          } ${index == messages.length - 1 ? "mb-5" : "mb-0"}`}>
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
