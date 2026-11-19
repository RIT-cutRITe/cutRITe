<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['svg'])

// Print page size = the SVG's mm size, so it prints to scale.
const pageSize = computed(() => {
  const tag = String(props.svg ?? '').match(/<svg[^>]*>/)?.[0] ?? ''
  const width = tag.match(/\swidth="([\d.]+)mm"/)?.[1]
  const height = tag.match(/\sheight="([\d.]+)mm"/)?.[1]
  return width && height ? `${width}mm ${height}mm` : 'auto'
})
</script>

<template>
    <component :is="'style'">@page { size: {{ pageSize }}; margin: 0 }</component>
    <v-card class="mx-auto" max-width="1200">
        <v-card-title class="d-print-none">
            Scrollable SVG Canvas
        </v-card-title>
        <!-- container for visible frame of svvg-->
        <div class="image-viewport overflow-auto bg-grey-lighten-3">
            <!--The inner content-->
            <div v-html="svg"></div>
        </div>
    </v-card>
</template>

<!-- Not scoped so it reaches Vuetify's layout -->
<style>
@media print {
  .v-main {
    padding: 0 !important;
  }
  .image-viewport {
    overflow: visible !important;
  }
  .image-viewport svg {
    display: block;
  }
  .v-card {
    box-shadow: none !important;
    max-width: none !important;
  }
}
@page {
  margin: 0;
}
</style>
