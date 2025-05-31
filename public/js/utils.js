
const listaMunicipios = [
  { codMcpio: "68001", nombreMcpio: "BUCARAMANGA" }, 
  { codMcpio: "68276", nombreMcpio: "FLORIDABLANCA" }, 
  { codMcpio: "68547", nombreMcpio: "PIEDECUESTA" }, 
  { codMcpio: "68307", nombreMcpio: "GIRON" }, 
  { codMcpio: "00000", nombreMcpio: "NO EXISTE"}
];

// Función para formatear fecha
function formatearFecha(fechaISO) {
  if (!fechaISO) return '-';
  
  const fecha = new Date(fechaISO);
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
  const anio = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

/**
 * Obtiene la fecha y hora actual en Colombia según el formato solicitado.
 *
 * @param {string} formato - Puede ser: 'date', 'mysql', 'iso', 'string', 'dayjs'
 * @param {Date|string} [fecha=null] - dataal: fecha a convertir a hora de Colombia
 * @returns {Date|string|dayjs.Dayjs} Fecha u hora en el formato especificado
 */
// function getColombiaDateFront(format = 'complete') {
//   // Crear fecha en UTC
//   const now = new Date();
  
//   // Zona horaria de Colombia: UTC-5
//   const colombiaOffset = -5 * 60; // en minutos
  
//   // Obtener offset local en minutos
//   const localOffset = now.getTimezoneOffset();
  
//   // Ajustar a hora de Colombia
//   const colombiaTime = new Date(now.getTime() + (localOffset + colombiaOffset) * 60 * 1000);
  
//   // Para Prisma - Devolver directamente el objeto Date
//   if (format === 'prisma' || format === 'date_object') {
//     return colombiaTime;
//   }
  
//   // dataArray de formato según lo requerido
//   switch(format) {
//     case 'date':
//       // Solo fecha: DD/MM/YYYY
//       return colombiaTime.toLocaleDateString('es-CO', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         timeZone: 'UTC'
//       });
//     case 'time':
//       // Solo hora: HH:MM:SS
//       return colombiaTime.toLocaleTimeString('es-CO', {
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false,
//         timeZone: 'UTC'
//       });
//     case 'datetime':
//       // Fecha y hora en formato corto: DD/MM/YYYY HH:MM
//       return colombiaTime.toLocaleDateString('es-CO', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: false,
//         timeZone: 'UTC'
//       });
//     case 'mysql':
//       // Formato para MySQL: YYYY-MM-DD HH:MM:SS (como string)
//       const year = colombiaTime.getUTCFullYear();
//       const month = String(colombiaTime.getUTCMonth() + 1).padStart(2, '0');
//       const day = String(colombiaTime.getUTCDate()).padStart(2, '0');
//       const hours = String(colombiaTime.getUTCHours()).padStart(2, '0');
//       const minutes = String(colombiaTime.getUTCMinutes()).padStart(2, '0');
//       const seconds = String(colombiaTime.getUTCSeconds()).padStart(2, '0');
      
//       return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//     case 'iso':
//       // Formato ISO (recomendado para mayor compatibilidad)
//       return colombiaTime.toISOString();
//     case 'complete':
//     default:
//       // Formato completo y amigable: Lunes, 05 de Mayo de 2025, 14:30:45
//       return colombiaTime.toLocaleDateString('es-CO', {
//         weekday: 'long',
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         second: '2-digit',
//         hour12: false,
//         timeZone: 'UTC'
//       });
//   }
// };

// Función para poblar selects
const populateSelect = (select, dataArray, valorInicial, valueKey = 'id', textKey = 'nombre') => {
  if (!Array.isArray(dataArray)) {
    console.error('Error: Los datos proporcionados no son un arreglo:', dataArray);
    return;
  }
  select.innerHTML = '<option value="">Seleccione...</option>';
  dataArray.forEach(element => {
    const opt = document.createElement('option');
    opt.value = element[valueKey];
    opt.textContent = element[textKey];
    if (valorInicial && opt.value === valorInicial.toString()) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });
};

// Función para obtener datos del backend
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener datos');
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

// Función para obtener barrios por municipio
const fetchBarrios = async (codMunicipio) => {
  try {
    const response = await fetch(`/api/barrios/municipio/${codMunicipio}`);
    return await response.json();
  } catch (error) {
    console.error('Error al obtener barrios:', error);
    return [];
  }
};

// exportamos las funciones y lista de municipios
export { 
  listaMunicipios, 
  formatearFecha,
  // getColombiaDateFront,
  // getTodayRangeUTC,
  // getColombiaDateRangeForDay,
  populateSelect, 
  fetchData, 
  fetchBarrios 
};