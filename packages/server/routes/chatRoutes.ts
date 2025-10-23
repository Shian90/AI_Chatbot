// Route definitions

import { chatController } from "../controllers/chat.controller";
import express from "express";

const chatRouter = express.Router();

chatRouter.get("/", () => {});

chatRouter.post("/api/sendMessage", chatController.sendMessage);
chatRouter.get("/api/chat", chatController.getAllchatThreadIDs);
chatRouter.get("/api/chat/:id", chatController.getChatHistory);

export default chatRouter;
