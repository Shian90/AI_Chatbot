import fs from "fs";
import path from "path";
import template from "../uploads/instructions/prompts.txt";

class InstructionsService {
  readInstructions(): string {
    const filePath = path.join(__dirname, "..", "uploads", "instructions", "instructions.md");
    if (!fs.existsSync(filePath)) return "";

    const instructions = fs.readFileSync(filePath, "utf-8");

    return template.replace("{{instructions}}", instructions);
  }
}

export const instructionsService = new InstructionsService();
