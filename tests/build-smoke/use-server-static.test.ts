/**
 * Static analysis: "use server" files MUST NOT contain non-Server-Action exports.
 *
 * Origin: Session 1 Bug 5. The file `app/actions/encounter-actions.ts` had
 * `export type { ActionState }`. TypeScript was happy; `tsc --noEmit` passed;
 * `next build` passed; Vitest module-load tests would also pass (Vite/esbuild
 * properly erase type re-exports). But Next.js + Turbopack at PRODUCTION
 * RUNTIME emitted a runtime reference to `ActionState` (a type identifier)
 * in the compiled module — ReferenceError at module evaluation time.
 *
 * The cheapest reliable defense is a static check on the file contents.
 * No compilation, no execution — just regex on `"use server"` files.
 *
 * Rules enforced:
 *   1. No `export type { ... }` re-export (line-level)
 *   2. No `export { type X, ... }` mixed re-export
 *   3. No `export * from "..."` (always too permissive — re-exports types)
 *   4. No `export default` of anything that isn't an async function literal
 *      (Server Actions are named exports; default exports are likely typed)
 *
 * Allowed:
 *   - `export async function xxx(...)` — the Server Action itself
 *   - `export interface Foo {}`, `export type Foo = ...` — INLINE type
 *     declarations (TypeScript erases them at compile time properly)
 *   - `import type { Foo } from "..."` — type-only imports (erased)
 */
import { describe, it, expect } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const ACTIONS_DIR = join(__dirname, "..", "..", "app", "actions")

function findUseServerFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      out.push(...findUseServerFiles(full))
      continue
    }
    if (!entry.endsWith(".ts") && !entry.endsWith(".tsx")) continue
    const content = readFileSync(full, "utf8")
    // Match `"use server"` or `'use server'` as the FIRST statement
    if (/^[\s\n]*["']use server["']/.test(content)) {
      out.push(full)
    }
  }
  return out
}

describe('static check: "use server" files', () => {
  const files = findUseServerFiles(ACTIONS_DIR)

  it("finds at least one Server Action file (sanity)", () => {
    expect(files.length).toBeGreaterThan(0)
  })

  for (const file of files) {
    const rel = file.replace(process.cwd() + "/", "")

    it(`${rel} has no type-only re-exports (Bug 5 guard)`, () => {
      const content = readFileSync(file, "utf8")
      // Strip line/block comments before regex check (comments don't ship to runtime)
      const stripped = content
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/(^|[^:])\/\/[^\n]*/g, "$1")

      // Rule 1: bare `export type { ... }` re-export form (the Bug 5 form)
      const typeReExport = /^\s*export\s+type\s*\{/m
      expect(stripped, `Found 'export type { ... }' — see Session 1 Bug 5`).not.toMatch(
        typeReExport,
      )

      // Rule 2: mixed `export { type X, ... }`
      const mixedTypeReExport = /^\s*export\s*\{[^}]*\btype\s+\w+/m
      expect(stripped, "Found 'export { type X }' mixed re-export").not.toMatch(
        mixedTypeReExport,
      )

      // Rule 3: re-export star (cannot enforce type-only filter at runtime)
      const starReExport = /^\s*export\s*\*\s*from\s+["']/m
      expect(stripped, "Found 'export * from ...' — too permissive in 'use server'").not.toMatch(
        starReExport,
      )

      // Rule 4: export default (Server Actions should be named exports)
      const exportDefault = /^\s*export\s+default\b/m
      expect(stripped, "Found 'export default' — Server Actions should be named exports").not.toMatch(
        exportDefault,
      )
    })
  }
})
