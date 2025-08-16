// server.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static('public')); // Serviremos los archivos del
console.log("entrando a server.js")

// Configuración segura de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Endpoint para generar recetas
app.post('/generar-solucion', async (req, res) => {
try {
const { pregunta } = req.body;
const prompt = `
A continuacion te voy a pasar informacion acerca de un producto llamado SentioDesk que creo la empresa llamada Sentio, quiero que en base a la info que yo te vaya a dar respondas el mensaje del usuario.
Mensaje del usuario a responder: ${pregunta}
Informacion:
SendioDesk es un producto desarrollado para innovar el aprendizaje. Su objetivo es mejorar la experiencia
del alumno en las aulas haciendo que los estudiantes tengan una gran herramienta con la cual trabajar, 
se sientan seguros al usarla y al estar en clase, se sientan comodos, y puedan exprimir sus habilidades.
El escritorio, producido por Sentio, cuenta con distintas funciones, a continuacion te explayo una por una:
-Primero que nada la mesa es inclinable, desde el costado se puede ajustar la inclinacion de la mesa
para que de esta forma el estudiante no tenga que encorbarse para poder usar la misma mesa, de esta forma
se busca prevenir problemas en la columna que se pueden generar a largo plazo. Tambien es una forma mas
comoda de poder usar el escritorio.
-La mesa posee un pequeño borde de madera, en el borde proximo al estudiante, por si el alumno desea colocar
un lapiz, cuaderno, u otro objeto, para que si esta inclinado el escritorio no se caiga por efecto de la gravedad.
-La mesa posee un cajon debajo de la mesa para que el alumno pueda guardar sus pertenencias.
-La mesa posee una pantalla la cual el usuario puede usar libremente. La pantalla esta conectada a una rasberry
que funciona como "el cerebro de la computadora". El implementar esta "computadora" al escritorio tiene como 
objetivo que el estudiante pueda usar herramientas digitales para poder realizar sus trabajos de clase, 
ademas de que evita gastar montones de hojas y utiles para minimizar el gasto de estos recursos que se terminan
perdiendo. Ademas de esta forma el estudiante puede tener todos sus trabajos guardados en la nube, sin tener
que preocuparse de que se puedan perder.
-La pantalla/computadora tiene una aplicacion, desarollada por Sentio, la cual funciona como chat entre 
los profesores y los alumnos. Basicamente es un "Whatsapp" para que los alumnos si tienen alguna incomodidad
en hablar frente a todo su aula puedan preguntarle por privado a su profesor (los chats son solo entre
profesores y alumnos, uno con uno. El profesor tiene a toda su clase agendada en la aplicacion, y cada alumno
tiene solo a los profesores agendades en su chat).
-Cada escritorio trae junto al mismo una pulsera. Esta pulsera esta compuesta por una ESP 32 mini, un MPU 6050,
un Max 30102, y una bateria recargable. Esta pulsera lo que hace es medir ciertos datos biometricos del alumno
que envia SOLO al profesor, quien puede ver estos datos en el chat que tiene con cada alumno. De esta forma
el profesor, con los datos biometricos, puede deducir el estado de animo de cada uno de sus alumnos para saber
si alguno esta desanimado, estresado, etc y asi saber como manejar a cada uno de sus estudiantes y su propia clase.

`;

const result = await model.generateContent(prompt);
const receta = result.response.text();
res.json({ receta: receta.trim() });
} catch (error) {
res.status(500).json({ error: 'Error al generar la respuesta.' });
}
});
app.listen(port, () => {
console.log(`¡Chef IA listo para cocinar en
http://localhost:${port}!`);});