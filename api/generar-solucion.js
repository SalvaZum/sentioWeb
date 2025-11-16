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

    console.log('📥 Pregunta recibida:', pregunta);

    if (!pregunta || pregunta.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Pregunta vacía',
        receta: 'Por favor, escribe tu pregunta para que pueda ayudarte.'
      });
    }

    // Verificar API key con más detalle
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('🔑 Estado API Key:', apiKey ? '✅ Configurada' : '❌ Faltante');
    
    if (!apiKey) {
      return res.status(500).json({ 
        receta: 'Error de configuración del servidor. Por favor, contacta al administrador en sentioarg@gmail.com.' 
      });
    }

    // Inicializar Gemini con timeout
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
      }
    });

    const prompt = `Eres un asistente especializado de Sentio, una empresa que desarrolla el Sentio Desk - un escritorio inteligente para educación.

Responde esta pregunta del usuario de manera clara y útil: "${pregunta}"

Información sobre Sentio:
- Producto: Sentio Desk (escritorio inteligente)
- Características principales: pantalla táctil integrada, sensores biométricos, mesa ajustable ergonómica
- Tecnología: Raspberry Pi, ESP32, sensores MAX30102 (frecuencia cardíaca), MPU6050 (movimiento)
- Beneficios: mejora la educación, monitorea bienestar estudiantil, comunicación profesor-alumno
- Contacto: sentioarg@gmail.com, Córdoba, Argentina

Responde de manera amigable, profesional y útil. Si la pregunta no está relacionada con Sentio, sugiere amablemente contactar al equipo. Máximo 400 palabras.`;

    console.log('🚀 Enviando solicitud a Gemini...');
    
    const result = await model.generateContent(prompt);
    const respuesta = result.response.text();

    console.log('✅ Respuesta generada exitosamente');
    
    return res.status(200).json({ 
      receta: respuesta,
      status: 'success'
    });

  } catch (error) {
    console.error('❌ Error detallado en la API:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    // Mensajes de error más específicos
    let mensajeError = 'Error temporal del servicio. Por favor, intenta nuevamente.';
    
    if (error.message.includes('API_KEY') || error.message.includes('key')) {
      mensajeError = 'Error de configuración de la API. Contacta a sentioarg@gmail.com.';
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      mensajeError = 'Límite temporal excedido. Por favor, intenta en unos minutos.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      mensajeError = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
    }

    return res.status(500).json({ 
      receta: `${mensajeError} Si el problema persiste, contacta a sentioarg@gmail.com.`,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}