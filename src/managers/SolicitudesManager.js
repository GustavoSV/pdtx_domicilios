import { Manager } from "./Manager.js";
import { convertirSolicitudes } from "../utils/convertirSolicitudes.js";  // Importar la función de conversión
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
        }
      },
      { // orderBy
        dsoFchSolicitud: "desc"
      }
    )
    return convertirSolicitudes(activas);
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
    
    return convertirSolicitudes(completadas);
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
      }
    );
    return convertirSolicitudes(solicitud);
  };

  async getMisSolicitudes(userId, options = {}) {
    try {
      const { page = 1, pageSize = 20, searchTerm = ''} = options;

      // Construir el filtro de búsqueda
      const isNumeric = (value) => !isNaN(parseInt(value)) && isFinite(value);

      const where = {
        dsoCodUsuario: userId,
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
          connect: { usuId: parseInt(userId) }, // Conectar con el usuario existente
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

  // Manejo de las solcitudes provenientes de la GESTION
  async getGestionSolicitudesRecientes() { 
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

  async getGestionSolicitudesPorEstado(estado, options = {}) { 
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

  async getGestionSolicitudPorId(id) { 
    const solicitud = await this.getUnique(
      { // where
        dsoId: parseInt(id)
      },
      { // include
        usuario: {
          select: {
            usuNombre: true
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
        barrio: {
          select: {
            gbrNombre: true,
            gbrCodCiudad: true
          }
        },
        gestion: {
          select: {
            dgoId: true,
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
      }
    );
    return convertirSolicitudes(solicitud);
  };
};