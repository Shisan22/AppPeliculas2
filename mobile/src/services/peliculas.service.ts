import api from './api';

/**
 * Servicio CRUD de películas.
 * Consume los endpoints /peliculas de la API de NestJS.
 */
export const peliculasService = {
  /** Lista películas con búsqueda y paginación */
  findAll: (search = '', page = 1, limit = 20) => {
    return api.get('/peliculas', { params: { search, page, limit } });
  },

  /** Crea una nueva película */
  create: (data: { nombre: string; imagen: string; genero: string; anio: number }) => {
    return api.post('/peliculas', data);
  },

  /** Actualiza una película existente por su ID */
  update: (id: number, data: { nombre: string; imagen: string; genero: string; anio: number }) => {
    return api.patch(`/peliculas/${id}`, data);
  },

  /** Elimina una película por su ID */
  remove: (id: number) => {
    return api.delete(`/peliculas/${id}`);
  },
};