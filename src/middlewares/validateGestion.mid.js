import { GestionManager } from "../managers/GestionManager.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function validateGestionEnProceso(req, res, next) {
  const {
    dgoIdSolicitud,
    // dgoCodCentroC,
    dgoCodMensajero,
  } = req.body;

  if (!dgoIdSolicitud || !dgoCodMensajero) {
      return res.status(400).send('Faltan campos obligatorios');
  }

  next(); // Si pasa todas las validaciones
};

function validateGestionCompletada(req, res, next) {
  const {
    dgoIdSolicitud,
    // dgoCodCentroC,
    dgoCodMensajero,
    dgoValor,
    dgoVrAdicional
  } = req.body;

  if (!dgoIdSolicitud || !dgoCodMensajero) {
      return res.status(400).send('Faltan campos obligatorios');
  }

  if (isNaN(parseFloat(dgoValor))) {
      return res.status(400).send('El valor debe ser un número válido');
  }

  if (dgoVrAdicional && isNaN(parseFloat(dgoVrAdicional))) {
      return res.status(400).send('El valor adicional debe ser un número válido');
  }

  next(); // Si pasa todas las validaciones
};

async function validateGestionExistente(req, res, next) {
  const gestionManager = new GestionManager(prisma);
  const { id } = req.params;
  const where = { dgoId: parseInt(id) }
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  const gestionExistente = await gestionManager.getUnique(where);
    if (!gestionExistente) {
      return res.status(404).json({ error: 'Gestión no encontrada' });
    }

  next(); // Si pasa todas las validaciones
};

export {
  validateGestionEnProceso,
  validateGestionCompletada,
  validateGestionExistente
};