import { watch } from 'fs'
import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src'),
  publicDir: "./static",
  // base: "/covid-data-visualizer/",
  build: {
    outDir: '../dist',
    target: 'esnext',
    emptyOutDir: true,
            rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('static/covid_cases_by_week.json')) {
                        return 'no-minify';
                    }
                }
            }
        },
  },
  server: {
    port: 8080,
            watch: {
            followSymlinks: false,}
  }
}