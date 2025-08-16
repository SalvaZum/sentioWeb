import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: "Falta la pregunta" });
  }

  try {
    // Inicializa Gemini con la API Key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Genera contenido a partir de la pregunta del usuario
    const result = await model.generateContent(`
      Eres un asistente útil.
      Responde la siguiente pregunta del usuario:
      ${pregunta}
    `);

    const receta = result.response.text() || "Sin respuesta";

    // Devuelve la respuesta al frontend
    res.status(200).json({ receta });

  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    res.status(500).json({ error: "Error llamando a Gemini" });
  }
}