import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configuración CORS más robusta
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:5500',
    'https://sentio-web.vercel.app',
    'https://sentio-web.vercel.app'
  ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // En producción, permite solo tu dominio
    res.setHeader('Access-Control-Allow-Origin', 'https://sentio-web.vercel.app');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: 'Falta la pregunta' });
  }

  try {
    // Verificar que la API key esté disponible
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY no está configurada');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Eres un asistente útil de la empresa Sentio.
      Responde la siguiente pregunta del usuario de manera concisa y útil:
      
      Pregunta: ${pregunta}
      
      Información sobre Sentio:
      - Empresa que innova en educación con tecnología
      - Producto principal: Sentio Desk (escritorio inteligente)
      - Características: pantalla táctil, sensores biométricos, mesa ajustable
      - Pulsera con sensores: frecuencia cardíaca, estrés, movimiento
      - Comunicación profesor-alumno integrada
      
      Responde de manera amable y enfocada en cómo Sentio puede ayudar.
    `;

    const result = await model.generateContent(prompt);
    const respuesta = result.response.text() || "Lo siento, no pude generar una respuesta en este momento.";

    res.status(200).json({ receta: respuesta });

  } catch (error) {
    console.error('Error en la API:', error);
    
    // Respuesta de error más informativa
    let errorMessage = 'Error interno del servidor';
    
    if (error.message.includes('GEMINI_API_KEY')) {
      errorMessage = 'Error de configuración: GEMINI_API_KEY no encontrada';
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      errorMessage = 'Límite de la API excedido. Intenta más tarde.';
    }
    
    res.status(500).json({ 
      receta: `Lo siento, hubo un error: ${errorMessage}` 
    });
  }
}