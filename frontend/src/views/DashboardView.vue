<template>
  <div class="dashboard-container">
    <h1>Dashboard Privado</h1>
    <div class="dashboard-content">
      <p>¡Hola! Has accedido a una ruta protegida con éxito.</p>
      <p>Esta vista solo es accesible si estás autenticado. El <strong>Navigation Guard</strong> del router está funcionando correctamente para proteger esta ruta privada.</p>
      
      <div class="user-info">
        <h3>Tu información de sesión:</h3>
        <p><strong>Email:</strong> {{ userEmail }}</p>
      </div>

      <router-link to="/" class="btn-primary" style="display: inline-block; margin-top: 1.5rem; text-decoration: none;">
        Ir a Películas
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      userEmail: ''
    }
  },
  created() {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.userEmail = payload.email
      }
    } catch {
      this.userEmail = 'Usuario'
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.dashboard-container h1 {
  text-align: center;
  color: #cdd6f4;
  margin-bottom: 2rem;
  font-size: 2.2rem;
}

.dashboard-content {
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 12px;
  padding: 2rem;
  color: #a6adc8;
  line-height: 1.6;
}

.user-info {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #181825;
  border-radius: 8px;
  border-left: 4px solid #89b4fa;
}

.user-info h3 {
  color: #cdd6f4;
  margin-bottom: 0.5rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #89b4fa;
  color: #1e1e2e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #74c7ec;
}
</style>
