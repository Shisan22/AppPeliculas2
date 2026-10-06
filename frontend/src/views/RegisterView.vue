<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Registrarse</h2>

      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Repite tu contraseña"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="auth-link">
        ¿Ya tienes cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { register } from '../services/auth'

export default {
  name: 'RegisterView',
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
      this.success = ''

      // Validar que las contraseñas coincidan
      if (this.password !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden'
        return
      }

      this.loading = true
      try {
        await register(this.email, this.password)
        this.success = 'Usuario registrado exitosamente. Redirigiendo...'
        setTimeout(() => {
          this.$router.push('/login')
        }, 1500)
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al registrarse'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  background: #1e1e2e;
  border: 1px solid #313244;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #cdd6f4;
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

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #89b4fa;
  color: #1e1e2e;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-primary:hover {
  background: #74c7ec;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #f38ba822;
  color: #f38ba8;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.success-message {
  background: #a6e3a122;
  color: #a6e3a1;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}

.auth-link {
  text-align: center;
  margin-top: 1rem;
  color: #a6adc8;
}

.auth-link a {
  color: #89b4fa;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
