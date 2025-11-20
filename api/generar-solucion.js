import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: "Falta 'pregunta'" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key no configurada" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // ✔ CORRECTO
    });

    const result = await model.generateContent(pregunta);
    const respuesta = result.response.text();

    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Error interno en la API" });
  }
}
