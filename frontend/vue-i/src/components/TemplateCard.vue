<script setup lang="ts">

const props = defineProps<{
  name: string
  image?: string
  title:string
}>()

</script>

<template>
    <v-card
        class="mx-auto"
        max-width="344"
        hover
        :elevation="5"
        rounded="lg"
    >
        <v-card-title
        class="headline"
        >
            {{ name }}
        </v-card-title>
        <v-card-text>
           {{title}}
        </v-card-text>
        <v-img
            height="200px"
            :src="image"
            rounded
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
