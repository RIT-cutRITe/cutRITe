<script setup lang="ts">

import { computed, ref,reactive } from 'vue'

import TemplateCard from '@/components/TemplateCard.vue';
import templates from '@/data/templates';

const page = ref(1)
const activeTab = ref('All')


//get all types
const templateTypes = computed(()=>{
    return ['All',... new Set(templates.map(item => item.type))]
}
)

//filter by selected type

const filterItems = computed(()=>{
    console.log(activeTab)
    if (activeTab.value === 'All'){
        return templates
    }
    return templates.filter(i => i.type == activeTab.value || i.type == '')
})


</script>

<template>
  <v-app>
    <v-main>
        
        <v-container>

        <v-container>
            <h1 class="text-h4 font-weight-bold mb-4">
                Templates
            </h1>

            <v-chip-group  v-model="activeTab">
                <v-chip
                v-for="value in templateTypes"
                :text=value
                :value=value
                filter
                >
                </v-chip>
            </v-chip-group>
        </v-container>
       
            
            <!-- All shown when template is not filtered-->
            <v-data-iterator :items="filterItems" :page="page" :items-per-page="8">
                <template v-slot:default="{items}">
                <v-row>
                <v-col
                    v-for="item in items"
                    cols="12"
                    md="4"
                    lg="3"
                >
                    <template-card :name=item.raw.name :image-u-r-l=item.raw.imageURL >
                    </template-card>
                
                </v-col>
                </v-row>

                </template>

                <template v-slot:footer="{ pageCount }">
                    <v-pagination v-model="page" :length="pageCount"></v-pagination>
                </template>

            </v-data-iterator>
      </v-container>

    </v-main>
  </v-app>
</template>

<style scoped></style>