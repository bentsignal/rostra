---
description: "A general overview of this project"
alwaysApply: true
---

# Agent Instructions (rostra)

`rostra` is a small TypeScript/React library plus an example Next.js app.

The goal of this package is to wrap React's context api to provide better performance by allowing users to only select small slices of the context object, preventing unnecessary re-renders.

- Package manager: `bun` (see `package.json#packageManager`)
- Library code: `src/`
- Example Next.js app: `example/`
- Typical pipeline: lint → format → test → build

## Repo Layout

- `src/`: the published library
  - `create-store.tsx`: `createStore()` factory (Provider + `useStore` hook)
  - `use-store.ts`: subscription + selector logic; throws if used outside Provider
  - `use-iso-layout-effect.ts`: `useLayoutEffect` on client / `useEffect` on server
  - `types.ts`: shared exported TS utility types
  - `deprecated/`: unused/legacy; ignore unless explicitly asked
- `example/`: a Next.js app demonstrating library usage (imports from `src/` directly)

## Install

- Install deps: `bun install`

## Common Commands (run from repo root)

### Build (library)

- Build to `dist/`: `bun run build`
- Watch build: `bun run dev`
  Notes: build tool is `tsdown` (see `tsdown.config.ts`); entry is `src/index.tsx`.

### Lint

- Lint `src/` (type-aware): `bun run lint`
- Autofix + format `src/`: `bun run lint:fix`
  Notes: lint uses `oxlint --type-aware --type-check`.

### Format

- Check formatting: `bun run format`
- Fix formatting: `bun run format:fix`
  Notes: formatting uses Prettier 3 + `@ianvs/prettier-plugin-sort-imports`.

### Test (Vitest)

- Run all tests: `bun run test`
  Notes: `vitest.config.ts` sets `environment: "jsdom"`.

#### Run a single test

- One file: `bun run test -- src/index.test.tsx`
- By name/pattern: `bun run test -- -t "placeholder test"`
- Watch mode: `bun run test -- --watch`
- Watch one file: `bun run test -- --watch src/index.test.tsx`
  Tip: pass args after `--` so Bun forwards them to Vitest.

## Example App (`example/`)

Run these from `example/`:

- Dev server: `bun run dev`
- Production build: `bun run build`
- Start production: `bun run start`
- Lint: `bun run lint`

## Release / Versioning

This repo uses Changesets.

- Publish (automation entry): `bun run release`
  Notes: config in `.changeset/config.json`; `"commit": false` (no auto-commit).

## Code Style (match existing `src/` conventions)

### General

- TypeScript `strict` is enabled (`tsconfig.json`); avoid `any`.
- Package is ESM (`"type": "module"`); prefer ESM imports/exports.
- Keep changes minimal; avoid refactors unrelated to the task.

### Formatting

- Don’t hand-format; run Prettier (or let editor/CI do it).
- Prefer multi-line JSX props once they get long (Prettier will format).

### Imports

Prettier sorts imports using `.prettierrc#importOrder`:

1. Type-only imports (`import type ...`)
2. React (`react`)
3. Other third-party modules
4. Relative imports (`./` and `../`)
   Conventions:

- Split React types into `import type` and values into normal imports.
- Prefer named imports (unless a dependency requires default imports).

### Naming

- Components: `PascalCase` (e.g. `Store`)
- Hooks: `useX` in `camelCase` (e.g. `useStore`, `useIsomorphicLayoutEffect`)
- Types: `PascalCase` (e.g. `ContextValue`, `Selector`, `Payload`)
- Generics: use descriptive names (`Value`, `SelectedValue`, `Props`).

### Types / API shape

- Prefer precise generics over `any`; use `unknown` when intentionally unconstrained.
- Use `readonly` tuples for stable payloads (pattern: `readonly [Version, Value]`).
- Put reusable exported types in `src/types.ts`.

### React store/subscription semantics

- `createStore()` builds a Context holding refs for `{ value, version, subscribers }`.
- Provider updates refs in an isomorphic layout effect and notifies subscribers with `[version, value]`.
- `useStore()` subscribes via `subscribers.push` and unsubscribes via `splice`.
- Rerender avoidance relies on `Object.is` and version checks; preserve these semantics.

### Error handling

- Throw early for programmer misuse with clear messages.
  - Pattern: `throw new Error("useStore must be used within a Store")`.
- Prefer explicit checks (e.g. sentinel `version === -1`) over silent failures.

### Public API

- Public API is re-exported from `src/index.tsx`; avoid exporting internals.

## Agent Rules (Cursor/Copilot)

- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` exist in this repo.

## Quick Summary

- `src/` is a tiny, selector-based React store utility (Provider + `useStore`).
- `example/` is a Next.js project demonstrating usage.
