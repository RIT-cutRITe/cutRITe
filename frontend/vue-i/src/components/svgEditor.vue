<script setup lang="ts">
const props = defineProps(['svg'])
</script>

<template>
    <v-card class="mx-auto" max-width="1200">
        <v-card-title>
            Scrollable SVG Canvas
        </v-card-title>
        <!-- container for visible frame of svvg-->
        <div class="image-viewport overflow-auto bg-grey-lighten-3">
            <!--The inner content-->
            <img
                :src="svg"
                alt="scrollable-img"
            />
        </div>
    </v-card>
</template>