<template>
  <div class="peliculas-container">
    <h1>🎬 Películas</h1>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar película por nombre..."
        @input="handleSearch"
      />
      <button v-if="authenticated" class="btn-add" @click="openCreateModal">
        + Nueva Película
      </button>
    </div>

    <!-- Lista de películas -->
    <div v-if="loading" class="loading">Cargando películas...</div>

    <div v-else-if="peliculas.length === 0" class="empty">
      No se encontraron películas.
    </div>

    <div v-else class="peliculas-grid">
      <div v-for="pelicula in peliculas" :key="pelicula.id" class="pelicula-card">
        <img :src="pelicula.imagen" :alt="pelicula.nombre" class="pelicula-img" />
        <div class="pelicula-info">
          <h3>{{ pelicula.nombre }}</h3>
          <p class="genre">{{ pelicula.genero }}</p>
          <p class="year">{{ pelicula.anio }}</p>
          <div v-if="authenticated" class="pelicula-actions">
            <button class="btn-edit" @click="openEditModal(pelicula)">Editar</button>
            <button class="btn-delete" @click="handleDelete(pelicula.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="lastPage > 1" class="pagination">
      <button :disabled="page <= 1" @click="changePage(page - 1)">← Anterior</button>
      <span>Página {{ page }} de {{ lastPage }}</span>
      <button :disabled="page >= lastPage" @click="changePage(page + 1)">Siguiente →</button>
    </div>

    <!-- Modal para Crear/Editar -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingId ? 'Editar Película' : 'Nueva Película' }}</h2>

        <div v-if="modalError" class="error-message">{{ modalError }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" v-model="form.nombre" type="text" required />
          </div>

          <div class="form-group">
            <label for="imagen">URL de Imagen</label>
            <input id="imagen" v-model="form.imagen" type="text" required />
          </div>

          <div class="form-group">
            <label for="genero">Género</label>
            <input id="genero" v-model="form.genero" type="text" required />
          </div>

          <div class="form-group">
            <label for="anio">Año</label>
            <input id="anio" v-model.number="form.anio" type="number" required />
          </div>

          <div class="modal-buttons">
            <button type="button" class="btn-cancel" @click="closeModal">Cancelar</button>
            <button type="submit" class="btn-primary">
              {{ editingId ? 'Guardar Cambios' : 'Crear Película' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { isAuthenticated } from '../services/auth'

export default {
  name: 'PeliculasView',
  data() {
    return {
      peliculas: [],
      search: '',
      page: 1,
      lastPage: 1,
      loading: false,
      authenticated: false,
      // Modal
      showModal: false,
      editingId: null,
      modalError: '',
      form: {
        nombre: '',
        imagen: '',
        genero: '',
        anio: 2024
      },
      // Debounce para la búsqueda
      searchTimeout: null
    }
  },
  created() {
    this.authenticated = isAuthenticated()
    this.fetchPeliculas()
  },
  methods: {
    // Obtener películas del backend
    async fetchPeliculas() {
      this.loading = true
      try {
        const params = { page: this.page, limit: 6 }
        if (this.search) params.search = this.search
        const response = await api.get('/peliculas', { params })
        this.peliculas = response.data.data
        this.lastPage = response.data.lastPage
      } catch (err) {
        console.error('Error al cargar películas:', err)
      } finally {
        this.loading = false
      }
    },

    // Búsqueda con debounce
    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.page = 1
        this.fetchPeliculas()
      }, 300)
    },

    // Cambiar página
    changePage(newPage) {
      this.page = newPage
      this.fetchPeliculas()
    },

    // Abrir modal para crear
    openCreateModal() {
      this.editingId = null
      this.form = { nombre: '', imagen: '', genero: '', anio: 2024 }
      this.modalError = ''
      this.showModal = true
    },

    // Abrir modal para editar
    openEditModal(pelicula) {
      this.editingId = pelicula.id
      this.form = {
        nombre: pelicula.nombre,
        imagen: pelicula.imagen,
        genero: pelicula.genero,
        anio: pelicula.anio
      }
      this.modalError = ''
      this.showModal = true
    },

    // Cerrar modal
    closeModal() {
      this.showModal = false
      this.editingId = null
      this.modalError = ''
    },

    // Crear o editar película
    async handleSubmit() {
      this.modalError = ''
      try {
        if (this.editingId) {
          await api.patch(`/peliculas/${this.editingId}`, this.form)
        } else {
          await api.post('/peliculas', this.form)
        }
        this.closeModal()
        this.fetchPeliculas()
      } catch (err) {
        this.modalError = err.response?.data?.message || 'Error al guardar'
      }
    },

    // Eliminar película
    async handleDelete(id) {
      if (!confirm('¿Estás seguro de eliminar esta película?')) return
      try {
        await api.delete(`/peliculas/${id}`)
        this.fetchPeliculas()
      } catch (err) {
        alert(err.response?.data?.message || 'Error al eliminar')
      }
    }
  }
}
</script>

<style scoped>
.peliculas-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.peliculas-container h1 {
  text-align: center;
  color: #cdd6f4;
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

/* Barra de búsqueda */
.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #313244;
  border-radius: 8px;
  background: #1e1e2e;
  color: #cdd6f4;
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
  border-color: #89b4fa;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: #a6e3a1;
  color: #1e1e2e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.btn-add:hover {
  background: #94e2d5;
}

/* Grid de películas */
.peliculas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.pelicula-card {
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, border-color 0.2s;
}

.pelicula-card:hover {
  transform: translateY(-4px);
  border-color: #89b4fa;
}

.pelicula-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.pelicula-info {
  padding: 1rem;
}

.pelicula-info h3 {
  color: #cdd6f4;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.genre {
  color: #89b4fa;
  font-size: 0.85rem;
  margin: 0 0 0.25rem 0;
}

.year {
  color: #a6adc8;
  font-size: 0.85rem;
  margin: 0 0 0.75rem 0;
}

.pelicula-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  flex: 1;
  padding: 0.5rem;
  background: #f9e2af;
  color: #1e1e2e;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-edit:hover {
  background: #fab387;
}

.btn-delete {
  flex: 1;
  padding: 0.5rem;
  background: #f38ba8;
  color: #1e1e2e;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-delete:hover {
  background: #eba0ac;
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  background: #313244;
  color: #cdd6f4;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:hover:not(:disabled) {
  background: #45475a;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination span {
  color: #a6adc8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
}

.modal h2 {
  color: #cdd6f4;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a6adc8;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #313244;
  border-radius: 8px;
  background: #181825;
  color: #cdd6f4;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #89b4fa;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background: #313244;
  color: #cdd6f4;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel:hover {
  background: #45475a;
}

.btn-primary {
  flex: 1;
  padding: 0.75rem;
  background: #89b4fa;
  color: #1e1e2e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #74c7ec;
}

.error-message {
  background: #f38ba822;
  color: #f38ba8;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.loading, .empty {
  text-align: center;
  color: #a6adc8;
  padding: 3rem;
  font-size: 1.1rem;
}
</style>
