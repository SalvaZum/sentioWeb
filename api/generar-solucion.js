export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { pregunta } = req.body;

  try {
    const respuesta = await fetch("https://api.gemini.com/v1/...", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt: pregunta }) // lo que recibe Gemini
    });

    const data = await respuesta.json();
    res.status(200).json({ receta: data.response?.text || "Sin respuesta" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error llamando a Gemini" });
  }
}
