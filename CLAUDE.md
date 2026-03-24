# Horse Racing — CLAUDE.md

## Project Overview

A horse racing simulation game (SPA). Users generate a program of 20 horses across 6 rounds, then start/pause/resume animated races and view results.

## Tech Stack

- **Vue 3** + **TypeScript** (strict mode)
- **Vuex 4** — namespaced modules
- **Vite 8** — dev server and build tool
- **vue3-lottie** — Lottie animation for horse sprites
- **SCSS** — global styles + scoped component styles
- **PostCSS + autoprefixer** — vendor prefixes added automatically on build
- **Jest 29 + ts-jest** — unit testing

## Scripts

```bash
npm run dev       # start dev server
npm run build     # type-check + build for production
npm run preview   # preview production build
npm test          # run all Jest unit tests
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

---

## Key Types & Interfaces

### Horse (`entities/horse/model/types.ts`)
```typescript
interface Horse {
  id: number        // 1–20
  name: string      // from HORSE_NAMES constant
  color: string     // hex color from HORSE_COLORS constant
  condition: number // 1–100, affects race speed
}
```

### Round (`entities/round/model/types.ts`)
```typescript
interface Round {
  id: number        // 1–6
  distance: number  // from ROUND_DISTANCES constant
  horses: Horse[]   // 10 randomly selected horses
}

interface RoundStanding {
  position: number   // 1–10
  horse: Horse
  finishTime: number // engine tick when horse crossed finish
}

interface RoundResult {
  roundId: number
  distance: number
  standings: RoundStanding[] // sorted by position
}

interface HorseProgress {
  horseId: number
  progress: number // 0–100
}
```

---

## State Management

Three namespaced Vuex modules registered in `app/store/index.ts`:

| Module file | Namespace | Responsibility |
|---|---|---|
| `generate-horses` | `horses` | Horse list generation |
| `generate-schedule` | `schedule` | Round schedule generation |
| `race-control` | `raceControl` | Race execution, progress, results |

### `horses` module
```
State:   { horses: Horse[] }
Actions: generate() → calls generateHorses(), commits SET_HORSES
Getters: allHorses, hasHorses
```

### `schedule` module
```
State:   { rounds: Round[] }
Actions: generate() → reads horses/allHorses, calls generateSchedule(horses), commits SET_ROUNDS
Getters: allRounds, hasSchedule, getRoundById(id)
```

### `raceControl` module
```
State: {
  isRunning: boolean
  isPaused: boolean
  currentRoundIndex: number
  progress: HorseProgress[]
  results: RoundResult[]
  isFinished: boolean
}
Actions: startRace, pauseRace, resumeRace, resetRace
Getters: isRunning, isPaused, isFinished, currentRoundIndex,
         progress, results, progressMap (Map<horseId, progress>)
```

`startRace` iterates rounds from `currentRoundIndex`, calling `runRound()` (a Promise wrapper around `RaceEngine`) sequentially. Breaks early if `isPaused` is set.

---

## RaceEngine (`features/race-control/lib/raceEngine.ts`)

Interval-based simulation (100 ms ticks). Callback-driven API — does not expose reactive state.

```typescript
class RaceEngine {
  run(
    horses: Horse[],
    onTick: (progress: HorseProgress[]) => void,
    onFinish: (standings: RoundStanding[]) => void
  ): void

  stop(): void  // clears the interval
}
```

**Speed formula per tick:**
```
speed = BASE_SPEED + (horse.condition × CONDITION_WEIGHT) + (Math.random() × RANDOM_WEIGHT × 100)
```

A single global engine instance is reused across rounds; `reset()` is called internally before each `run()`.

---

## Constants (`shared/constants/race.ts`)

```typescript
TOTAL_HORSES = 20
HORSES_PER_ROUND = 10
TOTAL_ROUNDS = 6

ROUND_DISTANCES = { 1: 1200, 2: 1400, 3: 1600, 4: 1800, 5: 2000, 6: 2200 } // metres

RACE_TICK_INTERVAL_MS = 100
BASE_SPEED = 0.8
CONDITION_WEIGHT = 0.03
RANDOM_WEIGHT = 0.02

