<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Phone Investigation</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <!-- Loading Indicator -->
        <ion-row>
          <ion-col>
            <ion-spinner v-if="loading" name="crescent" color="primary" />
          </ion-col>
        </ion-row>

        <!-- Form  -->
        <ion-row>
          <div id="container">
            <form @submit.prevent="handleSubmit">
              <ion-item>
                <ion-label position="floating">Phone number</ion-label>
                <ion-input v-model="domain" type="tel" required></ion-input>
              </ion-item>
              <!-- Error Message -->
              <p v-if="error" class="error-message">{{ error }}</p>

              <ion-button type="submit" expand="block" class="ion-margin-top" :disabled="loading">Start Verification</ion-button>
            </form>
          </div>
        </ion-row>

        <!-- Display Past Scans -->
        <ion-row v-if="scans.length > 0">
          <ion-col>
            <ion-list>
                <ion-item v-for="(scan, index) in scans" :key="index" :href="'phone-investigation/' + scan.scanID">
                  <ion-label>
                    <h2>View  - Scan ID: {{ scan.scanID }}</h2>
                     <p>Phone Number: {{ scan.name }}</p>
                  </ion-label>
                </ion-item>

            </ion-list>
          </ion-col>
        </ion-row>

      </ion-grid>

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
import { ref, onMounted } from 'vue';
import ScanManagerService from '../services/ScanManagerService';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonSpinner, IonTitle, IonToolbar, IonFooter, IonMenuButton, IonButtons, IonList } from '@ionic/vue';

// Reactive variables
const domain = ref('');
const loading = ref(false);
const error = ref('');
const scans = ref([]);

// Create a class to handle scan operations


// Submit form and handle the scan
const handleSubmit = async () => {
  if (!domain.value.trim()) {
    error.value = 'Please enter a valid phone number.';
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    const response = await ScanManagerService.performScan(domain.value);
    console.log(response);
    await loadScans();  // Reload scans after submission
  } catch (err) {
    console.error(err);
    error.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Load past scans when the component is mounted
const loadScans = async () => {
  scans.value = await ScanManagerService.getScans();
};



// Load scans when the component is mounted
onMounted(async () => {
  await loadScans();
});
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
</style>
