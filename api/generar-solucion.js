import fetch from "node-fetch"; // necesario si usas Node 18 o anterior en Vercel

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: "Falta la pregunta" });
  }

  try {
    const respuesta = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt: pregunta })
    });

    const data = await respuesta.json();

    console.log("Respuesta completa de Gemini:", data); // <--- ver en logs de Vercel

    // Ajustar según la estructura real de Gemini
    const receta = data.text || data.output_text || "Sin respuesta";

    res.status(200).json({ receta });

  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    res.status(500).json({ error: "Error llamando a Gemini" });
  }
}



