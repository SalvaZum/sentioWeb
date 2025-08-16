import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: "Falta la pregunta" });
  }

  console.log("Pregunta recibida:", pregunta);

  try {
    // Llamada a Gemini API
    const respuesta = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gemini-1.5-flash",
          prompt: pregunta,
          maxOutputTokens: 500,
        }),
      }
    );

    const data = await respuesta.json();
    console.log("Respuesta de Gemini:", data);

    // Ajusta según la estructura de la respuesta
    const receta = data.candidates?.[0]?.content || "Sin respuesta";

    res.status(200).json({ receta });
  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    res.status(500).json({ error: "Error llamando a Gemini" });
  }
}



