import { test, expect } from '@playwright/test'
import { GamePage } from '../pages/GamePage'

test.describe('Race control', () => {
	let gamePage: GamePage

	test.beforeEach(async ({ page }) => {
		gamePage = new GamePage(page)
		await gamePage.goto()
		await gamePage.generate()
	})

	// ── Starting a race ────────────────────────────────────────────────────

	test('Start button transitions to Pause after click', async () => {
		await gamePage.clickRaceControl()
		await gamePage.waitForButtonLabel('Pause')
	})

	test('Generate button is disabled while the race is running', async () => {
		await gamePage.clickRaceControl()
		await gamePage.waitForButtonLabel('Pause')
		await expect(gamePage.generateButton).toBeDisabled()
	})

	test('race track header shows Round 1 with correct distance', async () => {
		await gamePage.clickRaceControl()
		await expect(gamePage.raceTrackHeader).toBeVisible()
		await expect(gamePage.raceTrackHeader).toContainText('Round 1')
		await expect(gamePage.raceTrackHeader).toContainText('1200m')
	})

	test('race track renders 10 horse lanes for the current round', async () => {
		await gamePage.clickRaceControl()
		await expect(gamePage.raceTrackLanes).toHaveCount(10)
	})

	test('race program highlights Round 1 as active', async () => {
		await gamePage.clickRaceControl()
		const activeHeader = gamePage.activeRoundHeader()
		await expect(activeHeader).toBeVisible()
		await expect(activeHeader).toContainText('Round 1')
	})

	// ── Pause / Resume ─────────────────────────────────────────────────────

	test('Pause button transitions to Resume', async () => {
		await gamePage.clickRaceControl() // Start → running
		await gamePage.waitForButtonLabel('Pause')
		await gamePage.clickRaceControl() // Pause
		await gamePage.waitForButtonLabel('Resume')
	})

	test('Resume button transitions back to Pause', async () => {
		await gamePage.clickRaceControl() // Start
		await gamePage.waitForButtonLabel('Pause')
		await gamePage.clickRaceControl() // Pause
		await gamePage.waitForButtonLabel('Resume')
		await gamePage.clickRaceControl() // Resume
		await gamePage.waitForButtonLabel('Pause')
	})

	// ── Round completion ────────────────────────────────────────────────────

	test('results widget shows standings for Round 1 after it completes', async ({ page }) => {
		test.setTimeout(60_000)
		await gamePage.clickRaceControl()

		const round1Result = await gamePage.waitForRoundResult(1, 30_000)

		// Should list exactly 10 standings
		const rows = round1Result.locator('tbody tr')
		await expect(rows).toHaveCount(10)
	})

	test('winner row is visually highlighted in Round 1 results', async ({ page }) => {
		test.setTimeout(60_000)
		await gamePage.clickRaceControl()

		const round1Result = await gamePage.waitForRoundResult(1, 30_000)
		const winnerRow = round1Result.locator('.race-results__row--winner')

		await expect(winnerRow).toHaveCount(1)
		// Winner's position cell must read "1"
		await expect(winnerRow.locator('td').first()).toHaveText('1')
	})

	test('standings are sorted by position 1 through 10', async ({ page }) => {
		test.setTimeout(60_000)
		await gamePage.clickRaceControl()

		const round1Result = await gamePage.waitForRoundResult(1, 30_000)
		const positionCells = round1Result.locator('tbody tr td:first-child')
		const positions = (await positionCells.allTextContents()).map(Number)

		expect(positions).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
	})

	test('race program advances to Round 2 after Round 1 finishes', async ({ page }) => {
		test.setTimeout(60_000)
		await gamePage.clickRaceControl()

		// Wait until Round 1 has a result — the engine will have moved on
		await gamePage.waitForRoundResult(1, 30_000)

		// The active round header should now indicate Round 2
		const activeHeader = gamePage.activeRoundHeader()
		await expect(activeHeader).toContainText('Round 2', { timeout: 5_000 })
	})

	// ── Full race completion ────────────────────────────────────────────────

	test('all 6 rounds produce results and Restart button appears', async ({ page }) => {
		test.setTimeout(180_000)
		await gamePage.clickRaceControl()

		await gamePage.waitForRaceFinished(120_000)

		// Every round must have a result entry
		await expect(gamePage.raceResultsRounds).toHaveCount(6)
	})

	test('Restart resets race state and begins a new race', async ({ page }) => {
		test.setTimeout(180_000)
		await gamePage.clickRaceControl()
		await gamePage.waitForRaceFinished(120_000)

		// Restart
		await gamePage.clickRaceControl()

		// A new race should be running — button becomes Pause
		await gamePage.waitForButtonLabel('Pause')

		// Results widget clears
		await expect(gamePage.raceResultsEmpty).toBeVisible({ timeout: 5_000 })
	})
})
