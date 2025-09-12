<script setup lang="ts">
import VitalApp from "./components/VitalApp.vue";
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="d-flex justify-center">
        <vital-app :msg="$t($t('app-name'))"/>
      </v-container>
    </v-main>
  </v-app>
</template>
