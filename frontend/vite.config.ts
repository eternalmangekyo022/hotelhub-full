import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    TanStackRouterVite({ autoCodeSplitting: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@com": path.resolve(__dirname, "./src/components"),
      "@store": path.resolve(__dirname, "./src/store.ts"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/api/v1",
        changeOrigin: true,
      },
    },
  },
});
