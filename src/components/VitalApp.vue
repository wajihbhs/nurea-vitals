<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>
</template>

<style lang="scss" scoped>
.welcome {
  color: #c52525;
}
</style>
