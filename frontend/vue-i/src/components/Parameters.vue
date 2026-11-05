<script setup lang="ts">
import { reactive } from 'vue'
//Will later be replaced with a get... getAllParams?name=<name>
//<name> will likely be a prop? passed from homepage through
import paramsJson from '@/data/params.json'
import type { Param } from '@/types/Params'

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
</script>

<template>
  <v-container>
    <h1>Parameters:</h1>
    <v-expansion-panels multiple>
      <v-expansion-panel v-for="(params, sectionName) in sections" :key="sectionName" :title="sectionName">
        <v-expansion-panel-text>
          <template v-for="p in params" :key="p.name">
            <v-select
              v-if="p.type === 'select'"
              v-model="values[p.name]"
              :label="p.name"
              :items="p.options ?? []"
              :hint="p.description"
              persistent-hint
            />

            <v-checkbox
              v-else-if="p.type === 'checkbox'"
              v-model="values[p.name]"
              :label="p.name"
              :hint="p.description"
              persistent-hint
            />

            <!-- "text" and any unknown type fall back to a text field -->
            <v-text-field
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
