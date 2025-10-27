// Data access code

import { instructionsService } from "../services/instructions.service";

export type ChatMessage = {
  response_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

export type ChatThread = {
  chatThreadID: string;
  title: string;
};

const MAX_HISTORY = 20;

class ChatHistoryRepository {
  private chatThreadToHistory: Map<string, ChatMessage[]>;

  constructor() {
    this.chatThreadToHistory = new Map<string, ChatMessage[]>();
  }

  getAllChatThreadIDs(): ChatThread[] {
    const chatThreads: ChatThread[] = [];
    this.chatThreadToHistory.forEach((messages: ChatMessage[], chatThreadID: string) => {
      chatThreads.push({ chatThreadID: chatThreadID, title: messages[0]?.content.trim().replace(".", "") ?? "" });
    });

    return chatThreads;
  }

  getChatHistory(chatThreadID: string): ChatMessage[] {
    let chatHistory: ChatMessage[] | undefined = this.chatThreadToHistory.get(chatThreadID);

    if (!chatHistory) {
      const isEmptyHistoryExists =
        this.chatThreadToHistory.values().find((chatHistory: ChatMessage[]) => chatHistory.length == 0) !== undefined;
      chatHistory = [];
      if (!isEmptyHistoryExists) {
        this.chatThreadToHistory.set(chatThreadID, chatHistory);
      }
    }

    return chatHistory;
  }

  addChatMessageToHistory(chatThreadID: string, chatMessage: ChatMessage): void {
    let chatHistory: ChatMessage[] = this.getChatHistory(chatThreadID);

    chatHistory.push(chatMessage);

    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
    }
  }
}

export const chatHistoryRepository = new ChatHistoryRepository();
