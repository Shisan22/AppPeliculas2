<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <router-link to="/" class="nav-brand">🎬 Películas App</router-link>

      <div class="nav-links">
        <router-link to="/" class="nav-link">Inicio</router-link>
        <template v-if="!authenticated">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Registro</router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          <span class="nav-user">{{ userEmail }}</span>
          <button class="btn-logout" @click="handleLogout">Cerrar Sesión</button>
        </template>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main>
      <router-view @login-success="checkAuth" />
    </main>
  </div>
</template>

<script>
import { logout, isAuthenticated } from './services/auth'

export default {
  name: 'App',
  data() {
    return {
      authenticated: false,
      userEmail: ''
    }
  },
  created() {
    this.checkAuth()
  },
  watch: {
    // Verificar autenticación cuando cambia la ruta
    '$route'() {
      this.checkAuth()
    }
  },
  methods: {
    checkAuth() {
      this.authenticated = isAuthenticated()
      if (this.authenticated) {
        // Decodificar el token para obtener el email
        try {
          const token = localStorage.getItem('token')
          const payload = JSON.parse(atob(token.split('.')[1]))
          this.userEmail = payload.email
        } catch {
          this.userEmail = ''
        }
      }
    },
    handleLogout() {
      logout()
      this.authenticated = false
      this.userEmail = ''
      this.$router.push('/login')
    }
  }
}
</script>

<style>
/* Estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #11111b;
  color: #cdd6f4;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1e1e2e;
  border-bottom: 1px solid #313244;
}

.nav-brand {
  font-size: 1.3rem;
  font-weight: 700;
  color: #cdd6f4;
  text-decoration: none;
}

.nav-brand:hover {
  color: #89b4fa;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: #a6adc8;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: #313244;
  color: #cdd6f4;
}

.nav-link.router-link-exact-active {
  color: #89b4fa;
  background: #313244;
}

.nav-user {
  color: #a6adc8;
  font-size: 0.9rem;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: #f38ba8;
  color: #1e1e2e;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-logout:hover {
  background: #eba0ac;
}

main {
  padding: 1rem;
}
</style>
