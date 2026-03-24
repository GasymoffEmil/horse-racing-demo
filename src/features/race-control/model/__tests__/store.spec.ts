import { raceControlModule, type RaceControlState } from '../store'
import type { HorseProgress, RoundResult } from '@/entities/round/model/types'

const makeState = (): RaceControlState => ({
	isRunning: false,
	isPaused: false,
	currentRoundIndex: 0,
	progress: [],
	results: [],
	isFinished: false,
})

const makeResult = (): RoundResult => ({
	roundId: 1,
	distance: 1200,
	standings: [],
})

describe('raceControl store — state', () => {
	it('initialises with correct defaults', () => {
		const state = (raceControlModule.state as () => RaceControlState)()
		expect(state).toEqual(makeState())
	})
})

describe('raceControl store — mutations', () => {
	it('SET_RUNNING updates isRunning', () => {
		const state = makeState()
		raceControlModule.mutations!.SET_RUNNING(state, true)
		expect(state.isRunning).toBe(true)
	})

	it('SET_PAUSED updates isPaused', () => {
		const state = makeState()
		raceControlModule.mutations!.SET_PAUSED(state, true)
		expect(state.isPaused).toBe(true)
	})

	it('SET_FINISHED updates isFinished', () => {
		const state = makeState()
		raceControlModule.mutations!.SET_FINISHED(state, true)
		expect(state.isFinished).toBe(true)
	})

	it('SET_CURRENT_ROUND_INDEX updates currentRoundIndex', () => {
		const state = makeState()
		raceControlModule.mutations!.SET_CURRENT_ROUND_INDEX(state, 3)
		expect(state.currentRoundIndex).toBe(3)
	})

	it('SET_PROGRESS replaces progress array', () => {
		const state = makeState()
		const progress: HorseProgress[] = [{ horseId: 1, progress: 42 }]
		raceControlModule.mutations!.SET_PROGRESS(state, progress)
		expect(state.progress).toEqual(progress)
	})

	it('ADD_RESULT appends a result', () => {
		const state = makeState()
		const result = makeResult()
		raceControlModule.mutations!.ADD_RESULT(state, result)
		expect(state.results).toHaveLength(1)
		expect(state.results[0]).toEqual(result)
	})

	it('RESET restores initial state', () => {
		const state: RaceControlState = {
			isRunning: true,
			isPaused: true,
			currentRoundIndex: 4,
			progress: [{ horseId: 1, progress: 80 }],
			results: [makeResult()],
			isFinished: true,
		}
		raceControlModule.mutations!.RESET(state)
		expect(state).toEqual(makeState())
	})
})

describe('raceControl store — getters', () => {
	it('isRunning returns state.isRunning', () => {
		const state = { ...makeState(), isRunning: true }
		expect((raceControlModule.getters!.isRunning as Function)(state)).toBe(true)
	})

	it('isPaused returns state.isPaused', () => {
		const state = { ...makeState(), isPaused: true }
		expect((raceControlModule.getters!.isPaused as Function)(state)).toBe(true)
	})

	it('isFinished returns state.isFinished', () => {
		const state = { ...makeState(), isFinished: true }
		expect((raceControlModule.getters!.isFinished as Function)(state)).toBe(true)
	})

	it('progress returns state.progress', () => {
		const progress: HorseProgress[] = [{ horseId: 5, progress: 60 }]
		const state = { ...makeState(), progress }
		expect((raceControlModule.getters!.progress as Function)(state)).toEqual(progress)
	})

	it('progressMap converts progress array to a Map keyed by horseId', () => {
		const progress: HorseProgress[] = [
			{ horseId: 1, progress: 25 },
			{ horseId: 2, progress: 75 },
		]
		const state = { ...makeState(), progress }
		const map: Map<number, number> = (raceControlModule.getters!.progressMap as Function)(state)
		expect(map.get(1)).toBe(25)
		expect(map.get(2)).toBe(75)
	})

	it('results returns state.results', () => {
		const results = [makeResult()]
		const state = { ...makeState(), results }
		expect((raceControlModule.getters!.results as Function)(state)).toEqual(results)
	})
})

describe('raceControl store — actions', () => {
	it('pauseRace commits SET_PAUSED(true) and SET_RUNNING(false)', () => {
		const commit = jest.fn()
		;(raceControlModule.actions!.pauseRace as Function)({ commit })
		expect(commit).toHaveBeenCalledWith('SET_PAUSED', true)
		expect(commit).toHaveBeenCalledWith('SET_RUNNING', false)
	})

	it('resetRace commits RESET', () => {
		const commit = jest.fn()
		;(raceControlModule.actions!.resetRace as Function)({ commit })
		expect(commit).toHaveBeenCalledWith('RESET')
	})

	it('resumeRace dispatches startRace', () => {
		const dispatch = jest.fn()
		;(raceControlModule.actions!.resumeRace as Function)({ dispatch })
		expect(dispatch).toHaveBeenCalledWith('startRace')
	})
})
