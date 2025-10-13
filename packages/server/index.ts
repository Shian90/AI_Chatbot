import type { Request, Response } from "express";

import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import z from "zod";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("This is bun server on root endpoint!!");
});

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});

interface ChatMessage {
  response_id?: string;
  role: "system" | "user" | "assistant";
  content: string;
}

const MAX_HISTORY = 20;
let chatThreadToHistory = new Map<string, ChatMessage[]>();

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

const remoteModelChat = async (chatThreadId: string, prompt: string) => {
  let chatHistory: ChatMessage[] | undefined =
    chatThreadToHistory.get(chatThreadId);

  if (!chatHistory) {
    chatHistory = [];
    chatThreadToHistory.set(chatThreadId, chatHistory);
  }

  chatHistory.push({ role: "user", content: prompt });

  const response = await client.chat.completions.create({
    model: "google/gemma-2-2b-it",
    messages: chatHistory,
    max_tokens: 50,
  });

  const reply: ChatMessage = {
    response_id: response.id,
    role: response.choices[0].message.role,
    content: response.choices[0].message.content,
  };

  chatHistory.push(reply);

  if (chatHistory.length > MAX_HISTORY) {
    chatHistory.splice(0, chatHistory.length - MAX_HISTORY);
  }

  return reply.content;
};

const chatReqSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required.")
    .max(1000, "Prompt is too long! (Max 1000 characters)."),
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
