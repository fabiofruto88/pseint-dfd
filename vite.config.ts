import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
  server: {
    port: 4173,
    strictPort: true, // opcional: falla si el puerto está ocupado
  },
});
