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

// Función para poblar selects
const populateSelect = (select, opciones, valorInicial, valueKey = 'id', textKey = 'nombre') => {
  if (!Array.isArray(opciones)) {
    console.error('Error: Los datos proporcionados no son un arreglo:', opciones);
    return;
  }
  select.innerHTML = '<option value="">Seleccione...</option>';
  opciones.forEach(opcion => {
    const opt = document.createElement('option');
    opt.value = opcion[valueKey];
    opt.textContent = opcion[textKey];
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
  populateSelect, 
  fetchData, 
  fetchBarrios 
};