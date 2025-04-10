// utils/databaseValidators.js
/**
 * Valida que exista un registro en una tabla específica basada en un valor clave
 * @param {Object} prisma - Instancia de cliente Prisma
 * @param {string} relationName - Nombre del modelo de Prisma a validar
 * @param {string} relationKey - Nombre de la columna clave a buscar
 * @param {any} relationValue - Valor a buscar en la columna clave
 * @param {string} contextInfo - Información adicional para el mensaje de error
 * @returns {Promise<boolean>} - true si la validación es exitosa
 * @throws {Error} - Error si no se encuentra el registro relacionado
 */
const validarRelacion = async (prisma, relationName, relationKey, relationValue, contextInfo = '') => {
  
  if (!relationValue) return true; // No validar si no hay valor
  
  const recordExists = await prisma[relationName].findUnique({
    where: { [relationKey]: relationValue },
  });
  
  if (!recordExists) {
    throw new Error(`${contextInfo ? contextInfo + ': ' : ''}${relationName} no encontrado con ${relationKey}: ${relationValue}`);
  }
  
  return true;
};

export {
  validarRelacion
};