import { Manager } from "./Manager.js";
import { validarRelacion } from "../utils/databaseValidators.js"; // Importar la función de validación

export class DestinatariosManager extends Manager {
  constructor(db) {
    super(db.dom_destinatarios); // modelo de la base de datos
    this.prisma = db;
  }

  async getDestinatarioxId(id) {
    try {
      const destinatario = await this.getUnique(
        { 
          ddtId: parseInt(id) 
        },
        { 
          barrio: {
            select: {
              gbrNombre: true,
              gbrCodCiudad: true
            }
          },
        },
      );

      return destinatario;
    } catch (error) {
      console.error('DestinatariosManager - Error al obtener el destinatario por ID:', error.message);
      throw error;
    }
  };

  async getDestinatariosPaginate(options = {}) {
    try {
      const { page = 1, pageSize = 20, searchTerm = ''} = options;
      // Construir el filtro de búsqueda
      const isNumeric = (value) => !isNaN(parseInt(value)) && isFinite(value);
      const where = {
        OR: [
          { ddtId: isNumeric(searchTerm) ? { equals: parseInt(searchTerm) } : undefined },
          { ddtNombre: { contains: searchTerm } },
        ].filter(Boolean), // Eliminar filtros inválidos
      };

      // Consulta paginada de las solicitudes del usuario
      const destinatarios = await this.getPaginate({
        page,
        pageSize,
        where, 
        include: {
          barrio: {
            select: {
              gbrNombre: true,
            },
          },
          _count: {
            select: {
              solicitudes: true
            }
          }
        },
        orderBy: {
          ddtNombre: 'asc'
        },
      });

      // CUALQUIERA DE ESTAS 2 OPCIONES FUNCIONAN PARA ASIGNAR EL TOTAL DE SOLICITUDES
      // destinatarios.data.forEach(destinatario => {
      //   destinatario.totalSolicitudes = destinatario._count.solicitudes || 0; // Asignar 0 si no hay solicitudes
      // });

      // // Agregar el total de solicitudes a cada destinatario
      destinatarios.data = destinatarios.data.map(destinatario => ({
        ...destinatario,
        totalSolicitudes: destinatario._count.solicitudes || 0, // Asignar 0 si no hay solicitudes
      }));
      
      return destinatarios;
    } catch (error) {
      console.error('DestinatariosManager - Error al obtener los destinatarios paginados:', error.message);
      throw error;
    }
  }

  async postNuevoDestinatario(data) {
    try {
      const contextInfo = 'DestinatariosManager.postNuevoDestinatario';
      
      // Validar todas las relaciones
      await validarRelacion(this.prisma, 'gen_barrios', 'gbrCodigo', data.ddtCodBarrio, contextInfo);

      // Construir el objeto de datos con la relacion barrio usando CONNECT
      const recordData = {
        barrio: {
          connect: { gbrCodigo: data.ddtCodBarrio }, // Conectar con el barrio existente
        },
        ddtNombre: data.ddtNombre,
        ddtDireccion: data.ddtDireccion,
        ddtTelefono: data.ddtTelefono || null, // Permitir teléfono vacío
      };
      
      // Crear el registro
      const nuevoDestinatario = await this.model.create({
        data: recordData,
      });

      return nuevoDestinatario;      
    } catch (error) {
      console.error('DestinatariosManager - Error al crear un nuevo destinatario:', error.message);
      throw error;
    }
  }
};