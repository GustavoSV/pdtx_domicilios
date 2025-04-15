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

const isProduction = process.env.NODE_ENV === 'production'; // Detecta si estás en producción
const isHttps = isProduction || (process.env.FORCE_HTTPS && process.env.FORCE_HTTPS === 'true');

app.use((req, res, next) => {
  // Middleware para determinar si la conexión es HTTPS
  const isHttps = req.protocol === 'https';
  app.locals.isHttps = isHttps; // Almacena el valor en app.locals para su uso posterior}

  console.log("app.locals.isHttps:", app.locals.isHttps);
  console.log("app.locals.isProduction:", isProduction);
  console.log("req.protocol:", req.protocol);
  console.log("req.secure:", req.secure);
  
  next();
});

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-secreta', // Clave para firmar la sesión
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: app.locals.isHttps, // Habilita `secure` solo si estás usando HTTPS
    httpOnly: true,   // Asegura que las cookies no sean accesibles desde JavaScript
    sameSite: 'lax'   // Mejora la seguridad contra ataques CSRF
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

// Server initialization
app.listen(port, () => {
  console.log(`Servidor corriendo en //localhost:${port}`);
});