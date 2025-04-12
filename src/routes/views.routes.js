import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.mid.js";

export const viewsRouter = Router();

// Ruta para la página de inicio
viewsRouter.get("/", (req, res) => {
  res.render("home.hbs", { title: "Bienvenido" });
});

// Ruta protegida para la Solicitud de Domicilios
viewsRouter.get("/solicitudes/solicitudes", isAuthenticated, async (req, res) => {
  try {
    res.render("domicilios/home-solicitudes.hbs", {
      user: req.session.user,
    });
  } catch (error) {
    console.error("Error al cargar el home-solicitudes:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

// Detalles de una solicitud
viewsRouter.get('/solicitudes/detalle-solicitudes/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    res.render('domicilios/detalle-solicitudes.hbs', { idSolicitud: id });
  } catch (error) {
    console.error('Error al obtener los detalles del domicilio:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta protegida para la lista de solicitudes
viewsRouter.get("/solicitudes/lista-solicitudes", isAuthenticated, (req, res) => {
  res.render("domicilios/lista-solicitudes.hbs", { title: "Mis Solicitudes" });
});

// Ruta protegida para la creación de domicilios
viewsRouter.get("/solicitudes/form-solicitudes", isAuthenticated, (req, res) => {
  res.render("domicilios/form-solicitudes.hbs", { 
    title: "Crear Solicitud",
    userId: req.session.user.id
  });
});

// Ruta protegida para la modificación de domicilios
viewsRouter.get("/solicitudes/form-solicitudes/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  
  res.render("domicilios/form-solicitudes.hbs", {
    idDomicilio: id,
    title: "Actualizar Solicitud",
    userId: req.session.user.id
  })
});

// RUTAS PARA LA GESTION DE DOMICILIOS
// Ruta protegida para la gestión de los domicilios
viewsRouter.get("/gestion/gestion", isAuthenticated, async (req, res) => {
  res.render("domicilios/home-gestion.hbs", { title: "Gestión de Domicilios" });
});

// RUTAS PARA EL MANEJO DE LOS DESTINATARIOS
// Ruta protegida para la lista de destinatarios
viewsRouter.get("/destinatarios/lista-destinatarios", isAuthenticated, (req, res) => {
  res.render("domicilios/lista-destinatarios.hbs", { title: "Destinatarios" });
});

// Ruta protegida para la creación de destinatarios
viewsRouter.get("/destinatarios/form-destinatarios", isAuthenticated, (req, res) => {
  res.render("domicilios/form-destinatarios.hbs", { 
    title: "Crear Destinatario",
    userId: req.session.user.id
  });
});

// Ruta protegida para la modificación de Destinatarios
viewsRouter.get("/destinatarios/form-destinatarios/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  
  res.render("domicilios/form-destinatarios.hbs", {
    idDestinatario: id,
    title: "Actualizar Destinatario",
    userId: req.session.user.id
  })
});

// Rutas SOLO PARA EJEMPLO DE FUTURAS OPCIONES
// Rutas para otras aplicaciones (ejemplo)
viewsRouter.get("/pedidos", isAuthenticated, (req, res) => {
  res.send("Módulo de Pedidos (en desarrollo)");
});

viewsRouter.get("/pqrs", isAuthenticated, (req, res) => {
  res.send("Módulo de PQRS (en desarrollo)");
});