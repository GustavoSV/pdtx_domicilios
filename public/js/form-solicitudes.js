// public/js/form-solicitudes.js
import { listaMunicipios, populateSelect, fetchData, fetchBarrios } from "./utils.js";

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('solicitud-form');
  const formTitle = document.getElementById('form-title');
  const submitButton = document.getElementById('submit-button');

  const municipioSelect = document.getElementById('solicitud-municipio');
  const barrioSelect = document.getElementById('solicitud-barrio');
  const destinatarioSelect = document.getElementById('solicitud-destinatario');
  const actividadSelect = document.getElementById('solicitud-actividad');
  const idInput = document.getElementById('solicitud-id');
  const direccionInput = document.getElementById('solicitud-direccion');
  const telefonoInput = document.getElementById('solicitud-telefono');
  const instruccioesInput = document.getElementById('solicitud-instrucciones');

  const solicitudId = form.querySelector('#solicitud-id').value;
  const isEdition = solicitudId !== '';

  destinatarioSelect.addEventListener('change', async () => {
    const destinatarioId = destinatarioSelect.value;
    if (!destinatarioId) {
      // Si no hay destinatario seleccionado, limpiar campos
      direccionInput.value = '';
      barrioSelect.innerHTML = '<option value="">Seleccione un barrio...</option>';
      municipioSelect.value = '';
      return;
    }
    try {
      // Obtener datos del destinatario desde el backend
      const response = await fetch(`/api/destinatarios/${destinatarioId}`);
      if (!response.ok) throw new Error('Destinatario no encontrado');
      const data = await response.json();
      const destinatarioData = data.destinatario;
      
      // Rellenar el campo de dirección y teléfono si existen
      if (destinatarioData.ddtDireccion) {
        direccionInput.value = destinatarioData.ddtDireccion;
      }
      if (destinatarioData.ddtTelefono) {
        telefonoInput.value = destinatarioData.ddtTelefono;
      }

      // Cargar el municipio y barrio correspondientes
      const resBarrios = await fetchBarrios(destinatarioData.barrio.gbrCodCiudad);        
      populateSelect(municipioSelect, listaMunicipios, destinatarioData.barrio.gbrCodCiudad, 'codMcpio', 'nombreMcpio');
      populateSelect(barrioSelect, resBarrios.barrios, destinatarioData.ddtCodBarrio, 'gbrCodigo', 'gbrNombre');
    } catch (error) {
      console.error('Error al cargar datos del destinatario:', error.message);
      Swal.fire('Error', 'Ocurrió un problema al cargar los datos del destinatario', 'error');
    }
  });

  // Cargar datos iniciales
  (async () => {
    let solicitudData = null;

    if (isEdition) {
      // Si es edición, cargar los datos de la solicitud
      try {
        const response = await fetch(`/api/solicitudes/${solicitudId}`);
        if (!response.ok) throw new Error('Solicitud no encontrada');
        const res = await response.json();
        solicitudData = res.solicitudSerializada;
        
        // Actualizar título del formulario
        formTitle.textContent = 'Editar Solicitud';
        submitButton.textContent = 'Guardar Cambios';

        // Llenar campos con los datos de la solicitud
        idInput.value = solicitudData.dsoId || '';
        direccionInput.value = solicitudData.dsoDireccion || '';
        telefonoInput.value = solicitudData.dsoTelefono || '';
        instruccioesInput.value = solicitudData.dsoInstrucciones || '';
        
        const resBarrios = await fetchBarrios(solicitudData.barrio.gbrCodCiudad);        
        populateSelect(municipioSelect, listaMunicipios, solicitudData.barrio.gbrCodCiudad, 'codMcpio', 'nombreMcpio');
        populateSelect(barrioSelect, resBarrios.barrios, solicitudData.dsoCodBarrio, 'gbrCodigo', 'gbrNombre');
      } catch (error) {
        console.error('Error al cargar datos de la solicitud:', error);
      }
    }
    // actualizamos títulos y cargamos solo los municipios cuando es creación de nueva solicitud
    if (! isEdition) {
      formTitle.textContent = 'Nueva Solicitud';
      submitButton.textContent = 'Crear Solicitud';
      populateSelect(municipioSelect, listaMunicipios, solicitudData?.barrio.gbrCodCiudad, 'codMcpio', 'nombreMcpio');
    }

    // Cargar actividades
    const resActividades = await fetchData('/api/actividades');
    populateSelect(actividadSelect, resActividades.actividades, solicitudData?.dsoCodActividad, 'dacCodigo', 'dacDescripcion');

    // Cargar destinatarios
    const resDestinatarios = await fetchData('/api/destinatarios');
    
    populateSelect(destinatarioSelect, resDestinatarios.destinatarios, solicitudData?.dsoCodDestinatario, 'ddtId', 'ddtNombre');

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
        dsoCodActividad: actividadSelect.value,
        dsoCodDestinatario: parseInt(destinatarioSelect.value),  
        dsoDireccion: form.querySelector('#solicitud-direccion').value,
        dsoCodBarrio: barrioSelect.value,
        dsoTelefono: form.querySelector('#solicitud-telefono').value,
        dsoInstrucciones: form.querySelector('#solicitud-instrucciones').value,
        dsoFchSolicitud: isEdition 
          ? solicitudData.domFchSolicitud // Usar la fecha existente en edición
          : new Date().toISOString(),     // Usar la fecha actual en creación
        dsoCodEstado: isEdition
          ? solicitudData.dsoCodEstado
          : "SO",
      };

      if (isEdition) {
        formData.dsoId = parseInt(solicitudId);
      }

      const method = isEdition ? 'PUT' : 'POST';
      const url = isEdition 
        ? `/api/solicitudes/${solicitudId}` 
        : '/api/solicitudes';

      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Error al guardar la solicitud');
        window.location.href = '/solicitudes/lista-solicitudes'; // Redirigir después de guardar
      } catch (error) {
        console.error('Error:', error.message);
        Swal.fire('Error', 'Ocurrió un problema al guardar la solicitud', 'error');
      }
    });
  })();
});