HORSE_NAMES: string[]   // 20 names
HORSE_COLORS: string[]  // 20 hex colours, one per horse
```

## Shared Utilities (`shared/lib/random.ts`)

```typescript
randomInt(min, max): number       // inclusive range
shuffle<T>(array): T[]            // non-mutating Fisher-Yates
pickRandom<T>(array, count): T[]  // shuffle + slice
```

---

## Widgets

| Widget | File | Description |
|---|---|---|
| `HorseListWidget` | `widgets/horse-list` | Table of all 20 horses with name, color, condition |
| `RaceProgramWidget` | `widgets/race-program` | All 6 rounds with horse lineups; highlights active round |
| `RaceResultsWidget` | `widgets/race-results` | Completed round standings; highlights winner |
| `RaceTrackWidget` | `widgets/race-track` | Race visualization; renders one `HorseLane` per horse |
| `HorseLane` | `widgets/race-track/ui` | Single lane: Lottie `HorseIcon` sliding left-to-right |

**Track positioning:** Horse `left` = `progress%` (0–100%). Finish line pinned to `right: 0` of the track. Movement via `transition: left 0.1s linear`. Horse size is `90px` (defined as `horseSize` data in `HorseLane`). A spacer div with `width: horseSize` is appended after the track area.

**Control button states:** Start → Pause → Resume → Restart (based on `isRunning` / `isPaused` / `isFinished`).

---

## HorseIcon (`entities/horse/ui/HorseIcon.vue`)

Uses `vue3-lottie` to play `assets/running_horse.json`.

- **Dynamic recoloring:** `recolorAnimation()` deep-clones the Lottie JSON and replaces all non-white fill colors (`ty === 'fl'`) with the horse's hex color converted to normalized `[r, g, b, a]`. White fills (eye whites) are preserved.
- **Direction:** `scaleX(-1)` CSS transform mirrors the animation so the horse faces right (left-to-right).
- **Play/Pause:** controlled via `:pause-animation="!animated"`.

Props: `color: string`, `size: number` (default 48), `animated: boolean`.

---

## Responsive Layout (GamePage)

Three breakpoints:

| Breakpoint | Layout |
|---|---|
| Desktop ≥ 1024px | CSS grid `220px 1fr 380px` — horse list \| track \| program+results |
| Tablet 768–1023px | CSS grid `200px 1fr`, rows `1fr 210px` — horse list spans full height left; track top-right; program+results side-by-side bottom-right |
| Mobile < 768px | Flex column + bottom tab bar (`Race` / `Horses` / `Info`) — only one panel visible at a time |

**Mobile tab navigation:** `activeTab: 'track' | 'horses' | 'info'` data property on `GamePage`. Active panel gets class `game-page__panel--active`; all others are `display: none`.

**Height unit:** `height: 100dvh` — uses dynamic viewport height to avoid mobile browser chrome overlap.

---

## Cross-Browser

`autoprefixer` is configured as a PostCSS plugin in `vite.config.ts` (`css.postcss.plugins`). It reads the `browserslist` field in `package.json`:

```json
"> 0.5%, last 2 versions, not dead, iOS >= 12, Safari >= 12"
```

Vendor prefixes (`-webkit-`, etc.) are added automatically at build time — no manual prefixing needed.

---

## Testing

**Runner:** Jest 29 + ts-jest 29
**Config:** `jest.config.cjs` (`.cjs` extension required because `package.json` has `"type": "module"`)
**Command:** `npm test`

### Jest config highlights
- `testEnvironment: node`
- `transform`: `ts-jest` with inline tsconfig (`module: CommonJS`, `baseUrl: .`, `paths: { @/*: [src/*] }`)
- `moduleNameMapper`: `^@/(.*)$` → `<rootDir>/src/$1`
- `testMatch`: `**/__tests__/**/*.spec.ts`

### Test suites (64 tests total)

| Suite | Location | Covers |
|---|---|---|
| `random.spec.ts` | `shared/lib/__tests__` | `randomInt`, `shuffle`, `pickRandom` |
| `horseFactory.spec.ts` | `features/generate-horses/lib/__tests__` | `generateHorses` count, ids, names, colors, condition range |
| `scheduleFactory.spec.ts` | `features/generate-schedule/lib/__tests__` | `generateSchedule` count, distances, horse count, no duplicates |
| `raceEngine.spec.ts` | `features/race-control/lib/__tests__` | `run`, `stop`, tick callbacks, standings order — uses `jest.useFakeTimers()` |
| `horses/store.spec.ts` | `features/generate-horses/model/__tests__` | state, mutations, getters, `generate` action |
| `schedule/store.spec.ts` | `features/generate-schedule/model/__tests__` | state, mutations, getters, `generate` action |
| `raceControl/store.spec.ts` | `features/race-control/model/__tests__` | state, all mutations, all getters, `pauseRace`/`resetRace`/`resumeRace` actions |

---

## Code Style

- **Tabs** (width 4) — all `.ts` / `.vue` source files
- **Spaces** (size 2) — JSON files only
- LF line endings, UTF-8
- TypeScript strict mode: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `resolveJsonModule: true` — required for Lottie JSON import
- No ESLint/Prettier — rely on TypeScript strict mode and `.editorconfig`

## Key Patterns

- **Factory pattern** — `horseFactory.ts` (generateHorses), `scheduleFactory.ts` (generateSchedule)
- **RaceEngine** — single instance, callback-driven, Promise-wrapped per round in the store
- **Lottie recoloring** — recursive JSON clone, normalised RGB replacement, white-fill guard
- **progressMap getter** — converts `HorseProgress[]` to `Map<horseId, progress>` for O(1) lookups in templates
- **Mobile tab nav** — CSS `display: none` + `activeTab` data drives single-panel mobile view
