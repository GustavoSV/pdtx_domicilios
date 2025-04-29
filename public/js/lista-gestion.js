import { formatearFecha } from './utils.js';

let searchTerm = ''; // Término de búsqueda
let currentPage = 1;
let totalPages = 1;
let estadoActual = 'SO'; // Estado inicial

document.addEventListener('DOMContentLoaded', () => {
  // obtener elementos a cargar
  const elementosTabs = document.querySelectorAll('.tabs li');
  const tablaSolicitudes = document.getElementById('solicitudes-table-body');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const paginationInfo = document.getElementById('pagination-info');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const columnaVrble = document.getElementById('colVariable');
  const botonGestionar = document.getElementById('boton-gestionar');

  // Manejar la búsqueda
  searchButton.addEventListener('click', () => {
    searchTerm = searchInput.value.trim();
    
    loadSolicitudes(1, estadoActual); // Reiniciar la paginación al buscar
  });

  tablaSolicitudes.addEventListener('click', async (event) => {
    // Manejar el botón "Gestionar"
    const gestionarButton = event.target.closest('.boton-gestionar');
    if (gestionarButton) {
      const idSolicitud = gestionarButton.dataset.id;

      // Redirigir a la página de gestión de la solicitud
      window.location.href = `/gestion/form-gestion/${idSolicitud}`;
    }
  });

  elementosTabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      // eliminar la clase 'active' de todos los tabs
      elementosTabs.forEach((t) => t.classList.remove('is-active'));
      // agregar la clase 'active' al tab seleccionado
      event.currentTarget.classList.add('is-active');

      // obtener el id del tab seleccionado
      estadoActual = event.currentTarget.getAttribute('data-estado'); 
      searchTerm = searchInput.value.trim(); // Obtener el término de búsqueda actual  

      loadSolicitudes(1, estadoActual);
    });
  });

  const loadSolicitudes = async (page = 1, estado) => {
    try {
      if (estado === 'SO') {
        columnaVrble.innerHTML = 'Dirección, Barrio';
      }
      else if (estado === 'EP') {
        columnaVrble.innerHTML = 'Mensajero';
      }
      else {
        columnaVrble.innerHTML = 'Fecha de Entrega';
      }
      const size = 10;
      const queryParams = new URLSearchParams({
        page,
        pageSize: size,
        estado, // Enviar el estado al backend
        searchTerm, // Enviar el término de búsqueda al backend
      }).toString();
      
      const response = await fetch(`/api/gestion/solicitudes-estado?${queryParams}`, {
        headers: { Cookie: document.cookie },
      });
      const data = await response.json();
      // limpiar la tabla antes de cargar nuevos datos
      tablaSolicitudes.innerHTML = '';

      // renderizar las solicitudes
      data.data.forEach((solicitud) => {
        const row = document.createElement('tr');
        let color = '';
        let colVariable = '';
        let botonGestionar = '';
        if (estado === 'SO') {
          colVariable = `${solicitud.dsoDireccion}, ${solicitud.barrio?.gbrNombre}`;
          botonGestionar = `<button class="boton-gestionar button is-small is-warning" data-id="${solicitud.dsoId}"><span class="icon"><i class="fas fa-edit"></i></span></button>`;
        } else if (estado === 'EP') {
          colVariable = solicitud.gestion?.mensajero.msjNombre;
          botonGestionar = `<button class="boton-gestionar button is-small is-warning" data-id="${solicitud.dsoId}"><span class="icon"><i class="fas fa-edit"></i></span></button>`;
        } else {
          colVariable = formatearFecha(solicitud.gestion?.dgoFchEntrega);
        }

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
          <td>${formatearFecha(solicitud.dsoFchSolicitud)}</td>
          <td>${colVariable}</td>
          <td><span class="tag ${color}">${solicitud.estado.eneEstado}</span></td>
          <td class="has-text-centered">
            <a href="/solicitudes/detalle-solicitudes/${solicitud.dsoId}" class="has-text-primary">
              <i class="fas fa-arrow-right"></i>
            </a>
          </td>
          <td>${botonGestionar}</td>
        `;

        tablaSolicitudes.appendChild(row);
      });
      // Actualizar la paginación
      currentPage = data.pagination.page;
      totalPages = data.pagination.totalPages;
      prevPageButton.disabled = !data.pagination.previousPage;
      nextPageButton.disabled = !data.pagination.afterPage;

      // Mostrar información de paginación
      paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;

    } catch (error) {
      console.error('Error al cargar las solicitudes:', error);
    }
  }

  loadSolicitudes(currentPage, estadoActual);

  // Manejar la paginación
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      loadSolicitudes(currentPage - 1, estadoActual);
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      loadSolicitudes(currentPage + 1, estadoActual);
    }
  });
});