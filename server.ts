import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON parsing with generous limits for base64 image uploads
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client lazily to prevent crash on startup if API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Weather API Route
app.get("/api/weather", async (req, res) => {
  const city = (req.query.city as string) || "Bengaluru";
  
  // High quality agricultural specific weather metrics
  const mockWeatherData: Record<string, any> = {
    "Bengaluru": { temp: 28, humidity: 62, condition: "Mostly Sunny", wind: 12, rainChance: "10%", soilMoisture: "45%", advisory: "Excellent weather for harvesting ragi and sowing pulses." },
    "Hubli": { temp: 32, humidity: 48, condition: "Clear Sky", wind: 15, rainChance: "5%", soilMoisture: "38%", advisory: "Good time for irrigation of cotton fields. Monitor for whitefly." },
    "Mysuru": { temp: 27, humidity: 68, condition: "Partly Cloudy", wind: 10, rainChance: "25%", soilMoisture: "52%", advisory: "Favorable conditions for sugarcane weeding. Apply bio-fertilizers." },
    "Shimoga": { temp: 26, humidity: 75, condition: "Light Rain", wind: 8, rainChance: "70%", soilMoisture: "65%", advisory: "Rain expected. Delay fertilizer application on paddy crops." },
    "Gulbarga": { temp: 36, humidity: 35, condition: "Hot and Dry", wind: 18, rainChance: "0%", soilMoisture: "28%", advisory: "Intense heat. Ensure adequate watering for pigeon pea/tur crop." },
    "Belagavi": { temp: 29, humidity: 55, condition: "Windy", wind: 22, rainChance: "15%", soilMoisture: "48%", advisory: "High winds. Staking suggested for vegetable crops and tall plants." },
  };

  const data = mockWeatherData[city] || {
    temp: 29,
    humidity: 55,
    condition: "Sunny",
    wind: 11,
    rainChance: "15%",
    soilMoisture: "42%",
    advisory: "Favorable farming conditions. Keep monitoring local soil dampness."
  };

  res.json({ city, ...data });
});

// 2. Crop Market Prices APMC Karnataka
app.get("/api/market-prices", (req, res) => {
  const apmcData = [
    { crop: "Paddy (Rice) / ಭತ್ತ", market: "Shimoga / ಶಿವಮೊಗ್ಗ", min: 1850, max: 2450, ragiAvg: 2200, unit: "Quintal", change: "+2%" },
    { crop: "Ragi (Finger Millet) / ರಾಗಿ", market: "Bengaluru / ಬೆಂಗಳೂರು", min: 3100, max: 3750, ragiAvg: 3450, unit: "Quintal", change: "+5%" },
    { crop: "Cotton (Kapas) / ಹತ್ತಿ", market: "Hubli / ಹುಬ್ಬಳ್ಳಿ", min: 6500, max: 7800, ragiAvg: 7200, unit: "Quintal", change: "-1%" },
    { crop: "Tur (Pigeon Pea) / ತೊಗರಿ", market: "Gulbarga / ಕಲ್ಬುರ್ಗಿ", min: 7200, max: 9100, ragiAvg: 8300, unit: "Quintal", change: "+4%" },
    { crop: "Maize (Corn) / ಮೆಕ್ಕೆಜೋಳ", market: "Davangere / ದಾವಣಗೆರೆ", min: 1950, max: 2350, ragiAvg: 2150, unit: "Quintal", change: "0%" },
    { crop: "Onion / ಈರುಳ್ಳಿ", market: "Chitradurga / ಚಿತ್ರದುರ್ಗ", min: 1500, max: 2800, ragiAvg: 2100, unit: "Quintal", change: "-12%" },
    { crop: "Jowar (Sorghum) / ಜೋಳ", market: "Bijapur / ವಿಜಯಪುರ", min: 2800, max: 3600, ragiAvg: 3200, unit: "Quintal", change: "+1%" },
    { crop: "Groundnut / ಕಡಲೇಕಾಯಿ", market: "Challakere / ಚಳ್ಳಕೆರೆ", min: 5800, max: 6900, ragiAvg: 6400, unit: "Quintal", change: "+3%" },
  ];
  res.json(apmcData);
});

// 3. AI Chatbot for Farming Guidance (with Kannada & English translation awareness)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are "Raitavarta AI", a friendly and highly knowledgeable smart agriculture expert chatbot assistant. 
Your target users are farmers in Karnataka, India. 
Always speak with immense respect, compassion, and practical agricultural wisdom.
Provide expert recommendations on crops, seeds, pests, diseases, irrigation, market strategies, governmental schemes, organic manure, and fertilizers.

Language rules:
- The user's active language setting is "${language || "English"}".
- If the language setting is "Kannada" (ಕನ್ನಡ), you MUST translate your response entirely into Kannada or reply in clear Kannada using Kannada script. Even if the query is in English, reply in Kannada to respect the user's choice.
- If the language is English, answer in English. You can sprinkle in occasional native terms (like "Ragi", "Thovar", etc.) where explanatory.
- Make answers highly readable, structured, with bullet points. Keep advice practical, budget-friendly and ecologically sustainable (organic options should be prioritized).`;

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Start a chat sessions with guidelines
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      history: chatHistory
    });

    const response = await chat.sendMessage({ message });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    res.status(500).json({ error: "Failed to obtain AI farm response.", details: error.message });
  }
});

// 4. Crop Disease Detection using custom prompt with uploaded image
app.post("/api/disease-detect", async (req, res) => {
  try {
    const { imageBase64, mimeType, language } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Image data is required." });
    }

    const ai = getGeminiClient();
    
    const diagnosisPrompt = `Analyze this crop image as an expert agricultural phytopathologist. 
1. Determine the likely Crop name, and name of the Disease or pest infestation.
2. Outline the Severity estimate (High, Medium, Low).
3. Provide a clear Explanation of the symptoms.
4. Give actionable Organic/Chemical Remedies first (favor organic/biological solutions).
5. Suggest physical Prevention methods for the next crop cycle.

Language requirements:
- The selected language is "${language || "English"}".
- If language is "Kannada" (ಕನ್ನಡ), please write all fields in clear, legible Kannada.
- Return the response as raw markdown text with clear headings, bold texts, and bullet points. Maintain a reassuring, supportive tone.`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64
      }
    };

    const textPart = {
      text: diagnosisPrompt
    };

    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [imagePart, textPart]
      }
    });

    res.json({ analysis: result.text });
  } catch (error: any) {
    console.error("Error in Crop Disease Analysis:", error);
    res.status(500).json({ error: "Failed to analyze crop health.", details: error.message });
  }
});

// Mount Vite middleware in development vs serving static files in production
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failure starting Raitavarta Express + Vite Server:", err);
});
