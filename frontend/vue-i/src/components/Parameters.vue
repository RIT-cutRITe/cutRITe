<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
//Will later be replaced with a get... getAllParams?name=<name>
//<name> will likely be a prop? passed from homepage through
import type { Param } from '@/types/Params'
const props = defineProps<{
  name: string
}>()

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const sections = ref<Record<string, Param[]>>({})

// One reactive value per parameter, keyed by name and seeded from "default".
// v-model on each input writes back into this object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- holds strings (text/select) and booleans (checkbox)
const values = reactive<Record<string, any>>({})
const model = defineModel()

async function generate() {
  const response = await fetch(`${API_URL}/generate?name=${props.name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      values
    )
  })
  if (!response.ok) {
    console.error("generate failed", response.status, await response.text())
    return
  }
  model.value = await response.text()
}

// The export menu replaces the "format" setting Boxes.py provides.
const exportFormats = computed(
  () => Object.values(sections.value).flat().find((p) => p.name === 'format')?.options ?? [],
)

async function exportFile(format: string) {
  const response = await fetch(`${API_URL}/export?name=${props.name}&format=${format}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!response.ok) {
    console.error('export failed', response.status, await response.text())
    return
  }
  const url = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = url
  link.download = `${props.name}.${format.split('_')[0]}`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/getAllParams?name=${props.name}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const response = await res.json()
    sections.value = response.data
  } catch (e) {
    console.warn('Could not load parameters from API', e)
  }
  for (const params of Object.values(sections.value)) {
    for (const p of params) {
      values[p.name] = p.default
    }
  }
  generate() // get the default svg for this box
})
</script>

<template>
  <v-container>
    <h1>Parameters:</h1>
    <v-menu v-if="exportFormats.length">
      <template #activator="{ props: menuProps }">
        <v-btn v-bind="menuProps" color="primary" prepend-icon="mdi-download" class="mb-2">
          Export
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="format in exportFormats"
          :key="format"
          :title="format"
          @click="exportFile(format)"
        />
      </v-list>
    </v-menu>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="(params, sectionName) in sections" :key="sectionName" :title="sectionName">
        <v-expansion-panel-text>
          <template v-for="p in params.filter((p) => p.name !== 'format')" :key="p.name">
            <v-select @change="generate"
              v-if="p.type === 'select'"
              v-model="values[p.name]"
              :label="p.name"
              :items="p.options ?? []"
              :hint="p.description"
              persistent-hint
            />

            <v-checkbox @change="generate"
              v-else-if="p.type === 'checkbox'"
              v-model="values[p.name]"
              :label="p.name"
              :hint="p.description"
              persistent-hint
            />

            <!-- "text" and any unknown type fall back to a text field -->
            <v-text-field @change="generate"
              v-else
              v-model="values[p.name]"
              :label="p.name"
              :hint="p.description"
              persistent-hint
            />
          </template>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
