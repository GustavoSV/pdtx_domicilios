import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import es from "dayjs/locale/es.js"; // Español (genérico)

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.locale(es); // Establecer idioma predeterminado - Usamos español

const COLOMBIA_TIMEZONE = "America/Bogota";

/**
 * Formatos predefinidos para usar en la aplicación
 */
const formatosFecha = {
  // Fecha completa: "lunes, 5 de mayo de 2025 14:30"
  completo: 'LLLL',

  // Fecha corta: "05/05/2025"
  corto: 'DD/MM/YYYY',
  
  // Solo fecha larga: "5 de mayo de 2025"
  soloFecha: 'LL',
  
  // Solo hora: "14:30:45"
  soloHora: 'HH:mm:ss',
  
  // Fecha y hora: "05/05/2025 14:30"
  fechaHora: 'DD/MM/YYYY HH:mm',
  
  // Para MySQL: "2025-05-05 14:30:45"
  mysql: 'YYYY-MM-DD HH:mm:ss',
  
  // ISO: "2025-05-05T14:30:45-05:00"
  iso: 'YYYY-MM-DDTHH:mm:ssZ'
};

/**
 * Formatea una fecha de la base de datos a formato Colombia
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - Formato deseado
 * @returns {string} - Fecha formateada
 */
function formatDateForColombia(date, format = 'LLLL') {
  return dayjs(date).tz(COLOMBIA_TIMEZONE).format(format);
}

// Obtiene el rango de fechas para HOY en UTC
function getTodayRangeUTC() {  // ESTA ES LA QUE ESTAMOS PROBANDO
  const now = dayjs().tz('America/Bogota'); // Hora actual en Colombia
  const startOfDayUTC = now.clone().startOf('day').utc(); // Inicio del día en UTC
  const endOfDayUTC = now.clone().endOf('day').utc();     // Fin del día en UTC

  return {
      startDate: startOfDayUTC.toISOString(),
      endDate: endOfDayUTC.toISOString()
  };
}

// Obtiene el rango de fechas para un día específico en Colombia
function getDateRangeUTC(date = null) {
  const now = date ? dayjs(date).tz(COLOMBIA_TIMEZONE) : dayjs().tz(COLOMBIA_TIMEZONE);
  const startOfDayUTC = now.clone().startOf('day').utc(); // Inicio del día en UTC
  const endOfDayUTC = now.clone().endOf('day').utc();     // Fin del día en UTC

  return {
      startDate: startOfDayUTC.toISOString(),
      endDate: endOfDayUTC.toISOString()
  };
}

// Obtiene el rango de fechas para un mes específico en UTC
function getMonthRangeUTC(month, year) {
    // month es un número del 0 al 11 (enero = 0, diciembre = 11)
    const dateInLocal = dayjs().tz('America/Bogota').year(year).month(month);

    const startDate = dateInLocal.clone().startOf('month').utc().toISOString();
    const endDate = dateInLocal.clone().endOf('month').utc().toISOString();

    return { startDate, endDate };
}

// Obtiene el rango de fechas para un año específico en UTC
function getYearRangeUTC(year) {
    const dateInLocal = dayjs().tz('America/Bogota').year(year);

    const startDate = dateInLocal.clone().startOf('year').utc().toISOString();
    const endDate = dateInLocal.clone().endOf('year').utc().toISOString();

    return { startDate, endDate };
}

/**
 * Obtiene la fecha y hora actual en Colombia según el formato solicitado.
 *
 * @param {string} formato - Puede ser: 'date', 'mysql', 'iso', 'string', 'dayjs'
 * @param {Date|string} [fecha=null] - Opcional: fecha a convertir a hora de Colombia
 * @returns {Date|string|dayjs.Dayjs} Fecha u hora en el formato especificado
 */
function getColombiaDateFormat(formato = "iso", fecha = null) {
  const now = fecha ? dayjs(fecha) : dayjs();
  const colombiaTime = now.tz(COLOMBIA_TIMEZONE);

  switch (formato) {
    case "prisma":
      // Construimos el Date usando el formato local de Colombia
      return dayjs.tz(colombiaTime).toDate();

    case "mysql":
      // Formato aceptado por MySQL como cadena
      return colombiaTime.format("YYYY-MM-DD HH:mm:ss");

    case "date_only":
      // Formato MySQL solo la fecha
      return colombiaTime.format("YYYY-MM-DD");

    case "iso":
      // ISO string (útil para APIs o inputs datetime-local)
      return colombiaTime.toISOString();

    case "string":
      // Formato legible para usuarios (DD/MM/YYYY HH:mm)
      return colombiaTime.format("DD/MM/YYYY HH:mm");

    case "dayjs":
      // Objeto dayjs para manipulación avanzada
      return colombiaTime;

    case "timestamp":
      // Timestamp en milisegundos
      return colombiaTime.valueOf();

    default:
      throw new Error(`Formato desconocido: ${formato}`);
  }
}

export {
  dayjs,
  formatosFecha,
  formatDateForColombia,
  getTodayRangeUTC,
  getDateRangeUTC,
  getMonthRangeUTC,
  getYearRangeUTC,
  getColombiaDateFormat,
  COLOMBIA_TIMEZONE
}