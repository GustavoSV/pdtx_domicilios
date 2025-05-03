let searchTerm = ''; // Término de búsqueda

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('mensajeros-table-body');
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
    
    loadMensajeros(1); // Reiniciar la paginación al buscar
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
        text: `Esta acción eliminará el Mensajero con ID: ${id}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });

      if (isConfirmed) {
        try {
          const response = await fetch(`/api/mensajeros/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });

          if (!response.ok) {
            throw new Error('Error al eliminar el mensajero');
          }

          Swal.fire({
            icon: 'success',
            title: 'Mensajero eliminado',
            text: `El mensajero con ID: ${id} ha sido eliminado correctamente.`,
          }).then(() => {
            window.location.reload(); // Recargar la página
          });
        } catch (error) {
          console.error('lista-mensajeros - Error al eliminar el mensajero:', error.message);
        }
      }
      return; // Salir del listener después de manejar el evento
    }

    // Manejar el botón "Editar"
    const editarButton = event.target.closest('.boton-editar');
    if (editarButton) {
      const id = editarButton.dataset.id;
      
      window.location.href = `/mensajeros/form-mensajeros/${id}`;
    }
  });

  // Función para cargar los mensajeros
  const loadMensajeros = async (page = 1) => {
    try {
      const size = 10;
      const queryParams = new URLSearchParams({
        page,
        pageSize: size,
        searchTerm, // Enviar el término de búsqueda al backend
      }).toString();
      
      const responseM = await fetch(`/api/mensajeros/paginate?${queryParams}`, {
        headers: { Cookie: document.cookie },
      });
      const mensajeros = await responseM.json();

      // Limpiar la tabla
      tableBody.innerHTML = '';

      // Renderizar los mensajeros
      mensajeros.data.forEach((elemento) => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${elemento.msjId}</td>
          <td>${elemento.msjCodigo}</td>
          <td>${elemento.msjNombre}</td>
          <td>${elemento.msjDireccion}</td>
          <td>${elemento.msjTelefono}</td>
          <td>${elemento.msjEmail}</td>
          <td>
            <button class="boton-editar button is-small is-warning" data-id="${elemento.msjId}"><span class="icon"><i class="fas fa-edit"></i></span></button>
          </td>
          <td>
            ${elemento.totalSolicitudes === 0
              ? `<button class="boton-eliminar button is-small is-danger" data-id="${elemento.msjId}"><span class="icon"><i class="fas fa-cancel"></i></span></button>`
              : ''
            }
          </td>
        `;

        tableBody.appendChild(row);
      });

      // Actualizar la paginación
      currentPage = mensajeros.pagination.page;
      totalPages = mensajeros.pagination.totalPages;
      prevPageButton.disabled = !mensajeros.pagination.previousPage;
      nextPageButton.disabled = !mensajeros.pagination.afterPage;

      // Mostrar información de paginación
      paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    } catch (error) {
      console.error('Error al cargar los mensajeros:', error.message);
    }
  };

  // Cargar la primera página
  loadMensajeros(currentPage);

  // Manejar la paginación
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      loadMensajeros(currentPage - 1);
    }
  });

  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      loadMensajeros(currentPage + 1);
    }
  });
});