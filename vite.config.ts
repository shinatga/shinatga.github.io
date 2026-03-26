import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

const chunksMap: Record<string, string> = {
  three: "three-core",
  "@react-three/fiber": "r3f",
  "@react-three/drei": "r3f",
  "@react-three/postprocessing": "postprocessing",
  postprocessing: "postprocessing",
  jspdf: "export-tools",
  "@gltf-transform/core": "export-tools",
  "@gltf-transform/extensions": "export-tools",
  react: "vendor",
  "react-dom": "vendor",
  zustand: "vendor",
};

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks(id) {
          for (const [pkg, chunk] of Object.entries(chunksMap)) {
            if (id.includes(`node_modules/${pkg}/`) || id.includes(`node_modules/.pnpm/${pkg}`)) {
              return chunk;
            }
          }
        },
      },
    },
  },
});
