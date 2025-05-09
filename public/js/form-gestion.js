import { fetchData, populateSelect } from "./utils.js";

addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('gestion-form');
  const submitButton = document.getElementById('submit-button');

  const mensajeroSelect = document.getElementById('gestion-mensajero');
  const centrocostosSelect = document.getElementById('gestion-centrocostos');
  const completadoCheckbox = document.getElementById('gestion-completado');
  const anuladoCheckbox = document.getElementById('gestion-anulado');
  const solicitanteInput = document.getElementById('gestion-solicitante');
  const destinatarioInput = document.getElementById('gestion-destinatario');
  const direccionInput = document.getElementById('gestion-direccion');
  const actividadInput = document.getElementById('gestion-actividad');
  const instruccionesInput = document.getElementById('gestion-instrucciones');
  const valorInput = document.getElementById('gestion-valor');
  const valorAdicionalInput = document.getElementById('gestion-valor-adicional');
  const observacionesInput = document.getElementById('gestion-observaciones');

  const idInput = document.getElementById('gestion-id');
  
  (async () => {
    const id = idInput.value;
    let idGestion = null; // Variable para almacenar el ID de la gestión
    let accionGestion = null;
    if (id) {
      try {
        const response = await fetch(`/api/gestion/${id}`);
        if (!response.ok) throw new Error('Solicitud para gestionar no encontrada');
        const data = await response.json();
        const gestionData = data.solicitudSerializada;
        idGestion = gestionData?.gestion?.dgoId;
        
        // Rellenar los campos del formulario con los datos de la gestión
        // Cargar Mensajeros y Centro de Costos
        const resMensajeros = await fetchData('/api/mensajeros');
        const resMensPag = await fetch('/api/mensajeros/paginate');
        const resCentrosCostos = await fetchData('/api/centroscosto');       
        populateSelect(mensajeroSelect, resMensajeros.mensajerosSerializados, gestionData?.gestion?.dgoCodMensajero, 'msjCodigo', 'msjNombre');
        populateSelect(centrocostosSelect, resCentrosCostos.centrosCosto, gestionData?.gestion?.dgoCodCentroC, 'cctCodigo', 'cctNombreCC');
        // Checkbox de completado
        if (gestionData.dsoCodEstado === 'ET' || gestionData.dsoCodEstado === 'AU' || gestionData.dsoCodEstado === 'PA') {
          completadoCheckbox.checked = true;
          completadoCheckbox.disabled = true; // Deshabilitar el checkbox si la gestión ya está completada
          anuladoCheckbox.disabled = true; 
        } else {
          completadoCheckbox.checked = false; // Habilitar el checkbox si la gestión no está completada
          completadoCheckbox.disabled = false; 
        }
        // Checkbox de anulado
        if (gestionData.dsoCodEstado === 'AN') {
          anuladoCheckbox.checked = true;
          anuladoCheckbox.disabled = true; // Deshabilitar el checkbox si la gestión ya está anulada
          completadoCheckbox.disabled = true; 
        } else {
          anuladoCheckbox.checked = false;
          anuladoCheckbox.disabled = false; // Habilitar el checkbox si la gestión no está anulada
        }
        // Rellenar los campos de texto
        idInput.disabled = true;
        solicitanteInput.value = gestionData.usuario.usuNombre || '';
        solicitanteInput.disabled = true;
        destinatarioInput.value = gestionData.destinatario.ddtNombre || '';
        destinatarioInput.disabled = true;
        direccionInput.value = `${gestionData.dsoDireccion}, ${gestionData.barrio.gbrNombre} Telf: ${gestionData.dsoTelefono}` || '';
        direccionInput.disabled = true;
        actividadInput.value = gestionData.actividad.dacDescripcion || '';
        actividadInput.disabled = true;
        instruccionesInput.value = gestionData.dsoInstrucciones || '';
        instruccionesInput.disabled = true;
        valorInput.value = gestionData?.gestion?.dgoValor || '';
        valorAdicionalInput.value = gestionData?.gestion?.dgoValorAdicional || '';
        observacionesInput.value = gestionData?.gestion?.dgoObservaciones || '';

        if (gestionData.dsoCodEstado === 'SO') {
          completadoCheckbox.disabled = true;
          valorInput.disabled = true;
          valorAdicionalInput.disabled = true;
          submitButton.textContent = 'En Proceso';
          accionGestion = 'enProceso';
        } else if (gestionData.dsoCodEstado === 'EP') {
          completadoCheckbox.disabled = false;
          valorInput.disabled = false;
          valorAdicionalInput.disabled = false;
          submitButton.textContent = 'Terminado';
          accionGestion = 'completada';
        }

      } catch (error) {
        console.error('Error al cargar datos de la gestión:', error.message);
      }
    }

    completadoCheckbox.addEventListener('change', () => {
      if (completadoCheckbox.checked) {
        anuladoCheckbox.checked = false; // Desmarcar el checkbox de anulado si se marca el de completado
      }
    });
    anuladoCheckbox.addEventListener('change', () => {
      if (anuladoCheckbox.checked) {
        completadoCheckbox.checked = false; // Desmarcar el checkbox de completado si se marca el de anulado
      }
    });

    // Envío del formulario
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevenir el envío del formulario por defecto
      let formData = null; // Variable para almacenar los datos del formulario
      
      if (anuladoCheckbox.checked) {
        formData = {
          dsoId: parseInt(idInput.value),
          dsoCodEstado: 'AN', // Anular domicilio
        }
        const anulada = procesarDatos('anular', formData);
        if (anulada) {
          Swal.fire('Éxito', 'Solicitud anulada correctamente', 'success');
          form.reset(); // Limpiar el formulario después de enviar
        }
        window.location.href = '/gestion/lista-gestion';
      }
      // Validamos que los campos de mensajero y centro de costos estén seleccionados para los demás estados En Proceso o Completada
      if (!mensajeroSelect.value || !centrocostosSelect.value) {
        Swal.fire('Error', 'Por favor, seleccione un mensajero y un centro de costos.', 'error');
        return;
      }

      if (accionGestion === 'completada') {
        if (completadoCheckbox.checked) {
          if (!idGestion) {
            Swal.fire('Error', 'No se puede completar la gestión. No hay un ID de gestión.', 'error');
            return;
          }
          if (valorInput.value <= 0) {
            Swal.fire('Error', 'El valor debe ser mayor que cero.', 'error');
            return;
          }
          formData = {
            dgoId: idGestion, 
            dgoIdSolicitud: parseInt(idInput.value),
            dgoCodMensajero: parseInt(mensajeroSelect.value),
            dgoCodCentroC: centrocostosSelect.value,
            dgoValor: parseFloat(valorInput.value),
            dgoVrAdicional: valorAdicionalInput.value ? parseFloat(valorAdicionalInput.value) : 0,
            dgoObservaciones: observacionesInput.value || '',
            dsoCodEstado: 'ET', // Estado de la gestión
          };
          const completada = procesarDatos('completada', formData);
          if (completada) {
            form.reset(); // Limpiar el formulario después de enviar
            Swal.fire({
              title: 'Éxito', 
              text: 'Solicitud completada con éxito', 
              icon: 'success',
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false
            }).then((result) => {
              window.location.href = '/gestion/lista-gestion';
            });
          }
        } else {
          Swal.fire('Error', 'DEBE seleccionar un Estado, ya sea Completado o Anulado', 'error');
          return;
        }
      } else if (accionGestion === 'enProceso') {
        // enviamos a En Proceso la solicitud
        formData = {
          dgoIdSolicitud: parseInt(idInput.value),
          dgoCodMensajero: parseInt(mensajeroSelect.value),
          dgoCodCentroC: centrocostosSelect.value,
          dgoObservaciones: observacionesInput.value || '',
          dsoCodEstado: 'EP', // Estado de la gestión
        };
        const enProceso = procesarDatos('enProceso', formData);
        if (enProceso) {
          form.reset(); // Limpiar el formulario después de enviar
          Swal.fire({
            title: 'Éxito', 
            text: 'Solicitud en Proceso', 
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then((result) => {
            window.location.href = '/gestion/lista-gestion';
          });
        }
      };
    });
  }
  )();
});

const procesarDatos = async (accion, formData) => {
  try {
    let url = '';
    let method = '';
    if (accion === 'completada') {
      url = `/api/gestion/${formData.dgoId}`; // Actualizar la gestión existente
      method = 'PUT';
    } else if (accion === 'enProceso') {
      url = '/api/gestion'; // Crear una nueva gestión
      method = 'POST';
    } else if (accion === 'anular') {
      url = `/api/solicitudes/anular/${formData.dsoId}`; // Anular la solicitud
      method = 'PUT';
    }

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error('Error al procesar los datos');
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al procesar los datos:', error.message);
    throw error;
  }
};