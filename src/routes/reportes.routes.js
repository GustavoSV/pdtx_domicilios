import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { SolicitudesManager } from '../managers/SolicitudesManager.js';
import { serializeBigInt } from '../utils/serializeBigInt.js';
import { PrismaClient } from '@prisma/client';

export const reportesRouter = express.Router();

const prisma = new PrismaClient();

reportesRouter.get('/domicilios-por-usuario', isAuthenticated, async (req, res) => {
  const solicitudesManager = new SolicitudesManager(prisma);
  const { mes, anio } = req.query;
  try {
    const data = await solicitudesManager.getDomiciliosPorUsuario(parseInt(mes), parseInt(anio));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

reportesRouter.get('/valores-por-centros-costos', isAuthenticated, async (req, res) => {
  const solicitudesManager = new SolicitudesManager(prisma);
  const { mes, anio } = req.query;
  try {
    const data = await solicitudesManager.getValoresPorCentrosCostos(parseInt(mes), parseInt(anio));
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});