<script setup lang="ts">

import { computed, ref } from 'vue'
import TemplateCard from '@/components/TemplateCard.vue';
import templates from '@/data/templates';

const page = ref(1)
const activeTab = ref("None")
//get all types
const templateTypes = computed(()=>[...new Set(templates.map(item => item.type))])


</script>

<template>
  <v-app>
    <v-main>
        
        <v-container>
            
            <!-- <v-tabs
                align-tabs="center"
                color="deep-purple-accent-4"
                >
                <v-tab
                v-for="t in templateTypes"
                :value=t
                >
                {{ t }}
                </v-tab>
           
            </v-tabs> -->
            

            <!-- All shown when template is not filtered-->
            <v-data-iterator :items="templates" :page="page" :items-per-page="8">
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