<script setup lang="ts">
const props = defineProps<{
  name: string
  image?: string
  title: string
  type: string
}>()
</script>

<template>
  <v-card class="mx-auto" width="300px" variant="outlined" border="sm opacity-25">
    <v-card-item>
      <v-card-title class="text-title-large">
        {{ props.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ props.title }}
      </v-card-subtitle>
    </v-card-item>

    <v-img height="200px" :src="props.image"></v-img>
    <v-chip class="mt-2 mb-2 ml-2" variant="outlined" size="small" border="sm opacity-25">{{
      props.title
    }}</v-chip>

    <v-divider></v-divider>
    <v-card-actions>
      <v-btn color="orange-lighten-1" text="Open" variant="tonal"></v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>