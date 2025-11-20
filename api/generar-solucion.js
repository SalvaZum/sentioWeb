export default async function handler(req, res) {
  const models = await genAI.listModels();
console.log(models);

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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: pregunta }] }]
        })
      }
    );

    const data = await response.json();

    // MUESTRA LA RESPUESTA COMPLETA EN VERCEL LOGS
    console.log("RAW GOOGLE RESPONSE:", JSON.stringify(data, null, 2));

    // Sacar texto de todos los formatos posibles
    const respuesta =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.text ||
      data?.output_text ||
      data?.contents?.[0]?.parts?.[0]?.text ||
      "No pude generar respuesta";

    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Error interno en la API" });
  }
}
