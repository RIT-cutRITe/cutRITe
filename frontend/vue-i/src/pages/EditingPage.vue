<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Parameters from '@/components/Parameters.vue';
import SvgEditor from '@/components/svgEditor.vue';

const svg_file = ref('')
const props = defineProps<{
  name: string
  advanced?: boolean
}>()
const route = useRoute()
const router = useRouter()
// The URL is the source of truth: the router maps ?advanced=true to the prop.
// Keeps all other parameters, this allows the advanced query param to be set from the parameters.vue button.
function setAdvanced(value: boolean) {
  router.replace({ query: { ...route.query, advanced: String(value) } })
}
</script>

<template>
    <div class="d-print-none">
      <!-- The current route is accessible as $route in the template -->
      <h1>{{ props.name }}</h1>
    </div>
  <!-- <v-container> -->
    <!-- <h1 class="text-h4 mb-4">Editing</h1> -->
    <!-- TODO: editing tools and preview go here -->
     <v-row size="10" no-gutters>
      <v-col cols="3" class="d-print-none">
        <!-- <v-sheet class="pa-2">Parameters here</v-sheet> -->
        <!-- @update receives the emitted advanced update from parameters.vue -->
         <parameters v-model="svg_file" @update:advanced="setAdvanced" :name="props.name" :advanced="props.advanced"></parameters> <!--Parameter dropdowns-->
      </v-col>
      <v-col cols="7" class="print-full">
        <!-- <v-sheet class="pa-2" background="primary ">Editing here</v-sheet> -->
        <svg-editor :svg="svg_file"></svg-editor>
      </v-col>
     </v-row>
  <!-- </v-container> -->
</template>

<style scoped></style>

<!-- Not scoped so it reaches Vuetify's layout -->
<style>
@media print {
  .print-full {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
  .v-container {
    padding: 0 !important;
  }
}
</style>
   