import type { Request, Response } from "express";

import { chatService } from "../services/chat.service";
import z from "zod";

const chatReqSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt is required.").max(1000, "Prompt is too long! (Max 1000 characters)."),
  chatThreadId: z.uuid(),
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
      const { prompt, chatThreadId } = req.body;
      const reply = await chatService.sendMessage(chatThreadId, prompt);

      res.json({ message: reply.content });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate response." + error });
    }
  }
}

export const chatController = new ChatController();
