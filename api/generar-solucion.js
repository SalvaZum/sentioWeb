import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    return res.status(200).send("ok");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta || typeof pregunta !== "string") {
      return res.status(400).json({ error: "Falta 'pregunta' en el body" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key no configurada" });
    }

    // Usar API v1 (CORRECTO)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-flash",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: pregunta }] }],
    });

    const respuesta = result.response.text();

    return res.status(200).json({ respuesta });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Error interno en la API" });
  }
}
