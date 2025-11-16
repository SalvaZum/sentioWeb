import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configuración CORS simple pero efectiva
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta) {
      return res.status(400).json({ error: 'Falta la pregunta' });
    }

    // Verificar API key de manera más robusta
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('GEMINI_API_KEY:', apiKey ? '✅ Configurada' : '❌ No configurada');
      return res.status(500).json({ 
        receta: 'Error: Configuración del servidor incompleta. Por favor, contacta al administrador.' 
      });
    }

    // Inicializar Gemini con timeout
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 500, // Limitar respuesta para ser más rápido
        temperature: 0.7,
      }
    });

    const prompt = `Como asistente de Sentio, responde brevemente (máximo 300 palabras) esta pregunta: "${pregunta}"

Información sobre Sentio:
- Escritorio inteligente para educación
- Pantalla táctil, sensores biométricos
- Mesa ajustable, comunicación profesor-alumno
- Pulsera con sensores de frecuencia cardíaca

Responde de manera útil y concisa.`;

    const result = await model.generateContent(prompt);
    const respuesta = result.response.text();

    return res.status(200).json({ receta: respuesta });

  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      stack: error.stack,
      env: process.env.GEMINI_API_KEY ? 'API_KEY presente' : 'API_KEY faltante'
    });

    return res.status(500).json({ 
      receta: `Error temporal: ${error.message}. Por favor, intenta nuevamente o contacta a sentioarg@gmail.com para ayuda inmediata.` 
    });
  }
}