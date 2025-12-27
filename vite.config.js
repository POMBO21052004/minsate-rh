import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      // "@components": path.resolve(import.meta.dirname, "./src/components"),
      // "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      // "@contexts": path.resolve(import.meta.dirname, "./src/contexts"),
      // "@layouts": path.resolve(import.meta.dirname, "./src/layouts"),
      // "@pages": path.resolve(import.meta.dirname, "./src/pages"),
    },
  },
});
