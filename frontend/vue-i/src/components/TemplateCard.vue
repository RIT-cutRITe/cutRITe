<script setup lang="ts">

const props = defineProps<{
  name: string
  imageURL?: string
}>()

</script>

<template>
    <v-card
        class="mx-auto"
        max-width="344"
    >
        <v-card-title
        >
            {{ name }}
        </v-card-title>
        <v-img
            height="200px"
            :src="imageURL"
            class="rounded-md"
        >
        </v-img>
        <v-card-actions>
      <v-btn
        color="teal-accent-4"
        text="Open"
        variant="text"
        @click=""
      ></v-btn>
    </v-card-actions>
    </v-card>
</template>
