import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { ActividadesManager } from '../managers/ActividadesManager.js';

export const actividadesRouter = express.Router();

actividadesRouter.get('/', isAuthenticated, async (req, res) => {
  const actividadesManager = new ActividadesManager(req.db);
  try {
    const actividades = await actividadesManager.getAll(
      {}, 
      {}, 
      {
        dacDescripcion: "asc"
      });
    
    res.json({ actividades });
  } catch (error) {
    console.error('Error al obtener las actividades:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});