import { horsesModule, type HorsesState } from '../store'
import type { Horse } from '@/entities/horse/model/types'
import { TOTAL_HORSES } from '@/shared/constants/race'

const horse: Horse = { id: 1, name: 'Thunder', color: '#e74c3c', condition: 80 }

describe('horses store — state', () => {
	it('initialises with an empty horses array', () => {
		const state = (horsesModule.state as () => HorsesState)()
		expect(state.horses).toEqual([])
	})
})

describe('horses store — mutations', () => {
	it('SET_HORSES replaces the horses array', () => {
		const state: HorsesState = { horses: [] }
		const horses = [horse]
		horsesModule.mutations!.SET_HORSES(state, horses)
		expect(state.horses).toEqual(horses)
	})

	it('SET_HORSES overwrites a previously set list', () => {
		const state: HorsesState = { horses: [horse] }
		horsesModule.mutations!.SET_HORSES(state, [])
		expect(state.horses).toEqual([])
	})
})

describe('horses store — getters', () => {
	it('allHorses returns state.horses', () => {
		const state: HorsesState = { horses: [horse] }
		const result = (horsesModule.getters!.allHorses as Function)(state)
		expect(result).toEqual([horse])
	})

	it('hasHorses is false when list is empty', () => {
		const state: HorsesState = { horses: [] }
		expect((horsesModule.getters!.hasHorses as Function)(state)).toBe(false)
	})

	it('hasHorses is true when list is non-empty', () => {
		const state: HorsesState = { horses: [horse] }
		expect((horsesModule.getters!.hasHorses as Function)(state)).toBe(true)
	})
})

describe('horses store — actions', () => {
	it('generate commits SET_HORSES with the correct number of horses', () => {
		const commit = jest.fn()
		;(horsesModule.actions!.generate as Function)({ commit })
		expect(commit).toHaveBeenCalledTimes(1)
		const [mutation, payload] = commit.mock.calls[0]
		expect(mutation).toBe('SET_HORSES')
		expect(payload).toHaveLength(TOTAL_HORSES)
	})
})
