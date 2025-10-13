import type { Request, Response } from "express";

import OpenAI from "openai";
import { chatHistoryRepository, type ChatMessage } from "./repositories/chat.repository";
import dotenv from "dotenv";
import express from "express";
import z from "zod";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("This is bun server on root endpoint!!");
});

const client: OpenAI = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

const remoteModelChat = async (chatThreadId: string, prompt: string) => {
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

  return modelReplyMessage.content;
};

const chatReqSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required.").max(1000, "Prompt is too long! (Max 1000 characters)."),
  chatThreadId: z.uuid(),
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const parsedReqBody = chatReqSchema.safeParse(req.body);
  if (!parsedReqBody.success) {
    res.status(400).json(z.treeifyError(parsedReqBody.error));
    return;
  }

  try {
    const { prompt, chatThreadId } = req.body;
    const reply = await remoteModelChat(chatThreadId, prompt);

    res.json({ message: reply });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response." });
  }
});
