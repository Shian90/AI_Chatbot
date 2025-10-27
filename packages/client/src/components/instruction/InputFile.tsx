import { Button } from "../ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const InputFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const handleUpload = async () => {
    if (!file) {
      navigate("/chat");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/instructions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Server response:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      navigate("/chat");
    }
  };

  return (
    <div className="h-screen flex flex-col gap-4 items-center justify-center">
      <h1 className="text-control-color font-bold text-4xl">EchoAI</h1>
      <h2 className="text-message-color font-bold text-2xl">
        Provide custom rules to shape your chatbot’s personality (optional)
      </h2>
      <input
        accept=".md"
        className="text-message-color file:mr-3 file:py-2 file:px-4 
                   file:rounded-md file:text-sm file:font-semibold 
                   file:bg-control-color file:text-background hover:file:bg-control-hover-color"
        type="file"
        onChange={handleFileChange}
      />
      <Button
        onClick={handleUpload}
        className="bg-control-color hover:bg-control-hover-color text-background px-3 py-1 rounded-md">
        Continue
      </Button>
    </div>
  );
};

export default InputFile;
