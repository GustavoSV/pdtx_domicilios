import { listaMunicipios, fetchBarrios, populateSelect } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('destinatario-form');
  const formTitle = document.getElementById('form-title');
  const submitButton = document.getElementById('submit-button');

  const idInput = document.getElementById('destinatario-id');
  const nombreInput = document.getElementById('destinatario-nombre');
  const direccionInput = document.getElementById('destinatario-direccion');
  const telefonoInput = document.getElementById('destinatario-telefono');
  const municipioSelect = document.getElementById('destinatario-municipio');
  const barrioSelect = document.getElementById('destinatario-barrio');

  const destinatarioId = form.querySelector('#destinatario-id').value;
  const isEdition = destinatarioId !== '';

  // Cargar datos iniciales
  (async () => {
    let destinatarioData = null;

    if (isEdition) {
      // Si es edición, cargar los datos del destinatario
      try {
        const response = await fetch(`/api/destinatarios/${destinatarioId}`);
        if (!response.ok) throw new Error('Destinatario no encontrado');
        const res = await response.json();
        if (!res.destinatario) throw new Error('No se encontraron datos del destinatario');
        
        destinatarioData = res.destinatario;
        
        // Actualizar título del formulario
        formTitle.textContent = 'Editar Destinatario';
        submitButton.textContent = 'Guardar Cambios';

        // Llenar campos con los datos de la solicitud
        idInput.value = destinatarioData.ddtId || '';
        nombreInput.value = destinatarioData.ddtNombre || '';
        direccionInput.value = destinatarioData.ddtDireccion || '';
        telefonoInput.value = destinatarioData.ddtTelefono || '';
        
        const resBarrios = await fetchBarrios(destinatarioData.barrio.gbrCodCiudad);        
        populateSelect(municipioSelect, listaMunicipios, destinatarioData.barrio.gbrCodCiudad, 'codMcpio', 'nombreMcpio');
        populateSelect(barrioSelect, resBarrios.barrios, destinatarioData.ddtCodBarrio, 'gbrCodigo', 'gbrNombre');
      } catch (error) {
        console.error('Error al cargar datos del destinatario:', error);
      }
    }
    // actualizamos títulos y cargamos solo los municipios cuando es creación de nueva solicitud
    if (! isEdition) {
      formTitle.textContent = 'Nuevo Destinatario';
      submitButton.textContent = 'Crear Destinatario';
      // Limpiar campos de entrada
      idInput.value = '';
      nombreInput.value = '';
      direccionInput.value = '';
      telefonoInput.value = '';
      populateSelect(municipioSelect, listaMunicipios, destinatarioData?.barrio.gbrCodCiudad, 'codMcpio', 'nombreMcpio');
    }

    // Evento para cargar barrios dinámicamente
    municipioSelect.addEventListener('change', async () => {
      const codigoMunicipio = municipioSelect.value;
      if (!codigoMunicipio) {
        barrioSelect.innerHTML = '<option value="">Seleccione un barrio...</option>';
        return;
      }

      const resBarrios = await fetchBarrios(codigoMunicipio);
      populateSelect(barrioSelect, resBarrios.barrios, null, 'gbrCodigo', 'gbrNombre');
    });

    // Evento para manejar el submit del formulario
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        ddtNombre: nombreInput.value,  
        ddtDireccion: form.querySelector('#destinatario-direccion').value,
        ddtCodBarrio: barrioSelect.value,
        ddtTelefono: telefonoInput.value,
      };

      if (isEdition) {
        formData.ddtId = parseInt(destinatarioId);
      }

      const method = isEdition ? 'PUT' : 'POST';
      const url = isEdition 
        ? `/api/destinatarios/${destinatarioId}` 
        : '/api/destinatarios';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error(`Error al guardar el destinatario: ${response.statusText}`);
        window.location.href = '/destinatarios/lista-destinatarios'; // Redirigir después de guardar
      } catch (error) {
        console.error('Error:', error.message);
        Swal.fire('Error', 'Ocurrió un problema al guardar el destinatario', 'error');
      }
    });
  })();
});