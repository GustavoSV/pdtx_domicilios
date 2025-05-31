import { Manager } from "./Manager.js";
import { convertirSolicitudes } from '../../src/utils/convertirSolicitudes.js';
import { validarRelacion } from "../utils/databaseValidators.js"; // Importar la función de validación

export class GestionManager extends Manager {
  constructor(db) {
    super(db.dom_gestion); // modelo de la base de datos
    this.prisma = db;
  }

  async postCrearGestion(data) {
    try {
      const contextInfo = 'GestionManager.postCrearGestion';
      
      // Validar todas las relaciones
      await validarRelacion(this.prisma, 'dom_solicitudes', 'dsoId', data.dgoIdSolicitud, contextInfo);
      await validarRelacion(this.prisma, 'dom_mensajeros', 'msjCodigo', data.dgoCodMensajero, contextInfo);
      // await validarRelacion(this.prisma, 'con_centroscosto', 'cctCodigo', data.dgoCodCentroC, contextInfo);

      // Construir el objeto de datos con las relaciones usuario, destinatario, barrio, actividad, estado usando CONNECT
      const recordData = {
        solicitud: {
          connect: { dsoId: parseInt(data.dgoIdSolicitud) }, // Conectar con la solicitud existente
        },
        mensajero: {
          connect: { msjCodigo: parseInt(data.dgoCodMensajero) }, // Conectar con el barrio existente
        },
        // centroscosto: {
        //   connect: { cctCodigo: data.dgoCodCentroC }, // Conectar con el estado existente
        // },
        dgoCodCentroC: data.dgoCodCentroC || null, // ahora lo pasamos como un dato suelto
        dgoObservaciones: data.dgoObservaciones || null, // Permitir observaciones vacías
      };
      // Crear el registro
      const nuevaGestion = await this.model.create({
        data: recordData,
      });
      
      return nuevaGestion;
    } catch (error) {
      console.error('Error al crear la gestión:', error.message);
      throw error; // Propagar el error para que pueda ser manejado por el llamador
    }
  }

  async putActualizarGestion(where, data) {
    try {
      const contextInfo = 'GestionManager.postCrearGestion';
      
      // Validar todas las relaciones
      await validarRelacion(this.prisma, 'dom_solicitudes', 'dsoId', data.dgoIdSolicitud, contextInfo);
      await validarRelacion(this.prisma, 'dom_mensajeros', 'msjCodigo', data.dgoCodMensajero, contextInfo);
      await validarRelacion(this.prisma, 'con_centroscosto', 'cctCodigo', data.dgoCodCentroC, contextInfo);

      // Construir el objeto de datos a modificar
      const recordData = {
        solicitud: {
          connect: { dsoId: parseInt(data.dgoIdSolicitud) }, // Conectar con la solicitud existente
        },
        mensajero: {
          connect: { msjCodigo: parseInt(data.dgoCodMensajero) }, // Conectar con el barrio existente
        },
        // centroscosto: {
        //   connect: { cctCodigo: data.dgoCodCentroC }, // Conectar con el estado existente
        // },
        dgoCodCentroC: data.dgoCodCentroC || null, // ahora lo pasamos como un dato suelto
        dgoFchEntrega: data.dgoFchEntrega || new Date().toISOString(),
        dgoValor: data.dgoValor || null,
        dgoVrAdicional: data.dgoVrAdicional || null,
        dgoObservaciones: data.dgoObservaciones || null, // Permitir observaciones vacías
      };
      // Actualizar el registro
      const actualizaGestion = await this.model.update({
        where,
        data: recordData,
      });
      return actualizaGestion;
    } catch (error) {
      console.error('Error al modificar la gestión:', error.message);
      throw error; // Propagar el error para que pueda ser manejado por el llamador
    }
  }
};