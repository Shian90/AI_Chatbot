import "highlight.js/styles/night-owl.min.css";

import React, { useEffect, useRef } from "react";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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
          className={` text-message-color px-3 py-2 ${
            message.role === "user"
              ? "bg-user-message max-w-[66%] self-end rounded-xl"
              : "prose prose-md prose-headings:text-xl prose-code:rounded-xs prose-code:p-0.5 max-w-none"
          } ${index == messages.length - 1 ? "mb-5" : "mb-0"}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre({ node, children, ...props }) {
                const codeChild = React.Children.toArray(children)[0] as React.ReactElement;
                const isHLJS = codeChild?.props?.className?.includes("hljs");
                const bgStyle = isHLJS ? codeChild?.props?.className || "bg-transparent" : "var(--tw-prose-pre-bg)";

                return (
                  <pre {...props} className={`overflow-x-auto rounded-xl ${bgStyle}`}>
                    {children}
                  </pre>
                );
              },
            }}>
            {message.content}
          </ReactMarkdown>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
