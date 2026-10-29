import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default defineConfigWithVueTs(
  globalIgnores(['coverage/**', 'dist/**', 'test-results/**']),
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  // Last, so Prettier owns formatting and ESLint only reports real problems.
  prettierConfig,
)
