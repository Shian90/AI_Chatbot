import OpenAI from "openai";
import { chatHistoryRepository, type ChatMessage } from "../repositories/chat.repository";

const client: OpenAI = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

class ChatService {
  async sendMessage(chatThreadId: string, prompt: string): Promise<ChatMessage> {
    chatHistoryRepository.addChatMessageToHistory(chatThreadId, {
      role: "user",
      content: prompt,
    });

    const response: OpenAI.Chat.Completions.ChatCompletion = await client.chat.completions.create({
      model: "google/gemma-2-2b-it",
      messages: chatHistoryRepository.getChatHistory(chatThreadId),
      max_tokens: 100,
    });

    const modelReplyMessage: ChatMessage = {
      response_id: response.id,
      role: response.choices[0]?.message.role ?? "assistant",
      content: response.choices[0]?.message.content ?? "",
    };

    chatHistoryRepository.addChatMessageToHistory(chatThreadId, modelReplyMessage);

    return modelReplyMessage;
  }
}

export const chatService = new ChatService();
