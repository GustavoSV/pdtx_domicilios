import { Router } from "express";
import { UsuariosManager } from "../managers/UsuariosManager.js";

export const authRouter = Router();

// Middleware para inicializar el UsuariosManager
authRouter.use((req, res, next) => {
  req.usuariosManager = new UsuariosManager(req.db); // Pasamos la instancia de PrismaClient
  next();
});

authRouter.get("/login", async (req, res) => {
  res.render("login.hbs", { title: "Inicio de sesión" });
});

authRouter.post("/login", async (req, res) => {  
  try {
    const { username, password } = req.body;
    const usuario = await req.usuariosManager.getValidarLogin(username, password, "DOM");
    
    if (usuario) {
      req.session.user = {
        id: usuario.usuUsuario,
        username: usuario.usuNombre,
        role: usuario.usuTipoUsuario
      };

      console.log("authRouter.post/login - req.session:", req.session);
      
      let redirectUrl = "/";
      if (usuario.rapCodRol === "SOL") {    
        redirectUrl = `/solicitudes/solicitudes?username=${encodeURIComponent(usuario.usuNombre)}`;
      } else if (usuario.rapCodRol === "GST") {
        redirectUrl = `/gestion/gestion?username=${encodeURIComponent(usuario.usuNombre)}`;
      } else if (usuario.rapCodRol === "ADM") {
        redirectUrl = `/gestion/administracion?username=${encodeURIComponent(usuario.usuNombre)}`;
      } else {
        return res.status(403).json({error: "Usuario sin rol en la aplicación de domicilios"});
      }

      return res.json({ success: true, redirectUrl });
    } else {
      return res.status(401).json({error: "Usuario no identificado. Credenciales incorrectas"});
    }
  } catch (error) {
    console.error("Error al validar el usuario:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

authRouter.get('/logout', (req, res) => {
  // Destruir la sesión del usuario
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err.message);
      return res.status(500).send('Error al cerrar sesión');
    }
    // Redirigir al formulario de login
    res.redirect('/auth/login');
  });
});