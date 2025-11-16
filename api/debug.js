export default async function handler(req, res) {
  return res.status(200).json({
    message: "API funcionando",
    timestamp: new Date().toISOString(),
    env: {
      geminiKey: process.env.GEMINI_API_KEY ? "✅ Configurada" : "❌ Faltante"
    }
  });
}