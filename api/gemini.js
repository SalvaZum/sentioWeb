export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const respuesta = await fetch("https://api.gemini.com/v1/...", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    const data = await respuesta.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Error llamando a Gemini" });
  }
}
