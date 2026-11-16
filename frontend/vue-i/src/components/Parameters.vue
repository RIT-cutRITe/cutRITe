<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
//Will later be replaced with a get... getAllParams?name=<name>
//<name> will likely be a prop? passed from homepage through
import type { Param } from '@/types/Params'
const props = withDefaults(defineProps<{
  name: string
  advanced?: boolean
}>(), { advanced: false })
// The parent owns the state (EditingPage keeps it in the URL); the button just asks for a change.
const emit = defineEmits<{ 'update:advanced': [value: boolean] }>()

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

async function loadParams() {
  try {
    const res = await fetch(`${API_URL}/getAllParams?name=${props.name}&advanced=${props.advanced}`)
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
}

onMounted(loadParams)
watch(() => props.advanced, loadParams)
</script>

<template>
  <v-container>
    <div class="d-flex align-center justify-space-between">
      <h1>Parameters:</h1>
    </div>
    <div class="d-flex align-center justify-space-between mb-2">
      <v-btn
          data-testid="advanced-toggle"
          size="small"
          rounded="pill"
          :variant="advanced ? 'flat' : 'outlined'"
          :color="advanced ? 'primary' : undefined"
          :prepend-icon="'mdi-tune-variant'"
          :aria-pressed="advanced"
          @click="emit('update:advanced', !props.advanced)"
      >
        Advanced
      </v-btn>
    </div>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="(params, sectionName) in sections" :key="sectionName" :title="sectionName">
        <v-expansion-panel-text>
          <template v-for="p in params" :key="p.name">
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
