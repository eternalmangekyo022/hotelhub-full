// vite.config.ts
import { defineConfig } from "file:///C:/Users/kszc/Desktop/hotelhub-full/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/kszc/Desktop/hotelhub-full/frontend/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { TanStackRouterVite } from "file:///C:/Users/kszc/Desktop/hotelhub-full/frontend/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import tailwindcss from "file:///C:/Users/kszc/Desktop/hotelhub-full/frontend/node_modules/@tailwindcss/vite/dist/index.mjs";
import path from "node:path";
var __vite_injected_original_dirname = "C:\\Users\\kszc\\Desktop\\hotelhub-full\\frontend";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    TanStackRouterVite({ autoCodeSplitting: true })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@com": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@store": path.resolve(__vite_injected_original_dirname, "./src/store.ts"),
      "@hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/api/v1",
        changeOrigin: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxrc3pjXFxcXERlc2t0b3BcXFxcaG90ZWxodWItZnVsbFxcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxca3N6Y1xcXFxEZXNrdG9wXFxcXGhvdGVsaHViLWZ1bGxcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2tzemMvRGVza3RvcC9ob3RlbGh1Yi1mdWxsL2Zyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI7XG5pbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZVwiO1xuaW1wb3J0IHRhaWx3aW5kY3NzIGZyb20gXCJAdGFpbHdpbmRjc3Mvdml0ZVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdGFpbHdpbmRjc3MoKSxcbiAgICBUYW5TdGFja1JvdXRlclZpdGUoeyBhdXRvQ29kZVNwbGl0dGluZzogdHJ1ZSB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICAgIFwiQGNvbVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2NvbXBvbmVudHNcIiksXG4gICAgICBcIkBzdG9yZVwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3N0b3JlLnRzXCIpLFxuICAgICAgXCJAaG9va3NcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9ob29rc1wiKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwcm94eToge1xuICAgICAgXCIvYXBpXCI6IHtcbiAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcGkvdjFcIixcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtVLFNBQVMsb0JBQW9CO0FBQy9WLE9BQU8sV0FBVztBQUNsQixTQUFTLDBCQUEwQjtBQUNuQyxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osbUJBQW1CLEVBQUUsbUJBQW1CLEtBQUssQ0FBQztBQUFBLEVBQ2hEO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsUUFBUSxLQUFLLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDbEQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDbEQsVUFBVSxLQUFLLFFBQVEsa0NBQVcsYUFBYTtBQUFBLElBQ2pEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
