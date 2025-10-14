import type { Request, Response } from "express";

import { chatService } from "./services/chat.service";
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
    const reply = await chatService.sendMessage(chatThreadId, prompt);

    res.json({ message: reply.content });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response." + error });
  }
});
