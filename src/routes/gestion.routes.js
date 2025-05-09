// src/routes/gestion.routes.js
import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { validateGestionEnProceso, validateGestionCompletada, validateGestionExistente } from '../middlewares/validateGestion.mid.js';
import { SolicitudesManager } from '../managers/SolicitudesManager.js'; 
import { GestionManager } from '../managers/GestionManager.js';
import { serializeBigInt } from '../utils/serializeBigInt.js';
import { PrismaClient } from '@prisma/client';
import { getColombiaDateFormat, getTodayRangeUTC } from '../utils/colombiaDateTime.js';

export const gestionRouter = express.Router();

const prisma = new PrismaClient();

gestionRouter.get('/solicitudes-estado', isAuthenticated, async (req, res) => {
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { page = 1, pageSize = 10, searchTerm = '', estado = 'TODAS' } = req.query;
    
    const solictudesEstado = await solicitudesManager.getGestionSolicitudesPorEstado(
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

// Obtener solicitudes pendientes, en proceso y completadas (API)
gestionRouter.get('/', isAuthenticated, async (req, res) => { // /api/gestion
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    // Obtener el número de solicitudes pendientes
    const solicitudesPendientes = await solicitudesManager.count( { dsoCodEstado: "SO" } );

    // Obtener el número de solicitudes en proceso
    const solicitudesEnProceso = await solicitudesManager.count( { dsoCodEstado: "EP" } );

    const { startDate, endDate } = getTodayRangeUTC();
    
    const solicitudesCompletadasHoy = await solicitudesManager.count({
      AND: [
        { dsoCodEstado: "ET" },
        {
          gestion: {
            dgoFchEntrega: {
              gte: startDate,
              lt: endDate
            }
          }
        }
      ]
    });
    
    const solicitudesRecientes = await solicitudesManager.getGestionSolicitudesRecientes();
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
    console.error('Error al obtener las solicitudes a gestionar:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

gestionRouter.get('/:id', isAuthenticated, async (req, res) => { // /api/gestion/:id
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { id } = req.params;
    
    const solicitud = await solicitudesManager.getGestionSolicitudPorId(id);
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

// Nueva gestión EnProceso
gestionRouter.post('/', isAuthenticated, validateGestionEnProceso, async (req, res) => {
  const gestionManager = new GestionManager(prisma);
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const nuevaGestion = await gestionManager.postCrearGestion(req.body);
    if (!nuevaGestion) {
      return res.status(404).json({ error: 'No se pudo crear la gestión' });
    }

    // Actualizar el estado de la solicitud a "En Proceso"
    const { dgoIdSolicitud } = req.body;
    const where = { dsoId: dgoIdSolicitud }
    
    const enProceso = await solicitudesManager.update(
      where,
      { dsoCodEstado: 'EP' },
    ); 
    if (!enProceso) {
      throw res.status(404).json({ error: 'Solicitud no encontrada para cambio de Estado a EnProceso' });
    }

    // Ya con el estado actualizado, podemos serializar la nueva gestión
    const nuevaGestionSerializada = serializeBigInt(nuevaGestion);
    res.json(nuevaGestionSerializada);
  } catch (error) {
    console.error('Error al crear la gestión del domicilio:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar una Gestión a Completada
gestionRouter.put('/:id', isAuthenticated, validateGestionCompletada, validateGestionExistente, async (req, res) => {
  const gestionManager = new GestionManager(prisma);
  const solicitudesManager = new SolicitudesManager(prisma);
  try {
    const { id } = req.params;
    const where = { dgoId: parseInt(id) }

    const {
      dgoIdSolicitud,
      dgoCodCentroC,
      dgoCodMensajero,
      dgoValor,
      dgoVrAdicional,
      dgoObservaciones
    } = req.body;

    const data = {
      dgoIdSolicitud: parseInt(dgoIdSolicitud),
      dgoCodCentroC,
      dgoCodMensajero: BigInt(dgoCodMensajero),
      dgoValor: parseFloat(dgoValor || 0),
      dgoVrAdicional: parseFloat(dgoVrAdicional || 0),
      dgoFchEntrega: getColombiaDateFormat('prisma'),
      dgoObservaciones
  }

    // Actualizar la gestión
    const actualizada = await gestionManager.putActualizarGestion(where, data);
    if (!actualizada) {
      return res.status(404).json({ error: 'No se pudo actualizar la gestión' });
    }

    // Actualizar el estado de la solicitud a "Completada"
    const whereSolicitud = { dsoId: dgoIdSolicitud }
    
    const completada = await solicitudesManager.update(
      whereSolicitud,
      { dsoCodEstado: 'ET' },
    ); 
    if (!completada) {
      throw res.status(404).json({ error: 'Solicitud no encontrada para cambio de Estado a Completada' });
    }

    // Ya con el estado actualizado, podemos serializar la nueva gestión
    const gestionSerializada = serializeBigInt(actualizada);
    res.json(gestionSerializada);
  } catch (error) {
    console.error('Error al actualizar la gestión:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
