import fetch from "node-fetch";

async function listarModelos() {
  const API_KEY = process.env.GOOGLE_API_KEY;

  if (!API_KEY) {
    console.error("❌ Falta GOOGLE_API_KEY");
    return;
  }

  console.log("⏳ Consultando modelos disponibles...\n");

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error("❌ Error:", data.error);
      return;
    }

    console.log("📌 Modelos disponibles:\n");
    data.models.forEach((m) => console.log(`- ${m.name}`));

  } catch (err) {
    console.error("❌ Error de red:", err);
  }
}

listarModelos();
