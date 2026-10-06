<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Películas</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="logout">Salir</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar v-model="searchQuery" @ionInput="onSearch" placeholder="Buscar por nombre..."></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Lista de películas -->
      <ion-list>
        <ion-item v-for="pelicula in peliculas" :key="pelicula.uniqueId">
          <ion-thumbnail slot="start">
            <img :src="pelicula.imagen" alt="poster" />
          </ion-thumbnail>
          <ion-label>
            <h2>{{ pelicula.nombre }}</h2>
            <p>{{ pelicula.genero }} ({{ pelicula.anio }})</p>
          </ion-label>
          <ion-button fill="clear" @click="openModal(pelicula)">Editar</ion-button>
          <ion-button fill="clear" color="danger" @click="confirmDelete(pelicula.id)">Eliminar</ion-button>
        </ion-item>
      </ion-list>

      <!-- Scroll infinito: carga más películas al llegar al final -->
      <ion-infinite-scroll @ionInfinite="loadMore" :disabled="isScrollDisabled">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>

      <!-- Botón flotante para crear película -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openModal()">
          <ion-icon :icon="addIcon"></ion-icon>
        </ion-fab-button>
      </ion-fab>

      <!-- Modal para crear o editar película -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ currentPelicula.id ? 'Editar' : 'Nueva' }} Película</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input v-model="currentPelicula.nombre"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Imagen (URL)</ion-label>
            <ion-input v-model="currentPelicula.imagen"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Género</ion-label>
            <ion-input v-model="currentPelicula.genero"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">Año</ion-label>
            <ion-input type="number" v-model="currentPelicula.anio"></ion-input>
          </ion-item>
          <ion-button expand="block" class="ion-margin-top" @click="savePelicula">Guardar</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Alerta de confirmación para eliminar -->
      <ion-alert
        :is-open="isAlertOpen"
        header="Confirmar"
        message="¿Estás seguro de eliminar esta película?"
        :buttons="alertButtons"
        @didDismiss="isAlertOpen = false"
      ></ion-alert>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonSearchbar, IonList, IonItem, IonThumbnail, IonLabel, IonInfiniteScroll,
  IonInfiniteScrollContent, IonFab, IonFabButton, IonIcon, IonModal, IonInput, IonAlert
} from '@ionic/vue';
import { add as addIcon } from 'ionicons/icons';
import { peliculasService } from '../services/peliculas.service';
import { authService } from '../services/auth.service';
import { useRouter } from 'vue-router';

// ─── Estado reactivo ───────────────────────────────────────────────
const router = useRouter();
const peliculas = ref([]);
const searchQuery = ref('');
const page = ref(1);
const isScrollDisabled = ref(false);

// Estado del modal y alerta
const isModalOpen = ref(false);
const isAlertOpen = ref(false);
const deleteId = ref(null);
const currentPelicula = ref({ nombre: '', imagen: '', genero: '', anio: '' });

const alertButtons = [
  { text: 'Cancelar', role: 'cancel' },
  { text: 'Eliminar', role: 'confirm', handler: () => executeDelete() }
];

// Límite máximo de elementos en memoria para optimizar rendimiento
const MAX_ITEMS_IN_DOM = 60;
const PAGE_SIZE = 20;

// ─── Carga de datos ────────────────────────────────────────────────

/** Genera un identificador único para cada elemento de la lista */
const generateUniqueId = (item) => `${item.id}-${Math.random().toString(36).substring(2, 9)}`;

/**
 * Carga películas desde la API.
 * @param isFirstLoad - Si es true, reinicia la paginación y la lista.
 * @param event - Evento del ion-infinite-scroll para señalar que terminó la carga.
 */
const loadPeliculas = async (isFirstLoad = true, event = null) => {
  if (isFirstLoad) {
    page.value = 1;
    peliculas.value = [];
    isScrollDisabled.value = false;
  }

  try {
    const res = await peliculasService.findAll(searchQuery.value, page.value, PAGE_SIZE);
    const newItems = res.data.data;

    if (newItems?.length) {
      const itemsWithKeys = newItems.map(m => ({ ...m, uniqueId: generateUniqueId(m) }));
      peliculas.value = [...peliculas.value, ...itemsWithKeys];

      // Liberar memoria: conservar solo los últimos elementos visibles
      if (peliculas.value.length > MAX_ITEMS_IN_DOM) {
        peliculas.value = peliculas.value.slice(-MAX_ITEMS_IN_DOM);
      }
    }

    if (page.value >= res.data.lastPage) {
      isScrollDisabled.value = true;
    }
  } catch (error) {
    console.error('Error al cargar películas:', error);
  } finally {
    event?.target?.complete();
  }
};

// ─── Eventos de la vista ───────────────────────────────────────────

const onSearch = () => loadPeliculas(true);

const loadMore = (event) => {
  page.value++;
  loadPeliculas(false, event);
};

// ─── CRUD: Modal y formulario ──────────────────────────────────────

const openModal = (pelicula = null) => {
  currentPelicula.value = pelicula
    ? { ...pelicula }
    : { nombre: '', imagen: '', genero: '', anio: '' };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const savePelicula = async () => {
  try {
    const payload = {
      nombre: currentPelicula.value.nombre,
      imagen: currentPelicula.value.imagen,
      genero: currentPelicula.value.genero,
      anio: parseInt(currentPelicula.value.anio)
    };

    if (currentPelicula.value.id) {
      await peliculasService.update(currentPelicula.value.id, payload);
    } else {
      await peliculasService.create(payload);
    }

    closeModal();
    loadPeliculas(true);
  } catch (error) {
    console.error('Error al guardar película:', error);
  }
};

// ─── CRUD: Eliminación ─────────────────────────────────────────────

const confirmDelete = (id) => {
  deleteId.value = id;
  isAlertOpen.value = true;
};

const executeDelete = async () => {
  if (!deleteId.value) return;

  try {
    await peliculasService.remove(deleteId.value);
    loadPeliculas(true);
  } catch (error) {
    console.error('Error al eliminar película:', error);
  }
};

// ─── Sesión ────────────────────────────────────────────────────────

const logout = async () => {
  await authService.logout();
  router.push('/login');
};

// ─── Inicialización ────────────────────────────────────────────────

onMounted(() => loadPeliculas(true));
</script>