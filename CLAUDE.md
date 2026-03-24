# Horse Racing — CLAUDE.md

## Project Overview

A horse racing simulation game (SPA). Users generate a program of 20 horses across 6 rounds, then start/pause/resume animated races and view results.

## Tech Stack

- **Vue 3** + **TypeScript** (strict mode)
- **Vuex 4** — namespaced modules
- **Vite** — dev server and build tool

## Scripts

```bash
npm run dev       # start dev server
npm run build     # type-check + build for production
npm run preview   # preview production build
```

## Architecture — Feature-Sliced Design (FSD)

```
src/
├── app/        # store init, global styles
├── entities/   # domain models: Horse, Round
├── features/   # business logic: generate-horses, generate-schedule, race-control
├── pages/      # page-level components
├── shared/     # constants, utilities, base UI, types
└── widgets/    # composite UI: horse-list, race-program, race-results, race-track
```

**Import alias:** `@/*` → `src/*`

### FSD Layer Rules

- Lower layers must not import from higher layers
- `shared` → `entities` → `features` → `widgets` → `pages` → `app`
- Each feature/entity exposes a public API via `index.ts`

## State Management

Three namespaced Vuex modules:

| Module | Namespace | Responsibility |
|---|---|---|
| `generate-horses` | `horses` | Horse list generation |
| `generate-schedule` | `schedule` | Round schedule generation |
| `race-control` | `raceControl` | Race execution, progress, results |

## Code Style

- **Tabs** for indentation (width 4) — all source files
- **Spaces** (size 2) — JSON files only
- LF line endings, UTF-8
- TypeScript strict mode enforced: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- No ESLint/Prettier — rely on TypeScript strict mode and `.editorconfig`

## Key Patterns

- **Factory pattern** — `horseFactory.ts`, `scheduleFactory.ts`
- **RaceEngine class** — interval-based (100ms ticks), callback-driven API, progress tracked per horse
