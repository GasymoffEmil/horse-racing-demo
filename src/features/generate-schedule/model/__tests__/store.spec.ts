import { scheduleModule, type ScheduleState } from '../store'
import type { Round } from '@/entities/round/model/types'
import type { Horse } from '@/entities/horse/model/types'
import { TOTAL_ROUNDS, HORSES_PER_ROUND } from '@/shared/constants/race'

const makeHorses = (count: number): Horse[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		name: `Horse ${i + 1}`,
		color: '#ffffff',
		condition: 50,
	}))

const round: Round = {
	id: 1,
	distance: 1200,
	horses: makeHorses(10),
}

describe('schedule store — state', () => {
	it('initialises with an empty rounds array', () => {
		const state = (scheduleModule.state as () => ScheduleState)()
		expect(state.rounds).toEqual([])
	})
})

describe('schedule store — mutations', () => {
	it('SET_ROUNDS replaces the rounds array', () => {
		const state: ScheduleState = { rounds: [] }
		scheduleModule.mutations!.SET_ROUNDS(state, [round])
		expect(state.rounds).toEqual([round])
	})
})

describe('schedule store — getters', () => {
	it('allRounds returns state.rounds', () => {
		const state: ScheduleState = { rounds: [round] }
		const result = (scheduleModule.getters!.allRounds as Function)(state)
		expect(result).toEqual([round])
	})

	it('hasSchedule is false when rounds is empty', () => {
		const state: ScheduleState = { rounds: [] }
		expect((scheduleModule.getters!.hasSchedule as Function)(state)).toBe(false)
	})

	it('hasSchedule is true when rounds is non-empty', () => {
		const state: ScheduleState = { rounds: [round] }
		expect((scheduleModule.getters!.hasSchedule as Function)(state)).toBe(true)
	})

	it('getRoundById returns the matching round', () => {
		const state: ScheduleState = { rounds: [round] }
		const get = (scheduleModule.getters!.getRoundById as Function)(state)
		expect(get(1)).toEqual(round)
	})

	it('getRoundById returns undefined for an unknown id', () => {
		const state: ScheduleState = { rounds: [round] }
		const get = (scheduleModule.getters!.getRoundById as Function)(state)
		expect(get(99)).toBeUndefined()
	})
})

describe('schedule store — actions', () => {
	it('generate commits SET_ROUNDS with correct structure', () => {
		const commit = jest.fn()
		const horses = makeHorses(20)
		const rootGetters = { 'horses/allHorses': horses }
		;(scheduleModule.actions!.generate as Function)({ commit, rootGetters })

		expect(commit).toHaveBeenCalledTimes(1)
		const [mutation, payload] = commit.mock.calls[0]
		expect(mutation).toBe('SET_ROUNDS')
		expect(payload).toHaveLength(TOTAL_ROUNDS)
		payload.forEach((r: Round) => expect(r.horses).toHaveLength(HORSES_PER_ROUND))
	})
})
