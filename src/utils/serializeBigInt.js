// src/utils/serializeBigInt.js
export const serializeBigInt = (data) => {
  if (typeof data === 'bigint') {
    return data.toString(); // Convertir BigInt a String
  } else if (data instanceof Date) {
    return data.toISOString(); // Convertir Date a formato ISO 8601
  } else if (Array.isArray(data)) {
    return data.map(item => serializeBigInt(item)); // Recursivamente serializar arrays
  } else if (typeof data === 'object' && data !== null) {
    const serialized = {};
    for (const key in data) {
      serialized[key] = serializeBigInt(data[key]); // Recursivamente serializar objetos
    }
    return serialized;
  }
  return data; // Devolver otros tipos sin cambios
};