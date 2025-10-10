import express from "express";
import type { Request, Response } from "express";
import { pipeline, TextStreamer } from "@huggingface/transformers";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("This is bun server on root endpoint!!");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "This is json from backend." });
});

app.post("/api/chat", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  // Create a text generation pipeline
  const generator = await pipeline(
    "text-generation",
    "onnx-community/Qwen2.5-Coder-0.5B-Instruct",
    { dtype: "fp32" }
  );

  // Define the list of messages
  const messages = [
    {
      role: "user",
      content: prompt,
    },
  ];

  // Create text streamer
  const streamer = new TextStreamer(generator.tokenizer, {
    skip_prompt: false,
    // Optionally, do something with the text (e.g., write to a textbox)
    // callback_function: (text) => { /* Do something with text */ },
  });

  // Generate a response
  const result = await generator(messages, {
    max_new_tokens: 512,
    temperature: 0.2,
    do_sample: false,
  });

  res.json({ message: result });
});

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});
