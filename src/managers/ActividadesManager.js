import { Manager } from "./Manager.js";

export class ActividadesManager extends Manager {
  constructor(db) {
    super(db.dom_actividades); // modelo de la base de datos
  }
};
