import { resolve } from 'path'

export default {
  root: resolve(__dirname, 'src'),
  publicDir: "./static",
  build: {
    outDir: '../dist',
    target: 'esnext',
    base: "https://www.oliverdesposito.com/covid-data-visualizer/",
  },
  server: {
    port: 8080
  }
}