import { defineConfig } from 'cypress'

export default defineConfig({
  reporter: 'junit',
  reporterOptions: { mochaFile: 'test-results/cypress-[hash].xml' },
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173',
  },
})
