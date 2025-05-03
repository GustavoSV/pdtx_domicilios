import { Manager } from "./Manager.js";

export class CentroscostoManager extends Manager { 
  constructor(db) {
    super(db.con_centroscosto); // modelo de la base de datos
  }
}