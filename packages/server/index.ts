import chatRouter from "./routes/chatRoutes";
import dotenv from "dotenv";
import express from "express";
import fileUploadRouter from "./routes/fileUploadRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(chatRouter);
app.use(fileUploadRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`);
});
