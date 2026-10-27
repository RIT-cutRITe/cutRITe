<script setup lang="ts">
import SvgEditor from '@/components/svgEditor.vue';

</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-4">Editing</h1>
    <!-- TODO: editing tools and preview go here -->
     <v-row>
      <v-col cols="4">
        <v-sheet class="pa-2">Parameters here</v-sheet>
      </v-col>
      <v-col cols="8">
        <!-- <v-sheet class="pa-2" background="primary ">Editing here</v-sheet> -->
        <svg-editor></svg-editor>
      </v-col>
     </v-row>
  </v-container>
</template>

<style scoped></style>
