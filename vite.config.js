import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src'),
  publicDir: "./static",
    base: "/covid-data-visualizer/",
  build: {
    outDir: '../dist',
    target: 'esnext',
  },
  server: {
    port: 8080
  }
}