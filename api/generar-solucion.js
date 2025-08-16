import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config(); // Carga las variables de entorno

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { pregunta } = req.body;

  if (!pregunta) {
    return res.status(400).json({ error: "Falta la pregunta" });
  }

  try {
    // Inicializa Gemini con la API Key
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Genera contenido a partir de la pregunta del usuario
    const result = await model.generateContent(`
      Eres un asistente útil.
      Responde la siguiente pregunta del usuario en base a la informacion que te voy a poner luego:
      ${pregunta}
      Informacion:
      Eres un asistente virtual de la empresa Sentio, que busca y tiene como objetivo innovar y facilitar el sistema educativo, volviendo más práctico y efectivo el aprendizaje. Además cuidar de la salud mental de los estudiantes fomentando la comunicación directa entre el docente y el alumno, de forma segura y cómoda para ambas partes volviendo más eficiente la educación secundaria y superior.
      Nuestra visión es un mundo donde los alumnos puedan sentirse más seguros de expresar sus emociones y tengan las herramientas adecuadas y de buena calidad para poder estudiar de la mejor manera.
      Para lograr esto Sentio creo su producto estrella, el Sentio Desk. El Sentio Desk es un escritorio que cuenta con muchas funcionalidades las cuales voy a pasar a explicar uno por uno:
      -La estructura del escritorio cuenta con un cajon en la parte inferior para que el estudiante pueda guardar sus pertenencias alli.
      -La mesa del escritorio cuenta con una inclinacion regulable, lo que hace que al poder regular la inclinacion de la mesa el alumno no tenga que agacharse para poder usar esta mesa por lo que evita problemas en la columna a largo plazo, ademas de que hace mas comoda la experiencia de usar el escritorio.
      -La mesa del escritorio cuenta con un borde de madera sobresaliente en el borde proximo al alumno para que si desea apoyar cosas en la mesa, y esta esta inclinada, no se resbalen y se caigan, sino que este borde sirve de tope.
      -La mesa cuenta con una pantalla integrada la cual esta conectada a una Rasberry (por lo que funciona como una computadora). Esta pantalla tiene acceso a internet (con ciertas restricciones para que el usuario no se distragia en clase con asuntos que no tiene que ver con el colegio, por ejemplo con videojuegos, etc) y cuenta con una carpeta virtual para que el estudiante use su pantalla como una carpeta, asi evita el gasto de hojas, tintas, utiles, etc y ademas que tiene todo guardado de forma segura en su cuenta.
      -La pantalla trae consigo una aplicacion que funciona como chat entre el alumno y profesor, de esta forma si el alumno tiene una consulta y no quiere hablar enfrente de todo su aula puede contactar al profesor por privado.
      -Cada escritorio trae consigo una pulsera, la cual contiene dentro una ESP 32 mini, un Max30102, una bateria recargable y un MPU6050 con todo esto la pulsera lo que hace es medir datos biometricos del alumno que envia al profesor (quien puede ver estos datos en el chat que tiene con cada alumno), con estos datos el docente tiene un pronostico del estado de animo de sus alumnos para que él pueda saber como dar su clase, y si tiene que preocuparse mas de algun alumno en particular, etc.
    `);

    const receta = result.response.text() || "Sin respuesta";

    // Devuelve la respuesta al frontend
    res.status(200).json({ receta });

  } catch (error) {
    console.error("Error llamando a Gemini:", error);
    res.status(500).json({ error: "Error llamando a Gemini" });
  }
}