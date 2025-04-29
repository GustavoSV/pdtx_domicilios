  // Convertir los arrays de objetos en campos normales por tratarse de una relación 1:1
  export const convertirSolicitudes = (data) => {
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