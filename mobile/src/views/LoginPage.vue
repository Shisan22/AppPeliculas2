<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="login-container">
        <h2>Bienvenido</h2>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="email" type="email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>
        <ion-button expand="block" @click="login" class="ion-margin-top">Iniciar Sesión</ion-button>
        <ion-button expand="block" fill="clear" @click="goToRegister">Registrarse</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { authService } from '../services/auth.service';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    await authService.login({ email: email.value, password: password.value });
    router.push('/peliculas');
  } catch (error) {
    alert('Credenciales incorrectas. Intenta de nuevo.');
  }
};

const goToRegister = () => router.push('/register');
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}
h2 {
  text-align: center;
  margin-bottom: 30px;
}
</style>