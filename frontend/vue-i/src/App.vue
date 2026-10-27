<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <v-app>
    <NavBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped></style>
