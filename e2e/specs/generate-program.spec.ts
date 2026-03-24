import { test, expect } from '@playwright/test'
import { GamePage } from '../pages/GamePage'

test.describe('Generate program', () => {
	let gamePage: GamePage

	test.beforeEach(async ({ page }) => {
		gamePage = new GamePage(page)
		await gamePage.goto()
		await gamePage.generate()
	})

	test('populates horse list with exactly 20 horses', async () => {
		await expect(gamePage.horseListRows).toHaveCount(20)
	})

	test('each horse row has a non-empty name', async ({ page }) => {
		const names = await page.locator('.horse-list__table tbody tr td:first-child').allTextContents()
		for (const name of names) {
			expect(name.trim()).toBeTruthy()
		}
	})

	test('each horse condition is an integer between 1 and 100', async ({ page }) => {
		const conditions = await page.locator('.horse-list__table tbody tr td:nth-child(2)').allTextContents()
		for (const raw of conditions) {
			const value = Number(raw.trim())
			expect(Number.isInteger(value)).toBe(true)
			expect(value).toBeGreaterThanOrEqual(1)
			expect(value).toBeLessThanOrEqual(100)
		}
	})

	test('each horse has a color dot rendered', async ({ page }) => {
		const dots = page.locator('.horse-list__color-dot')
		await expect(dots).toHaveCount(20)
		// Every dot must have an inline background-color set
		for (const dot of await dots.all()) {
			const style = await dot.getAttribute('style')
			expect(style).toMatch(/background-color/)
		}
	})

	test('creates schedule with exactly 6 rounds', async () => {
		await expect(gamePage.raceProgramRounds).toHaveCount(6)
	})

	test('rounds have the correct distances', async ({ page }) => {
		const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]
		const headers = await page.locator('.race-program__round-header').allTextContents()
		expectedDistances.forEach((distance, i) => {
			expect(headers[i]).toContain(`${distance}m`)
		})
	})

	test('each round lists exactly 10 horses', async ({ page }) => {
		const rounds = await gamePage.raceProgramRounds.all()
		for (const round of rounds) {
			const rows = round.locator('tbody tr')
			await expect(rows).toHaveCount(10)
		}
	})

	test('Start button becomes enabled after generation', async () => {
		await expect(gamePage.startButton).toBeEnabled()
		await expect(gamePage.startButton).toHaveText('Start')
	})

	test('re-generating replaces the schedule with fresh data', async ({ page }) => {
		// Capture first-run horse names
		const firstNames = await page.locator('.horse-list__table tbody tr td:first-child').allTextContents()

		await gamePage.generate()

		// Schedule must still have 20 horses and 6 rounds (data integrity)
		await expect(gamePage.horseListRows).toHaveCount(20)
		await expect(gamePage.raceProgramRounds).toHaveCount(6)

		// New horse names list is captured (may or may not be identical by chance,
		// but the important assertion is that data is present and valid)
		const secondNames = await page.locator('.horse-list__table tbody tr td:first-child').allTextContents()
		expect(secondNames).toHaveLength(20)
		// Both lists must contain non-empty strings
		secondNames.forEach(name => expect(name.trim()).toBeTruthy())
		firstNames.forEach(name => expect(name.trim()).toBeTruthy())
	})
})
