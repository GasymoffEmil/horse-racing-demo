import { type Page, type Locator, expect } from '@playwright/test'

/**
 * Page Object Model for the main game page.
 * Encapsulates all selector logic so specs stay declarative.
 */
export class GamePage {
	readonly page: Page

	// Header controls
	readonly title: Locator
	readonly generateButton: Locator
	readonly startButton: Locator

	// Horse list widget
	readonly horseListTitle: Locator
	readonly horseListRows: Locator

	// Race program widget
	readonly raceProgramEmpty: Locator
	readonly raceProgramRounds: Locator

	// Race track widget
	readonly raceTrackEmpty: Locator
	readonly raceTrackHeader: Locator
	readonly raceTrackLanes: Locator

	// Race results widget
	readonly raceResultsEmpty: Locator
	readonly raceResultsRounds: Locator

	constructor(page: Page) {
		this.page = page

		this.title = page.locator('h1.game-page__title')
		this.generateButton = page.getByRole('button', { name: 'Generate' })
		this.startButton = page.locator('.game-page__actions button:not(:has-text("Generate"))')

		this.horseListTitle = page.locator('.horse-list__title')
		this.horseListRows = page.locator('.horse-list__table tbody tr')

		this.raceProgramEmpty = page.locator('.race-program__empty')
		this.raceProgramRounds = page.locator('.race-program__round')

		this.raceTrackEmpty = page.locator('.race-track__empty')
		this.raceTrackHeader = page.locator('.race-track__header')
		this.raceTrackLanes = page.locator('.horse-lane')

		this.raceResultsEmpty = page.locator('.race-results__empty')
		this.raceResultsRounds = page.locator('.race-results__round')
	}

	async goto(): Promise<void> {
		await this.page.goto('/')
	}

	async generate(): Promise<void> {
		await this.generateButton.click()
	}

	/** Clicks the primary race control button (Start / Pause / Resume / Restart). */
	async clickRaceControl(): Promise<void> {
		await this.startButton.click()
	}

	async waitForButtonLabel(label: 'Start' | 'Pause' | 'Resume' | 'Restart'): Promise<void> {
		await expect(this.startButton).toHaveText(label, { timeout: 5_000 })
	}

	/** Waits for round N results to appear in the results widget. */
	async waitForRoundResult(roundId: number, timeout = 30_000): Promise<Locator> {
		const roundResult = this.page.locator('.race-results__round', {
			hasText: `Round ${roundId}`,
		})
		await expect(roundResult).toBeVisible({ timeout })
		return roundResult
	}

	/** Waits until the Restart button appears, indicating all rounds are done. */
	async waitForRaceFinished(timeout = 120_000): Promise<void> {
		await expect(this.startButton).toHaveText('Restart', { timeout })
	}

	activeRoundHeader(): Locator {
		return this.page.locator('.race-program__round--active .race-program__round-header')
	}
}
