import { Manager } from './Manager.js';

export class BarriosManager extends Manager {
  constructor(db) {
    super(db.gen_barrios); // modelo de la base de datos
  }

  async getBarriosByCiudad(codCiudad) { // este método no está en el Manager general
    const barrios = await this.getAll(
      { // where
        gbrCodCiudad: codCiudad,
      },
      {  // include
        ciudades: {
          select: {
            ciuNombre: true
          }
        },
      },
      { // orderBy
        gbrNombre: "asc"
      }
    )
    return barrios;
  }
}