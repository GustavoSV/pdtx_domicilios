import { Manager } from "./Manager.js";
import { convertirSolicitudes } from '../../src/utils/convertirSolicitudes.js';

export class GestionManager extends Manager {
  constructor(db) {
    super(db.dom_solicitudes); // modelo de la base de datos
  }

  async getSolicitudesRecientes() { 
    const recientes = await this.getAllSelect(
      { // select
        dsoId: true,
        dsoCodUsuario: true,
        dsoCodEstado: true,
        dsoFchSolicitud: true,
        dsoDireccion: true,
        dsoTelefono: true,
        dsoInstrucciones: true,
        dsoCodActividad: true,
        dsoCodDestinatario: true,
        dsoCodBarrio: true,

        usuario: {
          select: {
            usuUsuario: true,
            usuNombre: true
          }
        },
        destinatario: {
          select: {
            ddtNombre: true
          }
        },
        barrio: {
          select: {
            gbrNombre: true,
            gbrCodCiudad: true
          }
        },
        estado: {
          select: {
            eneEstado: true
          }
        },
      },
      { // where
        dsoCodEstado: {
          in: ["SO", "EP", "ET", "AN"]
        },
      },
     // orderBy cuando son varios campos, se usa un ARRAY de objetos
        [
          { dsoFchSolicitud: 'desc' }, // Ordenar por fecha de solicitud de forma descendente
          { dsoId: 'desc' } // Ordenar por ID de solicitud de forma descendente
        ]
//      }
    )
    return convertirSolicitudes(recientes);
  };

  async getSolicitudesPorEstado(estado, options = {}) { 
    try {
      const { page = 1, pageSize = 10, searchTerm = '' } = options; // Número de página y tamaño de página

      if (!estado) {
        throw new Error('El estado no puede ser nulo o indefinido');
      }
      
      // Construir el filtro de búsqueda
      const isNumeric = (value) => !isNaN(parseInt(value)) && isFinite(value);
  
      const where = {
        ...(estado !== 'TODAS' ? { dsoCodEstado: estado } : {}),
        OR: [
          { dsoId: isNumeric(searchTerm) ? { equals: parseInt(searchTerm) } : undefined },
          { 
            destinatario: {
              ddtNombre: { contains: searchTerm },
            }
          },
          {
            actividad: {
              dacDescripcion: { contains: searchTerm }, 
            },
          },
          {
            estado: {
              eneEstado: { contains: searchTerm }, 
            },
          },
        ].filter(Boolean), // Eliminar filtros inválidos
      };

      const result = await this.getPaginate({
        page,
        pageSize,
        where, 
        include: {
          usuario: {
            select: {
              usuNombre: true
            }
          },
          barrio: {
            select: {
              gbrNombre: true,
            }
          },
          destinatario: {
            select: {
              ddtNombre: true
            }
          },
          actividad: {
            select: {
              dacDescripcion: true
            }
          },
          estado: {
            select: {
              eneEstado: true
            }
          },
          gestion: {
            select: {
              dgoValor: true,
              dgoVrAdicional: true,
              dgoFchEntrega: true,
              dgoCodCentroC: true,
              dgoCodMensajero: true,
              dgoObservaciones: true,
              centroscosto: {
                select: {
                  cctNombreCC: true,
                  cctCodUEN: true
                }
              },
              mensajero: {
                select: {
                  msjNombre: true
                }
              }
            }
          },
        },
        orderBy: { dsoFchSolicitud: 'desc' }, // Ordenar por fecha de solicitud descendente
      });
      
      const dataConvertida = convertirSolicitudes(result.data);
      result.data = dataConvertida;

      return result;
    } catch (error) {
      console.error("Error al obtener las solicitudes por estado:", error);
      throw error; // Propagar el error para que pueda ser manejado por el llamador
    }
  };

};