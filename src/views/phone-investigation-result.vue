<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>
          Scan Summary {{ route.params.scanID }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-card v-for="(item, index) in scanSummary" :key="index">
          <ion-card-content>
            <ion-label>
              <h3>{{ item[1] }}</h3>
              <p><strong>Scan ID:</strong> {{ item[0] }}</p>
              <p><strong>Timestamp:</strong> {{ item[2] }}</p>
              <p><strong>Status:</strong> {{ item[5] }}</p>
              <p><strong>Other Details:</strong> Finished: {{ item[3] }}, Pending: {{ item[4] }}</p>
            </ion-label>
            <ion-button @click="viewEventResults(item[0], route.params.scanID)" expand="block" fill="outline">Download</ion-button>

          </ion-card-content>
        </ion-card>

        <!-- Loading or No Data -->
        <ion-col>
          <p v-if="loading">Loading scan summary...</p>
          <p v-else>No scan results found.</p>
        </ion-col>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ScanManagerService from '@/services/ScanManagerService'; // Import the service

const route = useRoute(); // Access route parameters

const scanSummary = ref<any[]>([]); // Holds the scan summary data
const loading = ref(true);

const fetchScanSummary = async () => {
  loading.value = true;
  const scanID = route.params.scanID as string; // Get scanID from route params

  try {
    // Fetch scan summary data using scanID
    const response = await ScanManagerService.getScanSummary(scanID, 'type');
    scanSummary.value = response;
  } catch (error) {
    console.error('Error fetching scan summary:', error);
  } finally {
    loading.value = false;
  }
};

const viewEventResults = async (event:string, scanID: string) => {

  const response = await ScanManagerService.getEventResults(scanID, event);
  console.log(response);

};

// Fetch scan summary on mount
onMounted(() => {
  fetchScanSummary();
});
</script>
