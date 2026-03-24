# Horse Racing

A browser-based horse racing simulation game. Generate a program of 20 horses across 6 rounds, watch animated races in real time, and track standings after each round.

## Tech stack

- **Vue 3** + **TypeScript** (strict mode)
- **Vuex 4** — namespaced state modules
- **Vite** — dev server and build tool
- **vue3-lottie** — animated horse sprites
- **SCSS** — scoped component styles
- **PostCSS + autoprefixer** — automatic vendor prefixes
- **Jest 29 + ts-jest** — unit tests
- **Playwright** — end-to-end tests

## Prerequisites

- Node.js 18+
- npm 9+

## Getting started

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev
```

## Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run all Jest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests (headless) |
| `npm run test:e2e:ui` | Open the Playwright interactive UI |
| `npm run test:e2e:report` | Open the last Playwright HTML report |

## How to play

1. Click **Generate** — creates 20 horses with random names, colors, and condition scores, then builds a 6-round schedule (10 horses per round).
2. Click **Start** — the race begins. Horses move across the track based on their condition and a random factor.
3. Click **Pause** to pause mid-race; click **Resume** to continue.
4. After all 6 rounds finish the button reads **Restart** — click it to generate a new schedule and race again.

Round distances: 1200 m → 1400 m → 1600 m → 1800 m → 2000 m → 2200 m.

## Project structure

```
src/
├── app/          # Store initialization, global styles
├── entities/     # Domain models — Horse, Round
├── features/     # Business logic — generate horses, generate schedule, race engine
├── pages/        # Page-level components (GamePage)
├── shared/       # Constants, utilities, base UI components
└── widgets/      # Composite UI — horse list, race program, race track, race results
```

The architecture follows [Feature-Sliced Design](https://feature-sliced.design/): lower layers never import from higher ones (`shared` → `entities` → `features` → `widgets` → `pages` → `app`).

## Running tests

### Unit tests (Jest)

```bash
npm test
```

Covers: random utilities, horse/schedule factories, the race engine, and all three Vuex store modules. 64 tests total.

### End-to-end tests (Playwright)

```bash
# First run — installs the Chromium browser automatically if needed
npx playwright install chromium

# Run all e2e tests headless
npm run test:e2e

# Run with the interactive Playwright UI (great for debugging)
npm run test:e2e:ui
```

E2E tests are in `e2e/specs/` and use the Page Object Model (`e2e/pages/GamePage.ts`):

| Spec file | What it covers |
|---|---|
| `initial-state.spec.ts` | Page load, empty states, button states before generation |
| `generate-program.spec.ts` | Horse list, condition range, color dots, 6-round schedule, distances |
| `race-control.spec.ts` | Start/Pause/Resume cycle, track display, standings, round advancement, full race |

## Building for production

```bash
npm run build
```

Output goes to `dist/`. Vendor prefixes are added automatically by autoprefixer for the browser targets defined in `package.json` (`browserslist`).
