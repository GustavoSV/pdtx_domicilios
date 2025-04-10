// Función para formatear la fecha
import { formatearFecha } from './utils.js';

// Formatear todas las fechas en la página
document.addEventListener('DOMContentLoaded', () => {
  const elementosFecha = document.querySelectorAll('.fecha-entrega');
  elementosFecha.forEach((elemento) => {
    const fechaISO = elemento.getAttribute('data-fecha');
    elemento.textContent = formatearFecha(fechaISO);
  });
});