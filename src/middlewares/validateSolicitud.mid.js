import { SolicitudesManager } from "../managers/SolicitudesManager.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function validateDatosRequeridosSolicitud(req, res, next) {
  const {
    dsoCodActividad,
    dsoCodDestinatario,  
    dsoDireccion,
    dsoCodBarrio,
    dsoCodEstado,
  } = req.body;

  if (!dsoCodActividad || !dsoCodDestinatario || 
      !dsoCodBarrio || !dsoCodEstado || !dsoDireccion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }
  next();
}

async function validateIdExistente(req, res, next) {
  const { id } = req.params;
  const where = { dsoId: parseInt(id) }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número' });
  }

  const solicitudesManager = new SolicitudesManager(prisma);
  const existe = await solicitudesManager.getUnique(where);
    if (!existe) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

  next();
}

export {
  validateDatosRequeridosSolicitud,
  validateIdExistente,
}