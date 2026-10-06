<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Registro</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="register-container">
        <h2>Crear Cuenta</h2>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="email" type="email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>
        <ion-button expand="block" @click="register" class="ion-margin-top">Registrar</ion-button>
        <ion-button expand="block" fill="clear" @click="goToLogin">Ya tengo cuenta</ion-button>
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

const register = async () => {
  try {
    await authService.register({ email: email.value, password: password.value });
    alert('Registro exitoso. Inicia sesión.');
    router.push('/login');
  } catch (error) {
    alert('Error al registrarse. Verifica los datos.');
  }
};

const goToLogin = () => router.push('/login');
</script>

<style scoped>
.register-container {
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