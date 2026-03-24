import type { Module } from 'vuex'
import type { RootState } from '@/app/store/types'
import type { Round } from '@/entities/round/model/types'
import { generateSchedule } from '../lib/scheduleFactory'

export interface ScheduleState {
	rounds: Round[]
}

export const scheduleModule: Module<ScheduleState, RootState> = {
	namespaced: true,

	state: (): ScheduleState => ({
		rounds: [],
	}),

	mutations: {
		SET_ROUNDS(state, rounds: Round[]) {
			state.rounds = rounds
		},
	},

	actions: {
		generate({ commit, rootGetters }) {
			const horses = rootGetters['horses/allHorses']
			const rounds = generateSchedule(horses)
			commit('SET_ROUNDS', rounds)
		},
	},

	getters: {
		allRounds: (state): Round[] => state.rounds,
		hasSchedule: (state): boolean => state.rounds.length > 0,
		getRoundById: (state) => (id: number): Round | undefined =>
			state.rounds.find((r) => r.id === id),
	},
}
