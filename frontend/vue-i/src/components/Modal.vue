<script setup lang="ts">
import type { Description } from '@/types/Description'
import mockDescription from '@/data/generatorDescription'
import router from '@/router';

import { ref, watch } from 'vue';


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

    //go to editiing page for modal
    //editing page makes api call
    //parameters and svgeditor need data prop to handle
}

watch(dialog, (newValue) => {
 
//here make api call
  if (newValue) {
    description.value = mockDescription
    console.log(description.value.name)
    console.log(description.value.description)
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
      <h1 v-if="description">{{ props.name }}</h1>
        
      <v-carousel hide-delimiters>
            <v-carousel-item v-if="description "v-for="item in description.images"
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