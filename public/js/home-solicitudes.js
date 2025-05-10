// Función para formatear la fecha
import { formatearFecha } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // cargar información de solicitudes
  const tablaSolicitudesActivas = document.getElementById('solicitudes-activas-table');
  const tablaSolicitudesCompletadas = document.getElementById('solicitudes-completadas-table');
  const cardSolicActivas = document.getElementById('solicitudes-activas');
  const cardSolicCompletadasHoy = document.getElementById('solicitudes-completadas-hoy');

  loadSolicitudes(tablaSolicitudesActivas, tablaSolicitudesCompletadas, cardSolicActivas, cardSolicCompletadasHoy);
});

// Función para cargar solicitudes
const loadSolicitudes = async (tablaActivas, tablaCompletadas, cardActivas, cardCompletadasHoy) => {
  try {
    const response = await fetch(`/api/solicitudes`);
    if (!response.ok) {
      throw new Error('Error al cargar las solicitudes. Leyendo /api/solicitudes'); 
    }
    const data = await response.json();
    const solicitudesActivas = data.solicitudesActivas;
    const solicitudesCompletadas = data.solicitudesCompletadas;
    const solicitudesCompletadasHoy = data.solicitudesCompletadasHoy;

    // Asignamos la información de las card
    cardActivas.innerHTML = solicitudesActivas.length || 0;
    cardCompletadasHoy.innerHTML = solicitudesCompletadasHoy || 0;
    // Limpiar la tabla antes de agregar nuevas filas
    tablaActivas.innerHTML = '';
    tablaCompletadas.innerHTML = '';

    // Agregar filas a la tabla solicitudes activas
    solicitudesActivas.forEach((solicitud) => {
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
        <td>${solicitud.destinatario.ddtNombre}</td>
        <td><span class="tag ${color}">${solicitud.estado.eneEstado}</span></td>
        <td class="has-text-centered">
          <a href="/solicitudes/detalle-solicitudes/${solicitud.dsoId}/${origin}" class="has-text-primary" title="Ver detalles">
            <i class="fas fa-arrow-right"></i>
          </a>
        </td>
      `;
      tablaActivas.appendChild(row);
    });

    // Agregar filas a la tabla solicitudes completadas
    solicitudesCompletadas.forEach((solicitud) => {
      const row = document.createElement('tr');
    
      row.innerHTML = `
        <td>${solicitud.dsoId}</td>
        <td>${solicitud.destinatario.ddtNombre}</td>
        <td>${formatearFecha(solicitud.gestion.dgoFchEntrega)}</td>
        <td class="has-text-centered">
          <a href="/solicitudes/detalle-solicitudes/${solicitud.dsoId}/${origin}" class="has-text-primary" title="Ver detalles">
            <i class="fas fa-arrow-right"></i>
          </a>
        </td>
      `;
      tablaCompletadas.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar las solicitudes. home-solicitudes:', error.message);
  }
};