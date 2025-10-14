import chatRouter from "./routes/chatRoutes";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());
app.use(chatRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});
