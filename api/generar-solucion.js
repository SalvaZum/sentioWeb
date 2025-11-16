import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configuración CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight request
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

    // Verificar API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY no configurada');
      return res.status(500).json({ 
        receta: 'Error: Configuración del servidor incompleta.' 
      });
    }

    // Inicializar Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Eres un asistente útil de la empresa Sentio.
      Responde esta pregunta sobre nuestro producto Sentio Desk: ${pregunta}

      Información sobre Sentio:
      - Empresa que innova en educación con tecnología
      - Producto principal: Sentio Desk (escritorio inteligente)
      - Características: pantalla táctil, sensores biométricos, mesa ajustable
      - Pulsera con sensores: frecuencia cardíaca, estrés, movimiento
      - Comunicación profesor-alumno integrada

      Responde de manera amable y enfocada en cómo Sentio puede ayudar.
    `;

    const result = await model.generateContent(prompt);
    const respuesta = result.response.text() || "No pude generar una respuesta en este momento.";

    return res.status(200).json({ receta: respuesta });

  } catch (error) {
    console.error('Error en la API:', error);
    
    return res.status(500).json({ 
      receta: 'Lo siento, hubo un error interno. Por favor, intenta más tarde.' 
    });
  }
}