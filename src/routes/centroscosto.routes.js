import express from 'express';
import { PrismaClient } from '@prisma/client';
import { CentroscostoManager } from '../managers/CentroscostoManager.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';

const prisma = new PrismaClient();

export const centroscostoRouter = express.Router();

centroscostoRouter.get('/', isAuthenticated, async (req, res) => {
  const centroscostoManager = new CentroscostoManager(prisma);
  try {
    const centrosCosto = await centroscostoManager.getAll(
      {}, 
      {}, 
      {
        cctNombreCC: "asc"
      });
    
    res.json({ centrosCosto });
  } catch (error) {
    console.error('Error al obtener los centros de costo:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});