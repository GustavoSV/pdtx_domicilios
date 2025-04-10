import { Router } from "express";
import { BarriosManager } from "../managers/BarriosManager.js";
import req from "express/lib/request.js";

export const barriosRouter = Router();

barriosRouter.get("/", async (req, res) => {
  const barriosManager = new BarriosManager(req.db);
  try {
    const options = req.body
    const barrios = await barriosManager.getAll({options});
    res.json({ barrios });
  } catch (error) {
    console.error("Error al obtener los barrios:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

barriosRouter.get("/:codbarrio", async (req, res) => {
  const barriosManager = new BarriosManager(req.db);
  try {
    const codBarrio = req.params.codbarrio;
    const barrio = await barriosManager.getUnique(
      {
        gbrCodigo: codBarrio,
      },
      { 
        ciudades: {
          select: {
            ciuNombre: true
          }
        }
      }
    );
    res.json({ barrio });
  } catch (error) {
    console.error("Error al obtener el Barrio con código:", codBarrio, "ERROR:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

barriosRouter.get("/municipio/:codmunicipio", async (req, res) => {
  const barriosManager = new BarriosManager(req.db);
  try {
    const codMunicipio = req.params.codmunicipio;
    const barrios = await barriosManager.getBarriosByCiudad(codMunicipio); 
      
    res.json({ barrios });
  } catch (error) {
    console.error("Error al obtener el Barrio con código:", codBarrio, "ERROR:", error.message);
    res.status(500).send("Error interno del servidor");
  }
});

barriosRouter.get("/paginate", async (req, res) => {
  const barriosManager = new BarriosManager(req.db);
  try {
    const { page = 1, pageSize = 10, where = {}, include = {}, orderBy = {} } = req.body;
    
    // Validar que los parámetros sean objetos válidos
    if (typeof where !== "object" || Array.isArray(where)) {
      return res.status(400).json({ error: 'El parámetro "where" debe ser un objeto JSON válido.' });
    }
    if (typeof include !== "object" || Array.isArray(include)) {
      return res.status(400).json({ error: 'El parámetro "include" debe ser un objeto JSON válido.' });
    }
    if (typeof orderBy !== "object" || Array.isArray(orderBy)) {
      return res.status(400).json({ error: 'El parámetro "orderBy" debe ser un objeto JSON válido.' });
    }
    
    const options = { page, pageSize, where, include, orderBy };
    
    const barrios = await barriosManager.getPaginate(options);
    res.json(barrios);
  } catch (error) {
    console.error("Error al obtener los barrios paginados:", error.message);
    res.status(500).send("Error interno del servidor");
  }
  }
);
