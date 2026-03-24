import type { Module } from 'vuex'
import type { RootState } from '@/app/store/types'
import type { Horse } from '@/entities/horse/model/types'
import { generateHorses } from '../lib/horseFactory'

export interface HorsesState {
	horses: Horse[]
}

export const horsesModule: Module<HorsesState, RootState> = {
	namespaced: true,

	state: (): HorsesState => ({
		horses: [],
	}),

	mutations: {
		SET_HORSES(state, horses: Horse[]) {
			state.horses = horses
		},
	},

	actions: {
		generate({ commit }) {
			const horses = generateHorses()
			commit('SET_HORSES', horses)
		},
	},

	getters: {
		allHorses: (state): Horse[] => state.horses,
		hasHorses: (state): boolean => state.horses.length > 0,
	},
}
