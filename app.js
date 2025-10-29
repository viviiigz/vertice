import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importa la conexión a la DB
import { connectDB } from "./src/config/database.js";

// Importa ÚNICAMENTE las rutas de MongoDB que están en uso
// Asegúrate de que esta ruta sea correcta: './src/routes/auth.routes.js'
import authRoutes from "./src/routes/auth.routes.js"; 

// Estas son solo referencias, asegúrate de que existen si las descomentas
// import taskRoutes from "./src/routes/task.routes.js";
// import reporteRoutes from "./src/routes/reporteRoutes.js";
// import categoriaRoutes from "./src/routes/categoriaRoutes.js";
// import incidenteRoutes from "./src/routes/incidenteRoutes.js";
// import userRoutes from "./src/routes/user.routes.js";

// Configuración para usar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 


const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());


// =======================================================
// CORRECCIÓN CLAVE: PRIORIDAD DE RUTA RAIZ
// =======================================================
// 1. Manejar la ruta raíz "/" primero para forzar la carga de login.html
app.get("/", (req, res) => {
    // Redirige al archivo de inicio de sesión
    res.sendFile(path.join(__dirname, "landing", "login.html"));
});

// 2. Servir archivos estáticos del frontend (landing)
// Esto maneja todos los demás archivos (register.html, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "landing")));


// =======================================================
// RUTAS DE LA API
// =======================================================
// Todas las rutas del backend deben ir después de la configuración de archivos estáticos.
app.use("/api", authRoutes); 
// app.use("/api", taskRoutes);
// app.use("/api", reporteRoutes);
// app.use("/api", categoriaRoutes);
// app.use("/api", incidenteRoutes);
// app.use("/api", userRoutes);


// Iniciar el servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Servidor unificado corriendo en http://localhost:${PORT}`);
});
