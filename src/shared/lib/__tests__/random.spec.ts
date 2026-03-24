import { randomInt, shuffle, pickRandom } from '../random'

describe('randomInt', () => {
	it('returns a value within [min, max]', () => {
		for (let i = 0; i < 100; i++) {
			const result = randomInt(3, 10)
			expect(result).toBeGreaterThanOrEqual(3)
			expect(result).toBeLessThanOrEqual(10)
		}
	})

	it('returns an integer', () => {
		const result = randomInt(1, 100)
		expect(Number.isInteger(result)).toBe(true)
	})

	it('returns min when min === max', () => {
		expect(randomInt(7, 7)).toBe(7)
	})

	it('can return both boundary values', () => {
		const results = new Set(Array.from({ length: 1000 }, () => randomInt(0, 1)))
		expect(results.has(0)).toBe(true)
		expect(results.has(1)).toBe(true)
	})
})

describe('shuffle', () => {
	it('returns all original elements', () => {
		const original = [1, 2, 3, 4, 5]
		const result = shuffle(original)
		expect(result.sort()).toEqual([1, 2, 3, 4, 5])
	})

	it('does not mutate the source array', () => {
		const original = [1, 2, 3, 4, 5]
		const copy = [...original]
		shuffle(original)
		expect(original).toEqual(copy)
	})

	it('returns a new array instance', () => {
		const original = [1, 2, 3]
		expect(shuffle(original)).not.toBe(original)
	})

	it('preserves array length', () => {
		const original = [10, 20, 30, 40]
		expect(shuffle(original)).toHaveLength(4)
	})

	it('handles an empty array', () => {
		expect(shuffle([])).toEqual([])
	})
})

describe('pickRandom', () => {
	const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

	it('returns the requested number of items', () => {
		expect(pickRandom(source, 4)).toHaveLength(4)
	})

	it('returns only items that exist in the source array', () => {
		const result = pickRandom(source, 6)
		result.forEach((item) => expect(source).toContain(item))
	})

	it('returns no duplicate items', () => {
		const result = pickRandom(source, 10)
		expect(new Set(result).size).toBe(10)
	})

	it('returns empty array when count is 0', () => {
		expect(pickRandom(source, 0)).toEqual([])
	})
})
