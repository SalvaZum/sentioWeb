import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.status(200).send("ok");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Método no permitido" });
    return;
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta || typeof pregunta !== "string") {
      res.status(400).json({ error: "Falta 'pregunta' en el body" });
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: pregunta }]
        }
      ]
    });

    const respuesta =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No pudimos generar la respuesta";

    res.status(200).json({ respuesta });
  } catch (error) {
    console.error("ERROR API:", error);
    res.status(500).json({ error: "Error interno en la API" });
  }
}
