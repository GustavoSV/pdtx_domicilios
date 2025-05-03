// src/routes/solicitudes.routes.js
import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { SolicitudesManager } from '../managers/SolicitudesManager.js';
import { serializeBigInt } from '../utils/serializeBigInt.js';
import { PrismaClient } from '@prisma/client';

export const solicitudesRouter = express.Router();

const prisma = new PrismaClient();

// Obtener solicitudes activas y completadas (API)
solicitudesRouter.get('/', isAuthenticated, async (req, res) => {  // /api/solicitudes
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const userId = req.session.user.id;
    const solicitudesActivas = await solicitudesManager.getSolicitudesActivas(userId);
    const solicitudesCompletadas = await solicitudesManager.getSolicitudesCompletadas(userId);
    // const objetoLimitado = Object.fromEntries(
    //   Object.entries(solicitudesCompletadas).slice(0, limite)
    // );
    const limite = 10; // número de solicitudes completadas a mostrar
    const arrayLimitado = Object.values(solicitudesCompletadas).slice(0, limite);

     // Serializar los datos usando la función genérica
    const solicitudesActivasSerializadas = serializeBigInt(solicitudesActivas);
    const solicitudesCompletadasSerializadas = serializeBigInt(arrayLimitado);
 
    res.json({
      solicitudesActivas: solicitudesActivasSerializadas,
      solicitudesCompletadas: solicitudesCompletadasSerializadas,
    });
  } catch (error) {
    console.error('Error al obtener las solicitudes:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener mis solicitudes paginadas (API)
solicitudesRouter.get('/lista-solicitudes', isAuthenticated, async (req, res) => { 
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const userId = req.session.user.id;
    const { page = 1, pageSize = 20, searchTerm = '' } = req.query;

    // Obtener las solicitudes paginadas del usuario
    const misSolicitudes = await solicitudesManager.getMisSolicitudes(
      userId, 
      { 
        page: parseInt(page), pageSize: parseInt(pageSize), searchTerm 
      });

    if (!misSolicitudes) {
      return res.status(404).json({ error: 'No se encontraron solicitudes' });
    }
    
    const misSolicitudesSerializadas = serializeBigInt(misSolicitudes);
    res.json(misSolicitudesSerializadas);
  } catch (error) {
    console.error('Error al obtener las solicitudes del usuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener detalles de una solicitud (API)
solicitudesRouter.get('/:id', isAuthenticated, async (req, res) => {  // /api/solicitudes/:id
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { id } = req.params;

    const solicitud = await solicitudesManager.getObtenerSolicitudPorId(id);
    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    
    const solicitudSerializada = serializeBigInt(solicitud);

    res.json({ solicitudSerializada });
  } catch (error) {
    console.error('Error al obtener los detalles de la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear una nueva solicitud (API)
solicitudesRouter.post('/', isAuthenticated, async (req, res) => {  // /api/solicitudes
  const solicitudesManager = new SolicitudesManager(prisma);
  const userId = req.session.user.id; // Obtener el ID del usuario autenticado
  
  try {
    if (!req.body.dsoCodActividad || !req.body.dsoCodDestinatario || 
        !req.body.dsoCodBarrio || !req.body.dsoCodEstado || !req.body.dsoDireccion) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    const nuevaSolicitud = await solicitudesManager.postNuevaSolicitud(req.body, userId);
    res.json(nuevaSolicitud);
  } catch (error) {
    console.error('solicitudesRouter - Error al crear la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar una solicitud existente (API)
solicitudesRouter.put('/:id', isAuthenticated, async (req, res) => {  // /api/solicitudes/:id
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { id } = req.params;
    const where = { dsoId: parseInt(id) }
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }
    if (!req.body.dsoId || !req.body.dsoCodActividad || !req.body.dsoCodDestinatario || 
        !req.body.dsoCodBarrio || !req.body.dsoCodEstado || !req.body.dsoDireccion) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    const solicitudActualizada = await solicitudesManager.update(where, req.body);
    if (!solicitudActualizada) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    const solicitudSerializada = serializeBigInt(solicitudActualizada);

    res.json( solicitudSerializada );
  } catch (error) {
    console.error('Error al actualizar la solicitud:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar una solicitud (API)
solicitudesRouter.delete('/:id', isAuthenticated, async (req, res) => {  // /api/solicitudes/:id
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { id } = req.params;
    if (! id) {
      return res.status(400).json({ error: 'No se recibe correctamente el parámetro id' });
    }
    const where = { dsoId: parseInt(id) }
    
    // se invoca el método delete directamente del Manager general pasando el where
    const eliminada = await solicitudesManager.delete(where); 
    if (!eliminada) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ mensaje: 'Solicitud eliminada correctamente' });
  } catch (error) {
    console.error("solicitudesRouter - Error al eliminar la solicitud:", error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Anular una solicitud
solicitudesRouter.put('/anular/:id', isAuthenticated, async (req, res) => {  // /api/solicitudes/anular/:id
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { id } = req.params;
    if (! id) {
      return res.status(400).json({ error: 'No se recibe correctamente el parámetro id' });
    }
    const where = { dsoId: parseInt(id) }
    
    // se invoca el método delete directamente del Manager general pasando el where
    const anular = await solicitudesManager.update(
      where,
      { dsoCodEstado: req.body.dsoCodEstado }
    ); 
    if (!anular) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.json({ mensaje: 'Solicitud anulada correctamente' });
  } catch (error) {
    console.error("solicitudesRouter - Error al anular la solicitud:", error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});