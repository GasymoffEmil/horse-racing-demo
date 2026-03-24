/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
export function shuffle<T>(array: T[]): T[] {
	const result = [...array]
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
			;[result[i], result[j]] = [result[j], result[i]]
	}
	return result
}

/**
 * Picks N unique random items from an array
 */
export function pickRandom<T>(array: T[], count: number): T[] {
	return shuffle(array).slice(0, count)
}
