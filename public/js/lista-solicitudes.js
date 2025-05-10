// public/js/mis-solicitudes.js
import { formatearFecha } from './utils.js';

let searchTerm = ''; // Término de búsqueda

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('solicitudes-table-body');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const paginationInfo = document.getElementById('pagination-info');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  let currentPage = 1;
  let totalPages = 1;

  // Manejar la búsqueda
  searchButton.addEventListener('click', () => {
    searchTerm = searchInput.value.trim();
    
    loadSolicitudes(1); // Reiniciar la paginación al buscar
  });

  // Event delegation para los botones de Editar y Eliminar
  tableBody.addEventListener('click', async (event) => {
    // Manejar el botón "Eliminar"
    const eliminarButton = event.target.closest('.boton-eliminar');
    if (eliminarButton) {
      const id = eliminarButton.dataset.id;

      // Mostrar SweetAlert2 para confirmar eliminación
      const { isConfirmed } = await Swal.fire({
        title: '¿Estás seguro?',
        text: `Esta acción eliminará la solicitud con ID: ${id}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (isConfirmed) {
        try {
          const response = await fetch(`/api/solicitudes/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            // headers: { Cookie: document.cookie },
          });

          if (!response.ok) {
            throw new Error('Error al eliminar la solicitud');
          }

          Swal.fire({
            icon: 'success',
            title: 'Solicitud eliminada',
            text: `La solicitud con ID: ${id} ha sido eliminada correctamente.`,
          }).then(() => {
            window.location.reload(); // Recargar la página
          });
        } catch (error) {
          console.error('lista-solicitudes - Error al eliminar la solicitud:', error.message);
        }
      }
      return; // Salir del listener después de manejar el evento
    }

    // Manejar el botón "Editar"
    const editarButton = event.target.closest('.boton-editar');
    if (editarButton) {
      const id = editarButton.dataset.id;
      
      window.location.href = `/solicitudes/form-solicitudes/${id}/${origin}`; // Redirigir a la página de edición
    }
  });

  // Función para cargar las solicitudes
  const loadSolicitudes = async (page = 1) => {
    try {
      const size = 10;
      const queryParams = new URLSearchParams({
        page,
        pageSize: size,
        searchTerm, // Enviar el término de búsqueda al backend
      }).toString();
      
      const response = await fetch(`/api/solicitudes/lista-solicitudes?${queryParams}`, {
        headers: { Cookie: document.cookie },
      });
      const data = await response.json();
      
      // Limpiar la tabla
      tableBody.innerHTML = '';

      // Renderizar las solicitudes
      data.data.forEach((solicitud) => {
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
          <td>${solicitud.actividad.dacDescripcion}</td>
          <td>${solicitud.destinatario.ddtNombre}</td>
          <td><span class="tag ${color}">${solicitud.estado.eneEstado}</span></td>
          <td>${formatearFecha(solicitud.dsoFchSolicitud)}</td>
          <td>${solicitud.gestion?.dgoFchEntrega ? formatearFecha(solicitud.gestion.dgoFchEntrega) : '-'}</td>
          <td class="has-text-centered">
            <a href="/solicitudes/detalle-solicitudes/${solicitud.dsoId}/${origin}" class="has-text-primary">
              <i class="fas fa-arrow-right"></i>
            </a>
          </td>
          <td>
            ${solicitud.dsoCodEstado === 'SO'
              ? `<button class="boton-editar button is-small is-warning" data-id="${solicitud.dsoId}"><span class="icon"><i class="fas fa-edit"></i></span></button>`
              : ''
            }

            ${solicitud.dsoCodEstado === 'SO'
              ? `<button class="boton-eliminar button is-small is-danger" data-id="${solicitud.dsoId}"><span class="icon"><i class="fas fa-cancel"></i></span></button>`
              : ''
            }
          </td>
        `;

        tableBody.appendChild(row);
      });

      // Actualizar la paginación
      currentPage = data.pagination.page;
      totalPages = data.pagination.totalPages;
      prevPageButton.disabled = !data.pagination.previousPage;
      nextPageButton.disabled = !data.pagination.afterPage;

      // Mostrar información de paginación
      paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    } catch (error) {
      console.error('Error al cargar las solicitudes:', error.message);
    }
  };

  // Cargar la primera página
  loadSolicitudes(currentPage);

  // Manejar la paginación
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      loadSolicitudes(currentPage - 1);
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      loadSolicitudes(currentPage + 1);
    }
  });

});