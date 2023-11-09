import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
  },
});
