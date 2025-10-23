// Data access code

export type ChatMessage = {
  response_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

const MAX_HISTORY = 20;
let chatThreadToHistory = new Map<string, ChatMessage[]>();

class ChatHistoryRepository {
  getAllchatThreadIDs(): string[] {
    return [...chatThreadToHistory.keys()];
  }

  getChatHistory(chatThreadID: string): ChatMessage[] {
    let chatHistory: ChatMessage[] | undefined = chatThreadToHistory.get(chatThreadID);

    if (!chatHistory) {
      chatHistory = [];
      chatThreadToHistory.set(chatThreadID, chatHistory);
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
