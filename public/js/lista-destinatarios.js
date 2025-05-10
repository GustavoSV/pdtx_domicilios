let searchTerm = ''; // Término de búsqueda

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('destinatarios-table-body');
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
    
    loadDestinatarios(1); // Reiniciar la paginación al buscar
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
        text: `Esta acción eliminará el Destinatario con ID: ${id}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (isConfirmed) {
        try {
          const response = await fetch(`/api/destinatarios/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error('Error al eliminar el destinatario');
          }

          Swal.fire({
            icon: 'success',
            title: 'Destinatario eliminado',
            text: `El destinatario con ID: ${id} ha sido eliminado correctamente.`,
          }).then(() => {
            window.location.reload(); // Recargar la página
          });
        } catch (error) {
          console.error('lista-destinatarios - Error al eliminar el destinatario:', error.message);
        }
      }
      return; // Salir del listener después de manejar el evento
    }

    // Manejar el botón "Editar"
    const editarButton = event.target.closest('.boton-editar');
    if (editarButton) {
      const id = editarButton.dataset.id;
      
      window.location.href = `/destinatarios/form-destinatarios/${id}`;
    }
  });

  // Función para cargar los destinatarios
  const loadDestinatarios = async (page = 1) => {
    try {
      const size = 10;
      const queryParams = new URLSearchParams({
        page,
        pageSize: size,
        searchTerm, // Enviar el término de búsqueda al backend
      }).toString();
      console.log('loadDestinatarios - queryParams:', queryParams);
      
      
      const response = await fetch(`/api/destinatarios/lista-destinatarios?${queryParams}`, {
        headers: { Cookie: document.cookie },
      });
      const destinatarios = await response.json();
      
      // Limpiar la tabla
      tableBody.innerHTML = '';

      // Renderizar los destinatarios
      destinatarios.data.forEach((elemento) => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${elemento.ddtId}</td>
          <td>${elemento.ddtNombre}</td>
          <td>${elemento.ddtDireccion}</td>
          <td>${elemento.barrio.gbrNombre}</td>
          <td>${elemento.ddtTelefono}</td>
          <td>
            <button class="boton-editar button is-small is-warning" data-id="${elemento.ddtId}"><span class="icon"><i class="fas fa-edit"></i></span></button>

            ${elemento.totalSolicitudes === 0
              ? `<button class="boton-eliminar button is-small is-danger" data-id="${elemento.ddtId}"><span class="icon"><i class="fas fa-cancel"></i></span></button>`
              : ''
            }
          </td>
        `;

        tableBody.appendChild(row);
      });

      // Actualizar la paginación
      currentPage = destinatarios.pagination.page;
      totalPages = destinatarios.pagination.totalPages;
      prevPageButton.disabled = !destinatarios.pagination.previousPage;
      nextPageButton.disabled = !destinatarios.pagination.afterPage;

      // Mostrar información de paginación
      paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    } catch (error) {
      console.error('Error al cargar los destinatarios:', error.message);
    }
  };

  // Cargar la primera página
  loadDestinatarios(currentPage);

  // Manejar la paginación
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      loadDestinatarios(currentPage - 1);
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      loadDestinatarios(currentPage + 1);
    }
  });
});