// src/routes/gestion.routes.js
import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { GestionManager } from '../managers/GestionManager.js';

export const gestionRouter = express.Router();

// Actualizar el estado de una solicitud (API)
gestionRouter.post('/api/gestion/actualizar-estado/:id', isAuthenticated, async (req, res) => {
  const gestionManager = new GestionManager(req.db);
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    // Actualizar el estado de la solicitud
    const resultado = await gestionManager.actualizarEstadoSolicitud(id, nuevoEstado);
    if (!resultado) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ mensaje: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
