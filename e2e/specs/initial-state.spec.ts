import { test, expect } from '@playwright/test'
import { GamePage } from '../pages/GamePage'

test.describe('Initial state', () => {
	let gamePage: GamePage

	test.beforeEach(async ({ page }) => {
		gamePage = new GamePage(page)
		await gamePage.goto()
	})

	test('renders the page title', async () => {
		await expect(gamePage.title).toHaveText('Horse Racing')
	})

	test('Generate button is visible and enabled', async () => {
		await expect(gamePage.generateButton).toBeVisible()
		await expect(gamePage.generateButton).toBeEnabled()
	})

	test('Start button is visible but disabled before generation', async () => {
		await expect(gamePage.startButton).toBeVisible()
		await expect(gamePage.startButton).toBeDisabled()
		await expect(gamePage.startButton).toHaveText('Start')
	})

	test('horse list table is empty', async () => {
		await expect(gamePage.horseListRows).toHaveCount(0)
	})

	test('race program shows empty state message', async () => {
		await expect(gamePage.raceProgramEmpty).toBeVisible()
		await expect(gamePage.raceProgramEmpty).toContainText('No schedule generated yet')
	})

	test('race track shows placeholder prompt', async () => {
		await expect(gamePage.raceTrackEmpty).toBeVisible()
		await expect(gamePage.raceTrackEmpty).toContainText('Generate a program and press Start')
	})

	test('race results shows empty state message', async () => {
		await expect(gamePage.raceResultsEmpty).toBeVisible()
		await expect(gamePage.raceResultsEmpty).toContainText('Results will appear here after each round')
	})
})
