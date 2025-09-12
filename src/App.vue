<template>
  <v-app class="bg-grey-lighten-4">
    <app-header />
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
</script>
