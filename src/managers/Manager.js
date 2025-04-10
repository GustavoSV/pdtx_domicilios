export class Manager {
  constructor(model) {
    this.model = model; // modelo de la base de datos
  }

  async getUnique(where = {}, include = {}) {
    try {
      const one = await this.model.findUnique({ 
        where,
        include, 
      });
      return one;
    } catch (error) {
      console.error('Error al obtener el registro:', error.message);
      throw error;
    }
  }

  async getAll(where = {}, include = {}, orderBy = {}) {
    try {
      const all = await this.model.findMany({
        where,
        include,
        orderBy,
      });
      return all;
    } catch (error) {
      console.error('Error al obtener todos los registros:', error.message);
      throw error;
    }
  }

  async getPaginate(options = {}) {
    try {
      const { page = 1, pageSize = 10, where = {}, include = {}, orderBy = {} } = options;
      // Calcular el número de registros a omitir (skip)
      const skip = (page - 1) * pageSize;

      const data = await this.model.findMany({
        skip,
        take: pageSize,
        where,
        include,
        orderBy,
      });

      // Contar el total de registros que coinciden con el filtro
      const totalItems = await this.model.count({ where });

      // Calcular el total de páginas
      const totalPages = Math.ceil(totalItems / pageSize);

      // Calcular PreviousPage y AfterPage
      const previousPage = page > 1; // Hay página anterior si la página actual no es la primera
      const afterPage = page < totalPages; // Hay página siguiente si la página actual no es la última

      return {
        data, // Registros de la página actual
        pagination: {
          page, // Página actual
          pageSize, // Número de elementos por página
          totalItems, // Total de elementos que coinciden con el filtro
          totalPages, // Total de páginas disponibles
          previousPage, // Hay página anterior
          afterPage, // Hay página siguiente
        },
      };
    } catch (error) {
      console.error('Error al obtener todos los paginate:', error.message);
      throw error;
    }
  }

  async create(data) {
    try {
      const one = await this.model.create({
        data,
      });
      return one;
    } catch (error) {
      console.error('Manager - Error al crear el registro:', error.message);
      throw error;
    }
  }

  async update(where, data) {
    try {
      // Verificar si el registro existe antes de intentar actualizarlo
      const existingRecord = await this.model.findUnique({ where });
      if (!existingRecord) {
        throw new Error(`UPDATE Registro no encontrado con Where: ${JSON.stringify(where)}`);
      }

      const one = await this.model.update({
        where,
        data,
      });
      return one;
    } catch (error) {
      console.error(`Error al actualizar el registro con Where: ${JSON.stringify(where)} -`, error.message);
      throw error;
    }
  }

  async delete(where = {}) {
    try {
      // Verificar si el registro existe antes de intentar actualizarlo
      const existingRecord = await this.model.findUnique({ where });
      if (!existingRecord) {
        throw new Error(`DELETE Registro no encontrado con Where: ${JSON.stringify(where)}`);
      }

      const one = await this.model.delete({
        where,
      });
      return one;
    } catch (error) {
      console.error(`Error al eliminar el registro con Where: ${JSON.stringify(where)}:`, error.message);
      throw error;
    }
  }

  async deleteAll() {
    try {
      const all = await this.model.deleteMany();
      return all;
    } catch (error) {
      console.error('Error al eliminar todos los registros:', error.message);
      throw error;
    }
  }

  async count() {
    try {
      const count = await this.model.count();
      return count;
    } catch (error) {
      console.error('Error al contar los registros:', error.message);
      throw error;
    }
  }
}
