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

        <!-- Form  -->
        <ion-row>
          <div id="container">
Welcome to the Phone Investigation Result page
          </div>
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
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import ScanManagerService from '../services/ScanManagerService';

const route = useRoute();
const scanID = route.params.scanID; // Access the scanID from the route parameters

console.log('Scan ID:', scanID);
// You can now use `scanID` to fetch data or display information about the scan


const resulsts = ref([]);

// Load past scans when the component is mounted
const loadResults = async () => {

  const response =  await ScanManagerService.getScanSummary(scanID, 'type');

  console.log(response);

  resulsts.value = response;
};

onMounted(async () => {
  await loadResults();
});

// Call the getScanSummary method when the user clicks on "Get Summary"
// const getScanSummary = async (scanID: string, type: string) => {
//   loading.value = true;
//   try {
//     const summary = await ScanManagerService.getScanSummary(scanID, type);
//     console.log('Scan Summary:', summary);
//   } catch (error) {
//     console.error('Error fetching summary:', error);
//   } finally {
//     loading.value = false;
//   }
// };
</script>