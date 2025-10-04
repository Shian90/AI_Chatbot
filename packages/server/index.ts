import express from "express";
import type { Request, Response } from "express";

const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("This is bun server on root endpoint!!");
});

app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "This is json." });
});

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});
