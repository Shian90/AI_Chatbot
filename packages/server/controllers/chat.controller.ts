// Gateway to different services

import type { Request, Response } from "express";

import type { ChatMessage } from "../repositories/chat.repository";
import { chatService } from "../services/chat.service";
import z from "zod";

const chatReqSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required.").max(1000, "Prompt is too long! (Max 1000 characters)."),
  chatThreadID: z.uuid(),
});

class ChatController {
  async sendMessage(req: Request, res: Response) {
    // Validate the incoming request body.
    const parsedReqBody = chatReqSchema.safeParse(req.body);
    if (!parsedReqBody.success) {
      res.status(400).json(z.treeifyError(parsedReqBody.error));
      return;
    }

    try {
      const { prompt, chatThreadID } = req.body;
      const reply = await chatService.sendMessage(chatThreadID, prompt);

      res.json({ message: reply });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate response. " + error });
    }
  }

  async getAllchatThreadIDs(req: Request, res: Response) {
    try {
      const allchatThreadIDs: string[] = await chatService.getAllchatThreadIDs();
      res.json({ chatThreadIDs: allchatThreadIDs });
    } catch (error) {
      res.status(500).json({ error: "Failed to load chats. " + error });
    }
  }

  async getChatHistory(req: Request, res: Response) {
    try {
      const chatThreadID = req.params.id ?? "";

      if (chatThreadID === "") {
        res.status(400).json({ error: "Bad request." });
      } else {
        const chatHistory: ChatMessage[] = await chatService.getChatHistory(chatThreadID);

        res.json({ chatHistory: chatHistory });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to load chat. " + error });
    }
  }
}

export const chatController = new ChatController();
