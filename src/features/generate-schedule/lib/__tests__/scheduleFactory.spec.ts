import { generateSchedule } from '../scheduleFactory'
import { TOTAL_ROUNDS, HORSES_PER_ROUND, ROUND_DISTANCES } from '@/shared/constants/race'
import type { Horse } from '@/entities/horse/model/types'

const makeHorses = (count: number): Horse[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		name: `Horse ${i + 1}`,
		color: '#ffffff',
		condition: 50,
	}))

describe('generateSchedule', () => {
	const horses = makeHorses(20)
	let rounds: ReturnType<typeof generateSchedule>

	beforeEach(() => {
		rounds = generateSchedule(horses)
	})

	it(`generates exactly ${TOTAL_ROUNDS} rounds`, () => {
		expect(rounds).toHaveLength(TOTAL_ROUNDS)
	})

	it('assigns sequential ids starting from 1', () => {
		rounds.forEach((round, index) => {
			expect(round.id).toBe(index + 1)
		})
	})

	it('assigns the correct distance for each round', () => {
		rounds.forEach((round) => {
			expect(round.distance).toBe(ROUND_DISTANCES[round.id])
		})
	})

	it(`assigns exactly ${HORSES_PER_ROUND} horses per round`, () => {
		rounds.forEach((round) => {
			expect(round.horses).toHaveLength(HORSES_PER_ROUND)
		})
	})

	it('only assigns horses from the provided pool', () => {
		const horseIds = new Set(horses.map((h) => h.id))
		rounds.forEach((round) => {
			round.horses.forEach((horse) => {
				expect(horseIds.has(horse.id)).toBe(true)
			})
		})
	})

	it('has no duplicate horses within a single round', () => {
		rounds.forEach((round) => {
			const ids = round.horses.map((h) => h.id)
			expect(new Set(ids).size).toBe(ids.length)
		})
	})
})
