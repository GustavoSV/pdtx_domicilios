// Función para formatear la fecha
import { formatearFecha } from './utils.js';

// Formatear todas las fechas en la página
document.addEventListener('DOMContentLoaded', () => {
  const buttonEditar = document.getElementById('buttonEditar');
  const estado = buttonEditar.getAttribute('data-estado'); // Estado de la solicitud
  
  // Deshabilitar el botón si el estado no es "SO"
  if (estado !== 'SO') {
    buttonEditar.setAttribute('disabled', 'disabled');
    buttonEditar.style.pointerEvents = 'none'; // Evitar clics
    buttonEditar.style.opacity = '0.5'; // Añadir estilo visual
  }

  const elementosFecha = document.querySelectorAll('.fechas');
  elementosFecha.forEach((elemento) => {
    const fechaISO = elemento.getAttribute('data-fecha');
    elemento.textContent = formatearFecha(fechaISO);
  });
});