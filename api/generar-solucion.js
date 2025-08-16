import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta la pregunta' });
  }

  try {
    const respuesta = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'Eres un asistente útil.' },
          { role: 'user', content: pregunta },
        ],
      }),
    });

    const data = await respuesta.json();

    console.log('Respuesta de Gemini:', data);

    const receta = data.choices?.[0]?.message?.content || 'Sin respuesta';

    res.status(200).json({ receta });
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    res.status(500).json({ error: 'Error llamando a Gemini' });
  }
}
