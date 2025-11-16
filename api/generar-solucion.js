import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Configuración CORS más robusta
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método no permitido',
      receta: 'Por favor, usa el formulario en la página para hacer tu pregunta.'
    });
  }

  try {
    const { pregunta } = req.body;

    if (!pregunta || pregunta.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Pregunta vacía',
        receta: 'Por favor, escribe tu pregunta para que pueda ayudarte.'
      });
    }

    // Verificar API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY no configurada');
      return res.status(500).json({ 
        receta: 'Estamos mejorando nuestro servicio de IA. Mientras tanto, puedes contactarnos directamente en sentioarg@gmail.com para cualquier consulta.' 
      });
    }

    // Inicializar Gemini con configuración optimizada
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
        topP: 0.8,
      }
    });

    const prompt = `Eres un asistente especializado de Sentio, una empresa que desarrolla el Sentio Desk - un escritorio inteligente para educación.

Responde esta pregunta del usuario: "${pregunta}"

Información clave sobre Sentio:
- Producto: Sentio Desk (escritorio inteligente)
- Características: pantalla táctil, sensores biométricos, mesa ajustable
- Tecnología: Raspberry Pi, ESP32, sensores de frecuencia cardíaca y movimiento
- Beneficios: mejora la educación, monitorea bienestar, comunicación profesor-alumno
- Contacto: sentioarg@gmail.com, Córdoba, Argentina

Responde de manera útil, amigable y profesional. Si no sabes algo específico, sugiere contactar al equipo. Máximo 400 palabras.`;

    const result = await model.generateContent(prompt);
    const respuesta = result.response.text();

    console.log('✅ Respuesta generada exitosamente');
    return res.status(200).json({ 
      receta: respuesta,
      status: 'success'
    });

  } catch (error) {
    console.error('❌ Error en la API:', {
      message: error.message,
      stack: error.stack
    });

    return res.status(500).json({ 
      receta: `Lo siento, estoy teniendo dificultades técnicas momentáneas. Por favor, intenta nuevamente en unos segundos o contacta a nuestro equipo en sentioarg@gmail.com para ayuda inmediata.`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}