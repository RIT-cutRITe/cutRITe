<script setup lang="ts">
import type { Description } from '@/types/Description'
import router from '@/router';

import { ref, watch } from 'vue';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const props = defineProps<{
  name: string | null
}>()

const dialog = defineModel({ default:false })
const description = ref<Description>()


function close() {
  dialog.value = false
}


function handleNavigation() {
    console.log("routing to next page")
    router.push({ name: 'editing', params: { name: props.name } })

    //go to editing page for modal
    //editing page makes api call
    //parameters and svgeditor need data prop to handle
}

watch(dialog, async (newValue) => {
//here make api call
  if (newValue) {
    try {
        const res = await fetch(`${API_URL}/getDescription?name=${props.name}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: Description = await res.json()
            description.value = data
    } catch (e) {
        console.warn('Could not load generators from API, using mock data', e)
    }
  }
});


</script>

<template>

    <v-dialog
      width=500px
      v-model="dialog"
      :scrim="false"
    >
      <v-card
      >
      <h1 v-if="description">{{ description.name }}</h1>
      <p v-if="description">{{ description.description }}</p>
        
      <v-carousel hide-delimiters v-if="description">
            <v-carousel-item v-for="item in description.images"
                :src="item"
                cover
            ></v-carousel-item>
        </v-carousel>
      <template v-slot:actions>
          <v-btn 
            class="ms-auto"
            @click="handleNavigation"
          >
          Edit
        </v-btn>

        <v-btn 
        @click="close">
            Exit
        </v-btn>

        </template>
      </v-card>
    </v-dialog>

</template>
<style scoped></style>