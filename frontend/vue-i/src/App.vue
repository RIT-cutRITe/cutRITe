<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>
<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <v-app>
    <NavBar />
    <NavBar />
    <v-main>
      <v-container>
        <main>
          <router-view></router-view>
        </main>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
