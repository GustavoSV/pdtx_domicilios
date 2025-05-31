import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import path from 'path';
import dotenv from 'dotenv';
import { __dirname } from './dirname.js';
import { PrismaClient } from '@prisma/client';
import { viewsRouter } from './routes/views.routes.js';
import { authRouter } from './routes/usuarios.routes.js';
import { gestionRouter } from './routes/gestion.routes.js';
import { solicitudesRouter } from './routes/solicitudes.routes.js';
import { actividadesRouter } from './routes/actividades.routes.js';
import { destinatariosRouter } from './routes/destinatarios.routes.js';
import { barriosRouter } from './routes/barrios.routes.js';
import { mensajerosRouter } from './routes/mensajeros.routes.js';
import { centroscostoRouter } from './routes/centroscosto.routes.js';
import { reportesRouter } from './routes/reportes.routes.js';

// cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
export const db = new PrismaClient();

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para pasar la instancia de db a las rutas
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Public con ruta absoluta
// app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

app.set('trust proxy', 1); // Esto es crucial en entornos como Railway o Heroku, donde el proxy inverso maneja las conexiones HTTPS.

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-secreta', // Clave para firmar la sesión
  resave: false,
  saveUninitialized: false,
  proxy: true, // Añade esto para trabajar mejor con proxies
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,   // Asegura que las cookies no sean accesibles desde JavaScript
    sameSite: 'lax', // o 'none' si es necesario para cross-site
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Handlebars configuration
app.engine(
  "hbs", 
  handlebars.engine({ 
    defaultLayout: "main",
    extname: ".hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    },
    helpers: {
      jsonify: (value) => JSON.stringify(value), // Serializa cualquier valor a JSON
    },
  })
);

app.set("view engine", "hbs");
app.set("views", path.resolve(__dirname, "views"));

// Routes
app.use("/", viewsRouter);
app.use("/auth", authRouter);
app.use("/api/gestion", gestionRouter);
app.use("/api/solicitudes", solicitudesRouter);
app.use("/api/actividades", actividadesRouter);
app.use("/api/destinatarios", destinatariosRouter);
app.use("/api/barrios", barriosRouter);
app.use("/api/mensajeros", mensajerosRouter);
app.use("/api/centroscosto", centroscostoRouter);
app.use("/api/reportes", reportesRouter);

// Server initialization
app.listen(port, () => {
  console.log(`Servidor corriendo en //localhost:${port}`);
});