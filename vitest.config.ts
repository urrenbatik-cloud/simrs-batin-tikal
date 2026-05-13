/**
 * Vitest configuration for SIMRS BT.
 *
 * Per Session 1 EXIT addendum P1 + Owner Policy §U.4 (proof-of-concept
 * credibility — minimal critical-path tests):
 *   - Build-smoke tests verify every Server Action module loads at runtime
 *     (would have caught Bug 5: `export type { ... }` ReferenceError in
 *     "use server" file).
 *   - Service-layer unit tests verify business logic without a real DB.
 *
 * The 'server-only' module is aliased to an empty noop because Next.js
 * injects it as a build-time guard to prevent server modules from leaking
 * to the client bundle. In Vitest (Node) we run server code directly, so
 * the guard is unnecessary and would otherwise throw.
 */
import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      // Match tsconfig.json paths: "@/*": ["./*"]
      "@": path.resolve(__dirname, "."),
      // Neutralize Next.js server-only guard for test runtime
      "server-only": path.resolve(__dirname, "tests/stubs/server-only.ts"),
    },
  },
  test: {
    globals: false,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    // Server Action build-smoke tests must run sequentially — they `import`
    // modules with module-level side effects. Parallel would race.
    sequence: { concurrent: false },
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["services/**", "lib/**", "app/actions/**"],
      exclude: ["**/*.d.ts", "**/node_modules/**"],
    },
  },
})
