import type { Request, Response } from "express";

import { chatController } from "./controllers/chat.controller";
import dotenv from "dotenv";
import express from "express";

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

app.post("/api/chat", chatController.sendMessage);
