import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    Components({
      dirs: ["src/components/core"],
      extensions: ["vue"],
      deep: true,
      dts: "src/components/core.d.ts",
      directoryAsNamespace: false,
    }),
  ],
})
