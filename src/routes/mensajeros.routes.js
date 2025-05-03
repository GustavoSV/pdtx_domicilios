import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.mid.js';
import { MensajerosManager } from '../managers/MensajerosManager.js';
import { serializeBigInt } from '../utils/serializeBigInt.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const mensajerosRouter = express.Router();

mensajerosRouter.get('/paginate', isAuthenticated, async (req, res) => {
  const mensajerosManager = new MensajerosManager(prisma);
  const { page = 1, pageSize = 20, searchTerm = '' } = req.query;
  try {
    const mensajeros = await mensajerosManager.getMensajerosPaginate({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      searchTerm,
    });
    
    if (!mensajeros) {
      return res.status(404).json({ error: 'No se encontraron mensajeros' });
    }
    
    const mensajerosSerializadas = serializeBigInt(mensajeros);
    res.json(mensajerosSerializadas);
  } catch (error) {
    console.error('Error al obtener los mensajeros:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

mensajerosRouter.get('/', isAuthenticated, async (req, res) => {
  const mensajerosManager = new MensajerosManager(prisma);
  try {
    const mensajeros = await mensajerosManager.getAll(
      {}, 
      {}, 
      {
        msjNombre: "asc"
      });

    const mensajerosSerializados = serializeBigInt(mensajeros);
    res.json({ mensajerosSerializados });
  } catch (error) {
    console.error('Error al obtener los mensajeros:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

mensajerosRouter.get('/:id', isAuthenticated, async (req, res) => {
  const mensajerosManager = new MensajerosManager(prisma);
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'El ID debe ser un número' });
    }
    const mensajero = await mensajerosManager.getUnique(
      {
        msjId: id
      }
    );
    if (!mensajero) {
      return res.status(404).json({ error: 'Mensajero no encontrado'});
    }
    const mensajeroSerializado = serializeBigInt(mensajero);
    res.json({ mensajeroSerializado });
  } catch (error) {
    console.error('Error al obtener el mensajero:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear un nuevo destinatario (API)
mensajerosRouter.post('/', isAuthenticated, async (req, res) => {
  const mensajerosManager = new MensajerosManager(prisma);

  try {
    if (!req.body.msjCodigo || !req.body.msjNombre || !req.body.msjDireccion || !req.body.msjTelefono) {
      return res.status(400).json({ 
        success: false,
        message: 'Faltan datos requeridos',
        errors: {
          fields: ['msjCodigo', 'msjNombre', 'msjDireccion', 'msjTelefono']
        }
      });
    }
    const response = await mensajerosManager.create(req.body);
    if (!response) {
      return res.status(400).json({ 
        success: false,
        message: 'Error al crear el mensajero'
      });
    }

    const nuevoMensajero = serializeBigInt(response);
    return res.status(201).json({
      success: true,
      message: 'Mensajero creado correctamente',
      data: nuevoMensajero
    });
  } catch (error) {
    console.error('Error en creación de mensajero:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Actualizar un destinatario (API)
mensajerosRouter.put('/:id', isAuthenticated, async (req, res) => {
  const mensajerosManager = new MensajerosManager(prisma);
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'El ID debe ser un número'
      });
    }
    const where = { msjId: parseInt(id) }

    if (!req.body.msjCodigo || !req.body.msjNombre || !req.body.msjDireccion || !req.body.msjTelefono) {
      return res.status(400).json({ 
        success: false,
        message: 'Faltan datos requeridos',
        errors: {
          fields: ['msjCodigo', 'msjNombre', 'msjDireccion', 'msjTelefono']
        }
      });
    }

    const response = await mensajerosManager.update(where, req.body);
    if (!response) {
      return res.status(400).json({ 
        success: false,
        message: 'Error al modificar el mensajero'
      });
    }

    const mensajero = serializeBigInt(response);
    return res.status(201).json({
      success: true,
      message: 'Mensajero modificado correctamente',
      data: mensajero
    });
  } catch (error) {
    console.error('Error al actualizar el mensajero:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Eliminar una solicitud (API)
mensajerosRouter.delete('/:id', isAuthenticated, async (req, res) => {
  const mensajerosManager = new MensajerosManager(prisma);
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'El ID debe ser un número'
      });
    }
    const where = { msjId: parseInt(id) }
    
    // se invoca el método delete directamente del Manager general pasando el where
    const response = await mensajerosManager.delete(where); 
    if (!response) {
      return res.status(400).json({ 
        success: false,
        message: 'Error al eliminar el mensajero'
      });
    }

    const mensajero = serializeBigInt(response);
    return res.status(201).json({
      success: true,
      message: 'Mensajero eliminado correctamente',
      data: mensajero
    });
  } catch (error) {
    console.error('Error al eliminar el mensajero:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

