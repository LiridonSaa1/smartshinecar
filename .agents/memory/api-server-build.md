---
name: API server build config
description: esbuild config pitfalls for the Smart Shine api-server
---

## Rule
When adding new npm dependencies to `@workspace/api-server`, always run `pnpm install` at workspace root afterward. pnpm does not auto-link new deps to the package's node_modules.

**Why:** pnpm workspace symlinks are created at install time. Adding to package.json alone doesn't create the symlink in `artifacts/api-server/node_modules/`. esbuild then can't find the package and build fails.

## Rule
Packages that can't be bundled (native or too complex) must be added to the `external` array in `artifacts/api-server/build.mjs`. Currently externalized: multer, bcryptjs, jsonwebtoken, zod (plus many native packages).

**Why:** esbuild bundles by default. If it can't resolve a package, the build fails. Externalizing tells esbuild to skip bundling and let Node resolve at runtime.

**How to apply:** When adding a new dep that causes "Could not resolve X" in esbuild, add `"X"` to the `external` array in build.mjs and ensure `pnpm install` has been run.

## Rule
`nodePaths` in esbuild config should include both the package's own node_modules and the workspace root node_modules:
```js
nodePaths: [
  path.resolve(artifactDir, "node_modules"),
  path.resolve(artifactDir, "../../node_modules"),
],
```
