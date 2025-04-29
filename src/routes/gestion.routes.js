// src/routes/gestion.routes.js
import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { GestionManager } from '../managers/GestionManager.js';
import { serializeBigInt } from '../utils/serializeBigInt.js';

export const gestionRouter = express.Router();

// Obtener solicitudes pendientes, en proceso y completadas (API)
gestionRouter.get('/', isAuthenticated, async (req, res) => { // /api/gestion
  const gestionManager = new GestionManager(req.db);
  try {
    // Obtener el número de solicitudes pendientes
    const solicitudesPendientes = await gestionManager.count( { dsoCodEstado: "SO" } );

    // Obtener el número de solicitudes en proceso
    const solicitudesEnProceso = await gestionManager.count( { dsoCodEstado: "EP" } );

    const now = new Date();
    // Obtener la diferencia horaria en minutos (para Colombia es -5 * 60 = -300)
    const offset = now.getTimezoneOffset();
    // Ajustar la fecha para obtener la hora en Colombia
    const colombiaTime = new Date(now.getTime() - offset * 60 * 1000);
    const todayColombia = colombiaTime.toISOString().split('T')[0];
    
    const startOfDayColombia = new Date(`${todayColombia}T00:00:00.000Z`);
    const endOfDayColombia = new Date(`${todayColombia}T23:59:59.999Z`);
    
    const solicitudesCompletadasHoy = await gestionManager.count({
      AND: [
        { dsoCodEstado: "ET" },
        {
          gestion: {
            dgoFchEntrega: {
              gte: startOfDayColombia,
              lt: endOfDayColombia
            }
          }
        }
      ]
    });
    
    const solicitudesRecientes = await gestionManager.getSolicitudesRecientes();
    const limite = 10; // número de solicitudes recientes a mostrar
    const arrayLimitado = Object.values(solicitudesRecientes).slice(0, limite);
    const recientesSerializadas = serializeBigInt(arrayLimitado);
    
    res.json({
      solicitudesPendientes,
      solicitudesEnProceso,
      solicitudesCompletadasHoy,
      recientesSerializadas,
    });
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

gestionRouter.get('/solicitudes-estado', isAuthenticated, async (req, res) => {
  const gestionManager = new GestionManager(req.db);
  try {
    const { page = 1, pageSize = 10, searchTerm = '', estado = 'TODAS' } = req.query;
    
    const solictudesEstado = await gestionManager.getSolicitudesPorEstado(
      estado, 
      { 
        page: parseInt(page), pageSize: parseInt(pageSize), searchTerm 
      });
      
    if (!solictudesEstado) {
      return res.status(404).json({ error: `No se encontraron solicitudes para el estado ${estado}` });
    }
    const solictudesEstadoSerializadas = serializeBigInt(solictudesEstado);
    res.json(solictudesEstadoSerializadas);
  } catch (error) {
    console.error('Error al obtener las solicitudes por estado:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar el estado de una solicitud (API)
gestionRouter.post('/actualizar-estado/:id', isAuthenticated, async (req, res) => {
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
