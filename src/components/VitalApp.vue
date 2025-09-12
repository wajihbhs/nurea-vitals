<script setup lang="ts">

defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>
  <p class="welcome">Welcome to my Nurea Vital App</p>
</template>

<style lang="scss" scoped>
.welcome {
  color: #c52525;
}
</style>
