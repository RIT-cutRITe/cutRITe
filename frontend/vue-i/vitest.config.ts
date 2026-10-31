import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      // Vuetify imports .css files, which only Vite (not Node) can load.
      server: { deps: { inline: ['vuetify'] } },
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      reporters: ['default', 'junit'],
      outputFile: { junit: './test-results/junit.xml' },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'json'], // json-summary + json are what the action reads
        reportOnFailure: true, // still report coverage when tests fail
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  }),
)
