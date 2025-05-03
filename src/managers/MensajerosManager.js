import { Manager } from './Manager.js';

export class MensajerosManager extends Manager {
  constructor(db) {
    super(db.dom_mensajeros); // modelo de la base de datos
  }

  async getMensajerosPaginate(options = {}) {
    try {
      const { page = 1, pageSize = 20, searchTerm = ''} = options;
      // Construir el filtro de búsqueda
      const isNumeric = (value) => !isNaN(parseInt(value)) && isFinite(value);
      const where = {
        OR: [
          { msjId: isNumeric(searchTerm) ? { equals: parseInt(searchTerm) } : undefined },
          { msjNombre: { contains: searchTerm } },
        ].filter(Boolean), // Eliminar filtros inválidos
      };

      // Consulta paginada de los Mensajeros
      const mensajeros = await this.getPaginate({
        page,
        pageSize,
        where, 
        include: {
          _count: {
            select: {
              gestiones: true
            }
          }
        },
        orderBy: {
          msjNombre: 'asc'
        },
      });

      // // Agregar el total de solicitudes a cada destinatario
      mensajeros.data = mensajeros.data.map(mensajero => ({
        ...mensajero,
        totalSolicitudes: mensajero._count.gestiones || 0, // Asignar 0 si no hay solicitudes
      }));
      
      return mensajeros;
    } catch (error) {
      console.error('MensajerosManager - Error al obtener los Mensajeros paginados:', error.message);
      throw error;
    }
  }
}
