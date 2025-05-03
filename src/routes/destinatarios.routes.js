import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { DestinatariosManager } from '../managers/DestinatariosManager.js';
import { MensajerosManager } from '../managers/MensajerosManager.js';
import { serializeBigInt } from '../utils/serializeBigInt.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const destinatariosRouter = express.Router();

destinatariosRouter.get('/lista-destinatarios', isAuthenticated, async (req, res) => {
  const destinatariosManager = new DestinatariosManager(prisma);
  const { page = 1, pageSize = 20, searchTerm = '' } = req.query;
  try {
    const destinatarios = await destinatariosManager.getDestinatariosPaginate({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      searchTerm,
    });
    
    if (!destinatarios) {
      return res.status(404).json({ error: 'No se encontraron destinatarios' });
    }
    
    res.json(destinatarios);
  } catch (error) {
    console.error('Error al obtener los destinatarios:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

destinatariosRouter.get('/', isAuthenticated, async (req, res) => {
  const destinatariosManager = new DestinatariosManager(prisma);
  try {
    const destinatarios = await destinatariosManager.getAll(
      {}, 
      {}, 
      {
        ddtNombre: "asc"
      });
    
    res.json({ destinatarios });
  } catch (error) {
    console.error('Error al obtener los destinatarios:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

destinatariosRouter.get('/:id', isAuthenticated, async (req, res) => {
  const destinatariosManager = new DestinatariosManager(prisma);
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }
    const destinatario = await destinatariosManager.getDestinatarioxId(id);
    if (!destinatario) {
      return res.status(404).json({ error: 'Destinatario no encontrado' });
    }
    res.json({ destinatario });
  } catch (error) {
    console.error('Error al obtener el destinatario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo destinatario (API)
destinatariosRouter.post('/', isAuthenticated, async (req, res) => {
  const destinatariosManager = new DestinatariosManager(prisma);

  try {
    if (!req.body.ddtNombre || !req.body.ddtDireccion || !req.body.ddtCodBarrio) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    
    const nuevoDestinatario = await destinatariosManager.postNuevoDestinatario(req.body);
    res.status(201).json({ nuevoDestinatario });
  } catch (error) {
    console.error('Error al crear el destinatario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar un destinatario (API)
destinatariosRouter.put('/:id', isAuthenticated, async (req, res) => {
  const destinatariosManager = new DestinatariosManager(prisma);
  try {
    const { id } = req.params;
    const where = { ddtId: parseInt(id) }
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }

    if (!req.body.ddtNombre || !req.body.ddtDireccion || !req.body.ddtCodBarrio) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const destinatarioActualizado = await destinatariosManager.update(where, req.body);
    if (!destinatarioActualizado) {
      return res.status(404).json({ error: 'Destinatario no encontrado' });
    }
    res.json({ destinatarioActualizado });
  } catch (error) {
    console.error('Error al actualizar el destinatario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar una solicitud (API)
destinatariosRouter.delete('/:id', isAuthenticated, async (req, res) => {
  const destinatariosManager = new DestinatariosManager(prisma);
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'No se recibe correctamente el parámetro id' });
    }
    const where = { ddtId: parseInt(id) };
    
    // se invoca el método delete directamente del Manager general pasando el where
    const eliminado = await destinatariosManager.delete(where); 
    if (!eliminado) {
      return res.status(404).json({ error: 'Destinatario no encontrado' });
    }
    res.json({ mensaje: 'Destinatario eliminado correctamente' });
  } catch (error) {
    console.error("destinatariosRouter - Error al eliminar el destinatario:", error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});