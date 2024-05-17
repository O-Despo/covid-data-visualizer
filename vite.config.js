import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src'),
  publicDir: "./static",
  build: {
    outDir: '../dist',
    target: 'esnext',
    base: "/covid-data-visualizer/",
  },
  server: {
    port: 8080
  }
}