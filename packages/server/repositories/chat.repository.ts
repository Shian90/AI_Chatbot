// Data access code

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
let chatThreadToHistory = new Map<string, ChatMessage[]>();

class ChatHistoryRepository {
  getAllchatThreadIDs(): ChatThread[] {
    const chatThreads: ChatThread[] = [];
    chatThreadToHistory.forEach((messages: ChatMessage[], chatThreadID: string) => {
      chatThreads.push({ chatThreadID: chatThreadID, title: messages[0]?.content.trim().replace(".", "") ?? "" });
    });

    return chatThreads;
  }

  getChatHistory(chatThreadID: string): ChatMessage[] {
    let chatHistory: ChatMessage[] | undefined = chatThreadToHistory.get(chatThreadID);

    if (!chatHistory) {
      const isEmptyHistoryExists =
        chatThreadToHistory.values().find((chatHistory: ChatMessage[]) => chatHistory.length == 0) !== undefined;
      chatHistory = [];
      if (!isEmptyHistoryExists) {
        chatThreadToHistory.set(chatThreadID, chatHistory);
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
