/**
 * Stub for Next.js 'server-only' package.
 *
 * In production, `import "server-only"` throws if pulled into a Client
 * Component bundle. Under Vitest (Node, no bundler), the guard is
 * irrelevant — we want to import server modules directly to test them.
 * vitest.config.ts aliases the package name to this empty module.
 */
export {}
