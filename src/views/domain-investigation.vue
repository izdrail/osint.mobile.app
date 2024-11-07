<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          Domain Investigation
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Run a domain investigation
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <form @submit.prevent="handleSubmit">
          <ion-item>
            <ion-label position="floating">Domain</ion-label>
            <ion-input v-model="domain" type="url" required></ion-input>
          </ion-item>

          <!-- Loading Indicator -->
          <ion-spinner v-if="loading" name="crescent" color="primary" />

          <!-- Error Message -->
          <p v-if="error" class="error-message">{{ error }}</p>

          <ion-button type="submit" expand="block" class="ion-margin-top" :disabled="loading">Start Verification</ion-button>
        </form>
      </div>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-title>
          Built for <a href="https://hackathon.developer.orange.com/">Orange Hackathon {{ new Date().getFullYear() }}</a>
        </ion-title>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonFooter, IonSpinner } from '@ionic/vue';
import { ref } from 'vue';
import {Http} from '@capacitor/http';

const domain = ref('');
const loading = ref(false);  // Loading state
const error = ref('');       // Error state

const handleSubmit = () => {
  error.value = '';           // Reset error state
  loading.value = true;       // Show loading indicator

  Http.request({
    method: 'POST',
    url: 'api/startscan',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'en-GB,en;q=0.9',
      'Cache-Control': 'max-age=0',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: {
      scanname: domain.value,
      scantarget: domain.value,
      usecase: 'all',
      modulelist: '',
      typelist: ''
    }
  })
      .then(res => {
        console.log(res);
        loading.value = false;    // Hide loading indicator on success
      })
      .catch(err => {
        error.value = 'An error occurred. Please try again.'; // Set error message
        console.log(err);
        loading.value = false;    // Hide loading indicator on error
      });

};
</script>

<style scoped>

#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: 30px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}

.ion-margin-top {
  margin-top: 20px;
}
</style>
