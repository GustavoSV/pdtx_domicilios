// Función para formatear la fecha
import { formatearFecha } from './utils.js';

// Formatear todas las fechas en la página
document.addEventListener('DOMContentLoaded', () => {
  const solicitudId = document.getElementById('solicitud-id'); // ID de la solicitud
  const solicitudUsuario = document.getElementById('solicitud-usuario'); // Usuario solicitante
  const solicitudEstado = document.getElementById('solicitud-estado'); // Estado de la solicitud
  const solicitudActividad = document.getElementById('solicitud-actividad'); // Actividad de la solicitud
  const solicitudDestinatario = document.getElementById('solicitud-destinatario'); // Destinatario de la solicitud
  const solicitudDireccion = document.getElementById('solicitud-direccion'); // Dirección de la solicitud
  const solicitudBarrio = document.getElementById('solicitud-barrio'); // Ciudad de la solicitud
  const solicitudTelefono = document.getElementById('solicitud-telefono'); // Teléfono de la solicitud
  const solicitudCC = document.getElementById('solicitud-centro-costos'); // CC de la solicitud
  const solicitudInstrucciones = document.getElementById('solicitud-instrucciones'); // Instrucciones de la solicitud
  const gestionFechaSolicitud = document.getElementById('gestion-fecha-solicitud'); // Fecha de la solicitud
  const gestionFechaEntrega = document.getElementById('gestion-fecha-entrega'); // Fecha de entrega de la solicitud
  const gestionMensajero = document.getElementById('gestion-mensajero'); // Mensajero de la solicitud
  const gestionValor = document.getElementById('gestion-valor'); // Valor de la solicitud
  const gestionVrAdicional = document.getElementById('gestion-vr-adicional'); // Valor adicional de la solicitud
  const gestionObservaciones = document.getElementById('gestion-observaciones'); // Observaciones de la solicitud

  const buttonEditar = document.getElementById('buttonEditar');
  const estado = buttonEditar.getAttribute('data-estado'); // Estado de la solicitud

  (async () => {
    const response = await fetch(`/api/solicitudes/${solicitudId.textContent}`);
    if (!response.ok) 
      throw new Error(`Solicitud ${solicitudId.textContent} no encontrada`);
    const data = await response.json();
    const domicilio = data.solicitudSerializada;
    
    solicitudUsuario.textContent = domicilio.usuario.usuNombre || '';
    solicitudEstado.textContent = domicilio.estado.eneEstado || '';
    solicitudActividad.textContent = domicilio.actividad.dacDescripcion || '';
    solicitudDestinatario.textContent = domicilio.destinatario.ddtNombre || '';
    solicitudDireccion.textContent = domicilio.dsoDireccion || '';
    solicitudBarrio.textContent = domicilio.barrio.gbrNombre || '';
    solicitudTelefono.textContent = domicilio.dsoTelefono || '';
    solicitudCC.textContent = domicilio.centroscosto.cctCodUEN + '-' + domicilio.centroscosto.cctNombreCC || '';
    solicitudInstrucciones.textContent = domicilio.dsoInstrucciones || '';
    gestionFechaSolicitud.textContent = formatearFecha(domicilio.dsoFchSolicitud) || '';
    if (domicilio.gestion) {
      gestionFechaEntrega.textContent = formatearFecha(domicilio.gestion.dgoFchEntrega) || '';
      gestionFechaEntrega.textContent = formatearFecha(domicilio.gestion.dgoFchEntrega) || '';
      gestionMensajero.textContent = domicilio.gestion.mensajero.msjNombre || '';
      gestionValor.textContent = domicilio.gestion.dgoValor || '';
      gestionVrAdicional.textContent = domicilio.gestion.dgoVrAdicional || '';
      gestionObservaciones.textContent = domicilio.gestion.dgoObservaciones || '';
    }

    // Configurar el botón de editar
    buttonEditar.setAttribute('href', `/solicitudes/form-solicitudes/${domicilio.dsoId}/${origin}`);
    buttonEditar.setAttribute('data-estado', domicilio.dsoCodEstado);
    
    // Deshabilitar el botón si el estado no es "SO"
    if (domicilio.dsoCodEstado !== 'SO' || domicilio.dsoCodUsuario !== userId) {
      buttonEditar.setAttribute('disabled', 'disabled');
      buttonEditar.style.pointerEvents = 'none'; // Evitar clics
      buttonEditar.style.opacity = '0.5'; // Añadir estilo visual
    }
  }
  )();
  
});