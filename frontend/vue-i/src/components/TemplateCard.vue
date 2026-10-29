<script setup lang="ts">

const props = defineProps<{
  name: string
  image?: string
  title:string
  type:string
}>()

</script>

<template>
    <v-card
        class="mx-auto"
        max-width="344"
        variant="outlined"
        border="sm opacity-25"
    >
      <v-card-item>
        <v-card-title
        class="text-title-large"
        >
            {{ name }}
        </v-card-title>
        <v-card-subtitle>
           {{title}}
        </v-card-subtitle>
      </v-card-item> 

        <v-img
            height="200px"
            :src="image"
        >
        </v-img>
      <v-card-actions>
        <v-btn
          color="orange-lighten-1"
          text="Open"
          variant="tonal"
          @click=""
        ></v-btn>
      </v-card-actions>
    </v-card>
</template>
