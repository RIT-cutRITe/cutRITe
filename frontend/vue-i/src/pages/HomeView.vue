<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import GeneratorCard from '@/components/GeneratorCard.vue'

import mockGenerators from '@/data/generators'
import type { Generator } from '@/types/Generator'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// Start with mock data; replace with the backend's list once it loads.
const generators = ref<Generator[]>(mockGenerators)

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/getAll`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: Record<string, Generator> = await res.json()
    generators.value = Object.values(data).map((g) => ({ ...g, title: g.title ?? '' }))
  } catch (e) {
    console.warn('Could not load generators from API, using mock data', e)
  }
})

const page = ref(1)
const activeTab = ref('All')

//get all types
const generatorTypes = computed(() => {
  return ['All', ...new Set(generators.value.map((item) => item.type))]
})

//filter by selected type
const filterItems = computed(() => {
  console.log(activeTab)
  if (activeTab.value === 'All' || activeTab.value === undefined) {
    return generators.value
  }
  return generators.value.filter((i) => i.type == activeTab.value || i.type == '')
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
                <generator-card
                  :name="item.raw.name"
                  :image="item.raw.image"
                  :title="item.raw.title"
                  :type="item.raw.type"
                >
                </generator-card>
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
