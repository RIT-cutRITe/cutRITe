<script setup lang="ts">
import Parameters from '@/components/Parameters.vue';
import SvgEditor from '@/components/svgEditor.vue';

const props = defineProps<{
  name: string
}>()
console.log(props.name)
</script>

<template>
    <div>
      <!-- The current route is accessible as $route in the template -->
      <h1>{{ props.name }}</h1>
    </div>
  <!-- <v-container> -->
    <!-- <h1 class="text-h4 mb-4">Editing</h1> -->
    <!-- TODO: editing tools and preview go here -->
     <v-row size="10" no-gutters>
      <v-col cols="3">
        <!-- <v-sheet class="pa-2">Parameters here</v-sheet> -->
         <parameters :name="props.name"></parameters> <!--Parameter dropdowns-->
      </v-col>
      <v-col cols="7">
        <!-- <v-sheet class="pa-2" background="primary ">Editing here</v-sheet> -->
        <svg-editor></svg-editor>
      </v-col>
     </v-row>
  <!-- </v-container> -->
</template>

<style scoped></style>
   