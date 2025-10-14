// Route definitions

import { chatController } from "../controllers/chat.controller";
import express from "express";

const chatRouter = express.Router();

chatRouter.get("/", () => {});

chatRouter.post("/api/chat", chatController.sendMessage);

export default chatRouter;
