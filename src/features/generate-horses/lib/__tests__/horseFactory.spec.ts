import { generateHorses } from '../horseFactory'
import { TOTAL_HORSES, HORSE_NAMES, HORSE_COLORS } from '@/shared/constants/race'

describe('generateHorses', () => {
	let horses: ReturnType<typeof generateHorses>

	beforeEach(() => {
		horses = generateHorses()
	})

	it(`generates exactly ${TOTAL_HORSES} horses`, () => {
		expect(horses).toHaveLength(TOTAL_HORSES)
	})

	it('assigns sequential ids starting from 1', () => {
		horses.forEach((horse, index) => {
			expect(horse.id).toBe(index + 1)
		})
	})

	it('assigns names from HORSE_NAMES', () => {
		horses.forEach((horse, index) => {
			expect(horse.name).toBe(HORSE_NAMES[index])
		})
	})

	it('assigns colors from HORSE_COLORS', () => {
		horses.forEach((horse, index) => {
			expect(horse.color).toBe(HORSE_COLORS[index])
		})
	})

	it('assigns condition between 1 and 100', () => {
		horses.forEach((horse) => {
			expect(horse.condition).toBeGreaterThanOrEqual(1)
			expect(horse.condition).toBeLessThanOrEqual(100)
			expect(Number.isInteger(horse.condition)).toBe(true)
		})
	})

	it('generates different conditions on repeated calls (randomness check)', () => {
		const second = generateHorses()
		// It is astronomically unlikely all 20 conditions match across two calls
		const allSame = horses.every((h, i) => h.condition === second[i].condition)
		expect(allSame).toBe(false)
	})
})
