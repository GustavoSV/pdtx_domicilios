import { Manager } from "./Manager.js";

export class GestionManager extends Manager {
  constructor(db) {
    super(db.dom_domicilios); // modelo de la base de datos
  }
};