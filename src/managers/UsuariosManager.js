import { Manager } from "./Manager.js";

export class UsuariosManager extends Manager {
  constructor(db) {
    super(db.gen_usuarios); // modelo de la base de datos
  }

  // aquí la extensión de la clase
  async getValidarLogin(user, pass, app) { // este método no está en el Manager general
    try {
      const usuario = await this.getUnique(
        {
          usuUsuario: user,
          usuClave: pass
        },
        {
          rolesapp: {
            where: {
              rapCodApp: app, 
            },
            select: {
              rapCodApp: true,
              rapCodRol: true
            }
          }
        });

      // Si no se encontró ningún rol devolver solo el usuario
      if (!usuario || usuario.rolesapp.length === 0) {
        return usuario;
      }

      // Agregar el campo rapCodRol al objeto usuario
      usuario.rapCodApp = usuario.rolesapp[0].rapCodApp;
      usuario.rapCodRol = usuario.rolesapp[0].rapCodRol;
      return usuario;
    } catch (error) {
      console.error('Error en getValidarLogin:', error.message);
      throw error;
    }
  }
};