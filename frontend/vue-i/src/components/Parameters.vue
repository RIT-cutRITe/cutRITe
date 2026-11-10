<script setup lang="ts">
import { reactive } from 'vue'
//Will later be replaced with a get... getAllParams?name=<name>
//<name> will likely be a prop? passed from homepage through
import paramsJson from '@/data/params.json'
import type { Param } from '@/types/Params'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// { "Settings for the Lid": [Param, ...], ... }
const sections = paramsJson.data as Record<string, Param[]>

// One reactive value per parameter, keyed by name and seeded from "default".
// v-model on each input writes back into this object.
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- holds strings (text/select) and booleans (checkbox)
const values = reactive<Record<string, any>>({})
for (const params of Object.values(sections)) {
  for (const p of params) {
    values[p.name] = p.default
  }
}
const model = defineModel()

async function generate() {
  // TODO: add box name from current box as query param instead of assuming ABox
  const response = await fetch(API_URL + "/generate" + "?name=ABox", {
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

generate() // get the default svg for this box
</script>

<template>
  <v-container>
    <h1>Parameters:</h1>
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
