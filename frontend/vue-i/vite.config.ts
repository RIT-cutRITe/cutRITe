import vue from '@vitejs/plugin-vue'

import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        cors: {
            // the origin you will be accessing via browser
            origin: 'http://127.0.0.1:5173', // 'http://my-backend.example.com',
        },
    },
    build: {
        // generate .vite/manifest.json in outDir
        manifest: true,

        rolldownOptions: {
            // overwrite default .html entry
            input: 'src/main.ts',
        },
    },
})
