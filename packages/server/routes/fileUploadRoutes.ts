// Route definitions

import express from "express";
import { instructionsController } from "../controllers/instructions.controller";
import multer from "multer";

const fileUploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/instructions/",
  filename: (req, file, cb) => {
    cb(null, "instructions.md");
  },
});

const upload = multer({ storage });

fileUploadRouter.post("/api/instructions", upload.single("file"), instructionsController.uploadInstrucitonsFile);

export default fileUploadRouter;
