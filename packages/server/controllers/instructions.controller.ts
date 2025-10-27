import type { Request, Response } from "express";

class InstructionsController {
  uploadInstrucitonsFile(req: Request, res: Response) {
    console.log("Uploaded file info:", req.file);

    res.status(201).json({ message: "File uploaded successfully!", file: req.file });
  }
}

export const instructionsController = new InstructionsController();
