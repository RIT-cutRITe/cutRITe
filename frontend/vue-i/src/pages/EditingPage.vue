<script setup lang="ts">
import { ref } from 'vue'
import Parameters from '@/components/Parameters.vue';
import SvgEditor from '@/components/svgEditor.vue';
// import values from '@/components/Parameters.vue'

const svg_file = ref('')
</script>

<template>
  <!-- <v-container> -->
    <!-- <h1 class="text-h4 mb-4">Editing</h1> -->
    <!-- TODO: editing tools and preview go here -->
     <v-row size="10" no-gutters>
      <v-col cols="3">
        <!-- <v-sheet class="pa-2">Parameters here</v-sheet> -->
         <parameters v-model="svg_file"></parameters> <!--Parameter dropdowns-->
      </v-col>
      <v-col cols="7">
        <!-- <v-sheet class="pa-2" background="primary ">Editing here</v-sheet> -->
        <svg-editor :svg="svg_file"></svg-editor>
      </v-col>
     </v-row>
  <!-- </v-container> -->
</template>

<style scoped></style>
   