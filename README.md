<div align="center">

# 🎬 APP Películas

### Sistema completo de gestión de películas con API REST, cliente web y aplicación móvil

[![NestJS](https://img.shields.io/badge/Backend-NestJS-ea2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Vue.js](https://img.shields.io/badge/Frontend-Vue%203-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Ionic](https://img.shields.io/badge/Mobile-Ionic%209-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Capacitor](https://img.shields.io/badge/Native-Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

---

**Esteban Quiceno Loaiza** · ID 00491736

*Paradigmas de Programación — Taller #1 & Taller #2*

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Rápida](#-instalación-rápida)
- [Ejecución del Backend](#-ejecución-del-backend)
- [Ejecución del Frontend Web](#-ejecución-del-frontend-web)
- [Ejecución del Cliente Móvil](#-ejecución-del-cliente-móvil)
- [Compilación para Android](#-compilación-para-android-plus)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Funcionalidades](#-funcionalidades)

---

## 📖 Descripción

Este proyecto es un **monorepo** que contiene tres aplicaciones interconectadas para gestionar un catálogo de películas:

| Capa | Taller | Descripción |
|------|--------|-------------|
| **Backend** | Taller #1 | API REST construida con NestJS, Prisma y SQLite. Maneja autenticación JWT y CRUD de películas. |
| **Frontend Web** | Taller #1 | Cliente web con Vue 3 y Vite que consume la API. |
| **Cliente Móvil** | Taller #2 | Aplicación móvil con Ionic Vue que replica las funcionalidades del frontend web, con scroll infinito, modales nativos y empaquetado Android con Capacitor. |

> El cliente móvil **no reescribe el backend**. Consume exactamente la misma API REST del Taller #1.

---

## 🏗 Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    Base de Datos                        │
│                      SQLite                             │
│              (dev.db — Películas, Users)                 │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  Backend (NestJS)                        │
│         http://localhost:3000                            │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Auth Module  │  │  Peliculas   │  │    Prisma     │  │
│  │  /auth/*     │  │  /peliculas  │  │   Service     │  │
│  │  JWT + Bcrypt│  │   CRUD       │  │   ORM         │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└──────────┬──────────────────────────────────┬───────────┘
           │                                  │
           ▼                                  ▼
┌─────────────────────┐          ┌─────────────────────────┐
│  Frontend Web (Vue) │          │  Cliente Móvil (Ionic)   │
│  http://localhost:5173         │  http://localhost:8100    │
│                     │          │                          │
│  • Vue Router       │          │  • Ionic Vue Router      │
│  • Axios            │          │  • Axios + Interceptor   │
│  • Vite             │          │  • Capacitor Preferences │
│                     │          │  • ion-infinite-scroll   │
│                     │          │  • ion-modal / ion-alert │
└─────────────────────┘          └──────────────────────────┘
```

---

## 🛠 Tecnologías

### Backend
| Tecnología | Uso |
|------------|-----|
| **NestJS** | Framework de servidor (controladores, servicios, módulos) |
| **Prisma** | ORM para interactuar con la base de datos de forma tipada |
| **SQLite** | Base de datos ligera embebida (archivo `dev.db`) |
| **JWT** | Autenticación stateless con tokens firmados |
| **Bcrypt** | Encriptación de contraseñas en la base de datos |

### Frontend Web
| Tecnología | Uso |
|------------|-----|
| **Vue 3** | Framework reactivo con Composition API |
| **Vue Router** | Navegación SPA |
| **Axios** | Cliente HTTP |
| **Vite** | Empaquetador y servidor de desarrollo |

### Cliente Móvil
| Tecnología | Uso |
|------------|-----|
| **Ionic 9** | Componentes nativos de UI móvil |
| **Vue 3** | Framework reactivo (`<script setup>`) |
| **Capacitor** | Puente web → nativo (Android) |
| **@capacitor/preferences** | Almacenamiento persistente del JWT |
| **Axios** | Cliente HTTP con interceptor centralizado |

---

## 📦 Requisitos Previos

- [**Node.js**](https://nodejs.org/) v18 o superior
- **npm** (incluido con Node.js)
- [**Ionic CLI**](https://ionicframework.com/docs/cli) (opcional, para `ionic serve`)
  ```bash
  npm install -g @ionic/cli
  ```
- [**Android Studio**](https://developer.android.com/studio) (solo para el plus de empaquetado nativo)

---

## ⚡ Instalación Rápida

Clona el repositorio e instala las dependencias de las tres aplicaciones:

```bash
# Clonar el repositorio
git clone https://github.com/Shisan22/APP-peliculas.git
cd APP-peliculas

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend web
cd ../frontend
npm install

# Instalar dependencias del cliente móvil
cd ../mobile
npm install
```

---

## 🖥 Ejecución del Backend

```bash
cd backend
npm run start:dev
```

El servidor arrancará en **http://localhost:3000**.

> **Variables de entorno:** El archivo `.env` ya está configurado con:
> - `DATABASE_URL="file:./dev.db"` — Ruta de la base de datos SQLite
> - `JWT_SECRET="tu_secreto_aqui"` — Clave secreta para firmar los tokens JWT

---

## 🌐 Ejecución del Frontend Web

> ⚠️ **Requiere que el backend esté corriendo.**

```bash
cd frontend
npm run dev
```

Se abrirá en **http://localhost:5173**.

---

## 📱 Ejecución del Cliente Móvil

> ⚠️ **Requiere que el backend esté corriendo.**

```bash
cd mobile

# Opción 1: Con Ionic CLI instalado
ionic serve

# Opción 2: Sin Ionic CLI
npx ionic serve
```

Se abrirá en **http://localhost:8100**.

> **💡 Tip:** Para simular un dispositivo móvil, abre DevTools (F12) y activa el "Toggle device toolbar" (Ctrl+Shift+M).

---

## 📲 Compilación para Android (Plus)

```bash
cd mobile

# 1. Compilar la aplicación web
npm run build

# 2. Sincronizar con el proyecto nativo
npx cap sync android

# 3. Abrir en Android Studio
npx cap open android
```

En Android Studio, presiona **▶ Run** con un emulador abierto o un dispositivo conectado por USB.

---

## 📁 Estructura del Proyecto

```
APP-peliculas/
│
├── backend/                      🖥  API REST (Taller #1)
│   ├── src/
│   │   ├── auth/                 →  Módulo de autenticación (JWT + Bcrypt)
│   │   ├── peliculas/            →  Módulo CRUD de películas
│   │   ├── prisma/               →  Servicio de conexión a la base de datos
│   │   └── generated/prisma/     →  Cliente Prisma generado automáticamente
│   ├── prisma/schema.prisma      →  Definición de modelos (Pelicula, User)
│   ├── dev.db                    →  Base de datos SQLite
│   └── package.json
│
├── frontend/                     🌐  Cliente Web (Taller #1)
│   ├── src/
│   │   ├── views/                →  Vistas de Vue (Login, Películas)
│   │   ├── services/             →  Servicios HTTP (Axios)
│   │   └── router/               →  Definición de rutas
│   └── package.json
│
├── mobile/                       📱  Cliente Móvil (Taller #2)
│   ├── src/
│   │   ├── views/                →  Vistas de Ionic Vue
│   │   │   ├── LoginPage.vue     →  Inicio de sesión
│   │   │   ├── RegisterPage.vue  →  Registro de usuario
│   │   │   └── PeliculasPage.vue →  CRUD completo + scroll infinito
│   │   ├── services/
│   │   │   ├── api.ts            →  Axios centralizado + interceptor JWT
│   │   │   ├── auth.service.ts   →  Login, registro, logout (Preferences)
│   │   │   └── peliculas.service.ts → findAll, create, update, remove
│   │   ├── router/index.ts       →  Rutas + navigation guard
│   │   └── main.ts               →  Punto de entrada (Vue + Ionic)
│   ├── android/                  →  Proyecto nativo Android (Capacitor)
│   ├── capacitor.config.ts       →  Configuración de Capacitor
│   ├── explicacion_proyecto.txt  →  Documentación detallada archivo por archivo
│   └── package.json
│
└── README.md                     ←  Este archivo
```

---

## 🔌 Endpoints de la API

### Autenticación

| Método | Ruta | Descripción | Body |
|--------|------|-------------|------|
| `POST` | `/auth/register` | Registrar un usuario | `{ email, password }` |
| `POST` | `/auth/login` | Iniciar sesión | `{ email, password }` |

> **Respuesta del login:** `{ access_token: "eyJhbGci..." }`

### Películas (🔒 Requieren JWT)

| Método | Ruta | Descripción | Body / Params |
|--------|------|-------------|---------------|
| `GET` | `/peliculas` | Listar con paginación y búsqueda | `?search=&page=1&limit=20` |
| `POST` | `/peliculas` | Crear película | `{ nombre, imagen, genero, anio }` |
| `PATCH` | `/peliculas/:id` | Actualizar película | `{ nombre?, imagen?, genero?, anio? }` |
| `DELETE` | `/peliculas/:id` | Eliminar película | — |

> Todas las peticiones protegidas requieren el header:
> `Authorization: Bearer <token>`

---

## ✨ Funcionalidades

### 🔐 Autenticación
- [x] Registro de usuarios con contraseña encriptada (Bcrypt)
- [x] Inicio de sesión con JWT
- [x] Persistencia del token con Capacitor Preferences
- [x] Interceptor centralizado de Axios para inyectar el JWT
- [x] Navigation guard que protege rutas privadas

### 🎬 CRUD de Películas
- [x] Listado con imágenes, género y año
- [x] Búsqueda por nombre con `ion-searchbar`
- [x] Scroll infinito con `ion-infinite-scroll`
- [x] Creación y edición con `ion-modal`
- [x] Confirmación de eliminación con `ion-alert`
- [x] Optimización de memoria (límite de 60 elementos en DOM)

### 📱 Componentes Ionic utilizados
- [x] `ion-page`, `ion-header`, `ion-content`, `ion-toolbar`
- [x] `ion-list`, `ion-item`, `ion-thumbnail`, `ion-label`
- [x] `ion-searchbar`
- [x] `ion-infinite-scroll`, `ion-infinite-scroll-content`
- [x] `ion-modal`
- [x] `ion-alert`
- [x] `ion-fab`, `ion-fab-button`
- [x] `ion-button`, `ion-input`, `ion-icon`

### 📲 Empaquetado Nativo (Plus)
- [x] Plataforma Android agregada con Capacitor
- [x] Proyecto de Android Studio generado y listo para compilar

---

<div align="center">

Hecho por **Esteban Quiceno Loaiza**

</div>