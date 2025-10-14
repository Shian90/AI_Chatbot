// Data access code

export type ChatMessage = {
  response_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
};

const MAX_HISTORY = 20;
let chatThreadToHistory = new Map<string, ChatMessage[]>();

class ChatHistoryRepository {
  getChatHistory(chatThreadId: string): ChatMessage[] {
    let chatHistory: ChatMessage[] | undefined = chatThreadToHistory.get(chatThreadId);

    if (!chatHistory) {
      chatHistory = [];
      chatThreadToHistory.set(chatThreadId, chatHistory);
    }

    return chatHistory;
  }

  addChatMessageToHistory(chatThreadId: string, chatMessage: ChatMessage): void {
    let chatHistory: ChatMessage[] = this.getChatHistory(chatThreadId);

    chatHistory.push(chatMessage);

    if (chatHistory.length > MAX_HISTORY) {
      chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
    }
  }
}

export const chatHistoryRepository = new ChatHistoryRepository();
