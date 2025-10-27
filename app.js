import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan"; //morgan sirve para ver las peticiones que llegan al servidor
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importa la conexión a la DB
import { connectDB } from "./src/config/database.js";

// Importa ÚNICAMENTE las rutas de MongoDB que están en uso
import authRoutes from "./src/routes/auth.routes.js";
// import taskRoutes from "./src/routes/task.routes.js";
// import reporteRoutes from "./src/routes/reporteRoutes.js";
// import categoriaRoutes from "./src/routes/categoriaRoutes.js";
// import incidenteRoutes from "./src/routes/incidenteRoutes.js";
// import userRoutes from "./src/routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url); //este es para poder usar __dirname en ES modules
const __dirname = path.dirname(__filename); //este es para poder usar __dirname en ES modules


const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "front")));

// Rutas de la API
app.use("/api", authRoutes);
// app.use("/api", taskRoutes);
// app.use("/api", reporteRoutes);
// app.use("/api", categoriaRoutes);
// app.use("/api", incidenteRoutes);
// app.use("/api", userRoutes);
// app.use(express.static(path.join(__dirname, "frontend"))); //avatarurl
// Ruta "Catch-All" para el Frontend
app.get("", (req, res) => {
  res.sendFile(path.join(__dirname, "front", "index.html"));
});

// Iniciar el servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Servidor unificado corriendo en http://localhost:${PORT}`);
});