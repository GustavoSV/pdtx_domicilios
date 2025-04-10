import { Manager } from "./Manager.js";
import { validarRelacion } from "../utils/databaseValidators.js"; // Importar la función de validación

export class SolicitudesManager extends Manager {
  constructor(db) {
    super(db.dom_solicitudes); // modelo de la base de datos
    this.prisma = db;
  }

  // aquí la extensión de la clase
  async getSolicitudesActivas(userId) { // este método no está en el Manager general
    const activas = await this.getAll(
      { // where
        dsoCodUsuario: userId,
        dsoCodEstado: {
          in: ["EP", "SO"]
        }
      },
      {  // include
        destinatario: {
          select: {
            ddtNombre: true
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
        }
      },
      { // orderBy
        dsoFchSolicitud: "desc"
      }
    )
    return this.convertirSolicitudes(activas);
  };

  async getSolicitudesCompletadas(userId) { // este método no está en el Manager general
    const completadas = await this.getAll(
      { // where
        dsoCodUsuario: userId,
        dsoCodEstado: {
          in: ["AU", "ET", "PA"]
        }
      },
      { // include
        destinatario: {
          select: {
            ddtNombre: true
          }
        },
        estado: {
          select: {
            eneEstado: true
          }
        },
        gestion: {
          include: {
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
        }
      },
      { // orderBy
        dsoFchSolicitud: "desc"
      })
    
    return this.convertirSolicitudes(completadas);
  };

  async getObtenerSolicitudPorId(id) { // este método no está en el Manager general
    const solicitud = await this.getUnique(
      { // where
        dsoId: parseInt(id)
      },
      { // include
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
        barrio: {
          select: {
            gbrNombre: true,
            gbrCodCiudad: true
          }
        },
        gestion: {
          select: {
            dgoValor: true,
            dgoVrAdicional: true,
            dgoFchEntrega: true,
            dgoCodCentroC: true,
            dgoCodMensajero: true,
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
      }
    );
    return this.convertirSolicitudes(solicitud);
  };

  async getMisSolicitudes(userId, options = {}) {
    try {
      const { page = 1, pageSize = 20, searchTerm = ''} = options;

      // Construir el filtro de búsqueda
      const isNumeric = (value) => !isNaN(parseInt(value)) && isFinite(value);

      const where = {
        dsoCodUsuario: userId,
        OR: [
          { dsomId: isNumeric(searchTerm) ? { equals: parseInt(searchTerm) } : undefined },
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
  
      // Consulta paginada de las solicitudes del usuario
      const result = await this.getPaginate({
        page,
        pageSize,
        where, 
        include: {
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
      
      const dataConvertida = this.convertirSolicitudes(result.data);
      result.data = dataConvertida;

      return result;
    } catch (error) {
      console.error('Error al obtener las solicitudes del usuario:', error.message);
      throw error;
    }
  }

  // Crear una nueva solicitud
  async postNuevaSolicitud(data, userId) {
    if (!userId) {
      throw new Error('No se proporcionó el ID del usuario');
    }

    try {
      const contextInfo = 'SolicitudesManager.postNuevaSolicitud';
      
      // Validar todas las relaciones
      await validarRelacion(this.prisma, 'dom_actividades', 'dacCodigo', data.dsoCodActividad, contextInfo);
      await validarRelacion(this.prisma, 'dom_destinatarios', 'ddtId', data.dsoCodDestinatario, contextInfo);
      await validarRelacion(this.prisma, 'gen_barrios', 'gbrCodigo', data.dsoCodBarrio, contextInfo);
      await validarRelacion(this.prisma, 'enum_estados', 'eneCodigo', data.dsoCodEstado, contextInfo);

      // Construir el objeto de datos con las relaciones usuario, destinatario, barrio, actividad, estado usando CONNECT
      const recordData = {
        usuario: {
          connect: { usuUsuario: userId }, // Conectar con el usuario existente
        },
        actividad: {
          connect: { dacCodigo: data.dsoCodActividad }, // Conectar con la actividad existente
        },
        destinatario: {
          connect: { ddtId: parseInt(data.dsoCodDestinatario) }, // Conectar con el destinatario existente
        },
        barrio: {
          connect: { gbrCodigo: data.dsoCodBarrio }, // Conectar con el barrio existente
        },
        estado: {
          connect: { eneCodigo: data.dsoCodEstado }, // Conectar con el estado existente
        },
        dsoDireccion: data.dsoDireccion,
        dsoTelefono: data.dsoTelefono || null, // Permitir teléfono vacío
        dsoInstrucciones: data.dsoInstrucciones || null, // Permitir instrucciones vacías
        dsoFchSolicitud: data.dsoFchSolicitud || new Date().toISOString(), // Usar fecha actual si no se proporciona
      };
      
      // Crear el registro
      const nuevaSolicitud = await this.model.create({
        data: recordData,
      });

      return nuevaSolicitud;
    } catch (error) {
      console.error('SolicitudesManager - Error al crear la solicitud:', error.message);
      throw error;
    }
  }

  // Convertir los arrays de objetos en campos normales por tratarse de una relación 1:1
  convertirSolicitudes(data) {
    const convertirUnaSolicitud = (solicitud) => {
      return {
        ...solicitud,
        dataGestion: solicitud.gestion && solicitud.gestion.length > 0 ? {
          dgoId: solicitud.gestion[0].dgoId,
          dgoFchEntrega: solicitud.gestion[0].dgoFchEntrega,
          dgoValor: solicitud.gestion[0].dgoValor,
          dgoVrAdicional: solicitud.gestion[0].dgoVrAdicional,
          centroscosto: {
            cctCodigo: solicitud.gestion[0].centroscosto?.cctCodigo,
            cctNombreCC: solicitud.gestion[0].centroscosto?.cctNombreCC,
            cctCodUEN: solicitud.gestion[0].centroscosto?.cctCodUEN
          },
          mensajero: {
            msjCodigo: solicitud.gestion[0].mensajero?.msjCodigo,
            msjNombre: solicitud.gestion[0].mensajero?.msjNombre
          }
        } : null
      };
    };

    // Comprobar si data es un array o un objeto individual
    if (Array.isArray(data)) {
      return data.map(solicitud => convertirUnaSolicitud(solicitud));
    } else if (data && typeof data === 'object') {
      return convertirUnaSolicitud(data);
    } else {
      return data; // Si no es array ni objeto, devolver tal cual
    }
  }
};