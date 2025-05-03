document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('mensajero-form');
  const formTitle = document.getElementById('form-title');
  const submitButton = document.getElementById('submit-button');

  const idInput = document.getElementById('mensajero-id');
  const codigoInput = document.getElementById('msjCodigo');
  const nombreInput = document.getElementById('msjNombre');
  const direccionInput = document.getElementById('msjDireccion');
  const telefonoInput = document.getElementById('msjTelefono');
  const emailInput = document.getElementById('msjEmail');

  const mensajeroId = form.querySelector('#mensajero-id').value;
  const isEdition = mensajeroId !== '';

  // Cargar datos iniciales
  (async () => {
    let mensajeroData = null;

    if (isEdition) {
      // cargamos los datos del mensajero
      try {
        const response = await fetch(`/api/mensajeros/${mensajeroId}`);
        if (!response.ok) throw new Error('Mensajero no encontrado');
        const res = await response.json();
        if (!res.mensajeroSerializado) throw new Error('No se encontraron datos del mensajero');
        
        mensajeroData = res.mensajeroSerializado;

        formTitle.textContent = 'Editar Mensajero';
        submitButton.textContent = 'Actualizar Mensajero';

        idInput.value = mensajeroData.msjId || '';
        codigoInput.value = mensajeroData.msjCodigo || '';
        nombreInput.value = mensajeroData.msjNombre || '';
        direccionInput.value = mensajeroData.msjDireccion || '';
        telefonoInput.value = mensajeroData.msjTelefono || '';
        emailInput.value = mensajeroData.msjEmail || '';

      } catch (error) {
        console.error('Error al cargar datos del mensajero:', error);
      }
    } else {
      formTitle.textContent = 'Crear Mensajero';
      submitButton.textContent = 'Crear';

      idInput.value = '';
      codigoInput.value = '';
      nombreInput.value = '';
      direccionInput.value = '';
      telefonoInput.value = '';
      emailInput.value = '';
    }

    // Evento para manejar el submit del formulario
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      document.querySelectorAll('.is-danger').forEach(elemento => {
        elemento.classList.remove('is-danger');
      });

      const formData = {
        msjCodigo: codigoInput.value,
        msjNombre: nombreInput.value,  
        msjDireccion: direccionInput.value,
        msjTelefono: telefonoInput.value,
        msjEmail: emailInput.value,
      };

      if (isEdition) {
        formData.msjId = parseInt(mensajeroId);
      }

      const method = isEdition ? 'PUT' : 'POST';
      const url = isEdition 
        ? `/api/mensajeros/${mensajeroId}` 
        : '/api/mensajeros';
      
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const result = await response.json();  // convertimos la respuesta en JSON para manejar los errores

        if (!response.ok || !result.success) {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: result.message || 'Ha ocurrido un error',
            confirmButtonColor: '#d33'
          });
          
          // Si hay errores específicos de campos, resaltarlos
          if (result.errors && result.errors.fields) {
            result.errors.fields.forEach(field => {
              const input = document.getElementById(field);
              if (input) {
                input.classList.add('is-danger');
              }
            });
          }
          return; // Salir si hay error
        }

        // Mostrar mensaje de éxito con SweetAlert2
        Swal.fire({
          icon: 'success',
          title: '¡Felicitaciones!',
          text: result.message || 'Operación completada correctamente',
          confirmButtonColor: '#28a745'
        }).then((result) => {
          // Opcional: resetear el formulario
          form.reset();
          
          // Opcional: redirigir después de confirmación
          if (result.isConfirmed) {
            window.location.href = '/mensajeros/lista-mensajeros'; // Redirigir después de guardar
          }
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error Servidor',
          text: 'Hay un error interno en el servidor. Por favor, inténtelo más tarde.',
          confirmButtonColor: '#d33'
        });
        console.error('Error:', error);
      }
    });
  })();
});