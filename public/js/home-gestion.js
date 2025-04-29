// Función para formatear la fecha
import { formatearFecha } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // obtener elementos a cargar
  const solicitudesPendientes = document.getElementById('solicitudes-pendientes');
  const solicitudesEnProceso = document.getElementById('solicitudes-en-proceso');
  const solicitudesCompletadasHoy = document.getElementById('solicitudes-completadas-hoy');
  const solicitudesRecientesTabla = document.getElementById('solicitudes-recientes-table');

  loadSolicitudes(solicitudesPendientes, solicitudesEnProceso, solicitudesCompletadasHoy, solicitudesRecientesTabla);
});

const loadSolicitudes = async (solicitudesPendientes, solicitudesEnProceso, solicitudesCompletadasHoy, solicitudesRecientesTabla) => {
  try {
    const response = await fetch(`/api/gestion`);
    if (!response.ok) {
      throw new Error('Error al cargar las solicitudes. Leyendo /api/gestion'); 
    }
    const data = await response.json();
    const solicitudesPendientesData = data.solicitudesPendientes;
    const solicitudesEnProcesoData = data.solicitudesEnProceso;
    const solicitudesCompletadasHoyData = data.solicitudesCompletadasHoy;
    const solicitudesRecientesData = data.recientesSerializadas;

    solicitudesPendientes.innerHTML = solicitudesPendientesData;
    solicitudesEnProceso.innerHTML = solicitudesEnProcesoData;  
    solicitudesCompletadasHoy.innerHTML = solicitudesCompletadasHoyData;

    // Limpiar la tabla antes de agregar nuevas filas
    solicitudesRecientesTabla.innerHTML = '';

    // Agregar filas a la tabla solicitudes recientes
    solicitudesRecientesData.forEach((solicitud) => {
      const row = document.createElement('tr');
      let color = '';
      if (solicitud.dsoCodEstado === 'SO') {
        color = 'is-danger';
      } else if (solicitud.dsoCodEstado === 'EP') {
        color = 'is-info';
      } else if (solicitud.dsoCodEstado === 'ET') {
        color = 'is-success';
      }
      
      row.innerHTML = `
        <td>${solicitud.dsoId}</td>
        <td>${solicitud.usuario.usuNombre}</td>
        <td>${solicitud.destinatario.ddtNombre}</td>
        <td>${solicitud.dsoDireccion}, ${solicitud.barrio.gbrNombre}</td>
        <td><span class="tag ${color}">${solicitud.estado.eneEstado}</span></td>
        <td class="has-text-centered">
          <a href="/solicitudes/detalle-solicitudes/${solicitud.dsoId}" class="has-text-primary" title="Ver detalles">
            <i class="fas fa-arrow-right"></i>
          </a>
        </td>
      `;
      solicitudesRecientesTabla.appendChild(row);
    });

  } catch (error) {
    console.error('Error al cargar las solicitudes. home-gestion:', error.message);
  }
};