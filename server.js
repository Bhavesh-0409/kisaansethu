import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// This log will now check if your key is a placeholder
if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_NEW_API_KEY_HERE") {
  console.error("Missing ❌ GEMINI_API_KEY in .env file, or it's still a placeholder!");
} else {
  console.log("Gemini API Key: Loaded ✅");
}

app.post("/api/crop-advice", async (req, res) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "PASTE_YOUR_NEW_API_KEY_HERE") {
    return res.status(500).json({ error: "Server is missing a valid API key" });
  }

  try {
    const { prompt } = req.body;

    // This is the correct, modern model name
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      // This will log the error from Google
      const errorData = await response.json();
      console.error("Gemini API error response:", errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini API response (Success):", data);
    res.json(data);
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Failed to get crop advice" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);

