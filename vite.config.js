import { watch } from 'fs'
import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src'),
  base: "/covid-data-visualizer/",
  build: {
    outDir: '../dist',
    target: 'esnext',
    emptyOutDir: true,
  },
  server: {
    port: 8080,
            watch: {
            followSymlinks: false,}
  }
}