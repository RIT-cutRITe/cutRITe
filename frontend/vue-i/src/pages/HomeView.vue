<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import GeneratorCard from '@/components/GeneratorCard.vue'

import generators from '@/data/generators'
import CardModal from '@/components/CardModal.vue'
import Modal from '@/components/Modal.vue'

const page = ref(1)
const activeTab = ref('All')
const dialog = ref(false)
const selectedItem = ref(null)


//get all types
const generatorTypes = computed(() => {
  return ['All', ...new Set(generators.map((item) => item.type))]
})

//filter by selected type
const filterItems = computed(() => {
  console.log(activeTab)
  if (activeTab.value === 'All' || activeTab.value === undefined) {
    return generators
  }
  return generators.filter((i) => i.type == activeTab.value || i.type == '')
})

//reset page value when changing filter
watch(filterItems, () => {
  page.value = 1
})

</script>

<template>
  <v-app>
    <v-main>
      <v-container>
        <v-container>
          <h1 class="text-display-large">Generators</h1>

          <v-chip-group v-model="activeTab" filter>
            <v-chip
              v-for="value in generatorTypes"
              v-bind:key="value"
              :text="value"
              :value="value"
              variant="tonal"
              class="ma-2"
              base-color="grey-darken-2"
              color="orange-accent-3"
              filter
            >
            </v-chip>
          </v-chip-group>
        </v-container>

        <!-- All shown when template is not filtered-->
        <v-data-iterator :items="filterItems" :page="page" :items-per-page="8">
          <template v-slot:default="{ items }">
            <v-row>
              <v-col v-for="item in items" cols="12" md="3" lg="4" v-bind:key="item.raw.name">
               
                <!-- <GeneratorCard
                  :name="item.raw.name"
                  :image="item.raw.image"
                  :title="item.raw.title"
                  :type="item.raw.type"
                  @open="openModal"
                />
                
                <Modal v-model="dialog" :name="selectedItem"/> -->

                <CardModal
                  :name="item.raw.name"
                  :image="item.raw.image"
                  :title="item.raw.title"
                  :type="item.raw.type"
                />
                
              </v-col>
            </v-row>
          </template>

          <template v-slot:footer="{ pageCount }">
            <v-pagination v-model="page" :length="pageCount" rounded="circle"></v-pagination>
          </template>
        </v-data-iterator>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>
