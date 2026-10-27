<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')

// TODO: replace with real navigation items once pages exist.
const links = [
  { title: 'Home', to: '/' },
  { title: 'Editing', to: '/editing' },
]
</script>

<template>
  <v-app-bar color="primary" density="comfortable">
    <v-spacer />
    <v-app-bar-title>cutRITe</v-app-bar-title>
    <v-spacer />
    <!-- Presentation only: not wired to anything yet. -->
    <v-text-field
      v-model="query"
      class="nav-search"
      placeholder="Search"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      variant="solo-filled"
      flat
      rounded
      hide-details
      single-line
      clearable
    />
    <v-btn v-for="link in links" :key="link.to" :to="link.to" variant="text">
      {{ link.title }}
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.nav-search {
  max-width: 320px;
  margin-inline: 16px;
}
</style>
