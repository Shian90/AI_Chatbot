// Application logic code

import OpenAI from "openai";
import { chatHistoryRepository, type ChatMessage, type ChatThread } from "../repositories/chat.repository";

const client: OpenAI = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

class ChatService {
  async sendMessage(chatThreadID: string, prompt: string): Promise<ChatMessage> {
    chatHistoryRepository.addChatMessageToHistory(chatThreadID, {
      role: "user",
      content: prompt,
    });

    const response: OpenAI.Chat.Completions.ChatCompletion = await client.chat.completions.create({
      model: "google/gemma-2-2b-it",
      messages: chatHistoryRepository.getChatHistory(chatThreadID),
    });

    const modelReplyMessage: ChatMessage = {
      response_id: response.id,
      role: response.choices[0]?.message.role ?? "assistant",
      content: response.choices[0]?.message.content ?? "",
    };

    chatHistoryRepository.addChatMessageToHistory(chatThreadID, modelReplyMessage);

    return modelReplyMessage;
  }

  async getAllchatThreadIDs(): Promise<ChatThread[]> {
    return await chatHistoryRepository.getAllchatThreadIDs();
  }

  async getChatHistory(chatThreadID: string): Promise<ChatMessage[]> {
    return await chatHistoryRepository.getChatHistory(chatThreadID);
  }
}

export const chatService = new ChatService();
