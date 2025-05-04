import { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.mid.js";

export const viewsRouter = Router();

// Ruta para la página de inicio
viewsRouter.get("/", (req, res) => {
  res.render("home.hbs", { title: "Bienvenido" });
});

// Ruta protegida para la Solicitud de Domicilios
viewsRouter.get("/solicitudes/solicitudes", isAuthenticated, async (req, res) => {
  const origin = req.query.origin || 'solicitud'; // Por defecto, 'solicitud'
  try {
    res.render("domicilios/home-solicitudes.hbs", {
      user: req.session.user,
      origin
    });
  } catch (error) {
    console.error("Error al cargar el home-solicitudes:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

// Detalles de una solicitud
viewsRouter.get('/solicitudes/detalle-solicitudes/:id/:origin', isAuthenticated, async (req, res) => {
  try {
    const { id, origin } = req.params;
    res.render('domicilios/detalle-solicitudes.hbs', { 
      idSolicitud: id,
      userId: req.session.user.id,
      origin
    });
  } catch (error) {
    console.error('Error al obtener los detalles del domicilio:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta protegida para la lista de solicitudes
viewsRouter.get("/solicitudes/lista-solicitudes", isAuthenticated, (req, res) => {
  const origin = req.query.origin || 'solicitud'; // Por defecto, 'solicitud'
  res.render("domicilios/lista-solicitudes.hbs", { 
    title: "Mis Solicitudes",
    user: req.session.user,
    origin
  });
});

// Ruta protegida para la creación de domicilios
viewsRouter.get("/solicitudes/form-solicitudes", isAuthenticated, (req, res) => {
  const origin = req.query.origin || 'solicitud'; // Por defecto, 'solicitud'
  
  const isValidOrigin = ['gestion', 'solicitud'].includes(origin);
  let returnUrl = 'xxx';
  if (isValidOrigin) {
    returnUrl = origin === 'gestion' ? '/gestion/dashboard' : '/solicitudes/lista-solicitudes';
  }
  
  res.render("domicilios/form-solicitudes.hbs", { 
    title: "Crear Solicitud",
    userId: req.session.user.id,
    returnUrl // Pasar la URL de cancelación a la vista
  });
});

// Ruta protegida para la modificación de domicilios
viewsRouter.get("/solicitudes/form-solicitudes/:id/:origin", isAuthenticated, async (req, res) => {
  const { id, origin } = req.params;

  const isValidOrigin = ['gestion', 'solicitud'].includes(origin);
  let returnUrl = 'xxx';
  if (isValidOrigin) {
    returnUrl = origin === 'gestion' ? '/gestion/dashboard' : '/solicitudes/lista-solicitudes';
  }
  
  res.render("domicilios/form-solicitudes.hbs", {
    idDomicilio: id,
    title: "Actualizar Solicitud",
    userId: req.session.user.id,
    origin,
    returnUrl
  })
});

// RUTAS PARA LA GESTION DE DOMICILIOS
// Ruta protegida para la gestión de los domicilios
viewsRouter.get("/gestion/dashboard", isAuthenticated, async (req, res) => {
  const origin = req.query.origin || 'gestion'; // Por defecto, 'gestion'
  try {
    res.render("domicilios/home-gestion.hbs",  {
      userId: req.session.user.id,
      origin
    });
  } catch (error) {
    console.error("Error al cargar el home-gestion:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRouter.get("/gestion/lista-gestion", isAuthenticated, async (req, res) => {
  const origin = req.query.origin || 'gestion'; // Por defecto, 'gestion'
  try {
    res.render("domicilios/lista-gestion.hbs", {
      user: req.session.user,
      origin
    });
  } catch (error) {
    console.error("Error al cargar el lista-gestion:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

viewsRouter.get("/gestion/form-gestion/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    res.render("domicilios/form-gestion.hbs", {
      idSolicitud: id,
      title: "Gestionar Domicilio",
      user: req.session.user,
    });

  } catch (error) {
    console.error("Error al cargar el form-gestion:", error.message);
    res.status(500).send("Error interno del servidor");
  }
}
);

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

// RUTAS PARA EL MANEJO DE LOS MENSAJEROS
// Ruta protegida para la lista de mensajeros
viewsRouter.get("/mensajeros/lista-mensajeros", isAuthenticated, (req, res) => {
  res.render("domicilios/lista-mensajeros.hbs", { title: "Mensajeros" });
});

// Ruta protegida para la creación de mensajeros
viewsRouter.get("/mensajeros/form-mensajeros", isAuthenticated, (req, res) => {
  res.render("domicilios/form-mensajeros.hbs", { 
    title: "Crear Mensajero",
    userId: req.session.user.id
  });
});

// Ruta protegida para la modificación de mensajeros
viewsRouter.get("/mensajeros/form-mensajeros/:id", isAuthenticated, async (req, res) => {
  const { id } = req.params;
  
  res.render("domicilios/form-mensajeros.hbs", {
    idMensajero: id,
    title: "Actualizar Mensajero",
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