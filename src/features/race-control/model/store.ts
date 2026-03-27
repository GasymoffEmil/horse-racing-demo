import type { Module, ActionContext } from 'vuex'
import type { RootState } from '@/app/store/types'
import type { HorseProgress, RoundResult, RoundStanding } from '@/entities/round/model/types'
import type { Round } from '@/entities/round/model/types'
import { RaceEngine } from '../lib/raceEngine'

export interface RaceControlState {
	isRunning: boolean
	isPaused: boolean
	currentRoundIndex: number
	progress: HorseProgress[]
	results: RoundResult[]
	isFinished: boolean
}

type RaceContext = ActionContext<RaceControlState, RootState>

const engine = new RaceEngine()

export const raceControlModule: Module<RaceControlState, RootState> = {
	namespaced: true,

	state: (): RaceControlState => ({
		isRunning: false,
		isPaused: false,
		currentRoundIndex: 0,
		progress: [],
		results: [],
		isFinished: false,
	}),

	mutations: {
		SET_RUNNING(state, value: boolean) {
			state.isRunning = value
		},
		SET_PAUSED(state, value: boolean) {
			state.isPaused = value
		},
		SET_CURRENT_ROUND_INDEX(state, index: number) {
			state.currentRoundIndex = index
		},
		SET_PROGRESS(state, progress: HorseProgress[]) {
			state.progress = progress
		},
		ADD_RESULT(state, result: RoundResult) {
			state.results.push(result)
		},
		RESET(state) {
			state.isRunning = false
			state.isPaused = false
			state.currentRoundIndex = 0
			state.progress = []
			state.results = []
			state.isFinished = false
		},
		SET_FINISHED(state, value: boolean) {
			state.isFinished = value
		},
	},

	actions: {
		async startRace(context: RaceContext) {
			const { commit, state, rootGetters } = context
			const rounds: Round[] = rootGetters['schedule/allRounds']

			if (!rounds.length) return

			commit('SET_RUNNING', true)
			commit('SET_PAUSED', false)
			commit('SET_FINISHED', false)

			for (let i = state.currentRoundIndex; i < rounds.length; i++) {
				commit('SET_CURRENT_ROUND_INDEX', i)
				await runRound(rounds[i], context)
				if (state.isPaused) break
			}

			if (!state.isPaused) {
				commit('SET_RUNNING', false)
				commit('SET_FINISHED', true)
			}
		},

		pauseRace({ commit }) {
			engine.pause() // stop interval but preserve progress — resume() will continue from here
			commit('SET_PAUSED', true)
			commit('SET_RUNNING', false)
		},

		resumeRace({ commit }) {
			commit('SET_RUNNING', true)
			commit('SET_PAUSED', false)
			engine.resume() // restart interval from saved state; resolves the pending runRound Promise
		},

		resetRace({ commit }) {
			engine.stop()
			commit('RESET')
		},
	},

	getters: {
		currentRoundIndex: (state): number => state.currentRoundIndex,
		isRunning: (state): boolean => state.isRunning,
		isPaused: (state): boolean => state.isPaused,
		isFinished: (state): boolean => state.isFinished,
		progress: (state): HorseProgress[] => state.progress,
		results: (state): RoundResult[] => state.results,
		progressMap: (state): Map<number, number> =>
			new Map(state.progress.map((p) => [p.horseId, p.progress])),
	},
}

function runRound(round: Round, context: RaceContext): Promise<void> {
	const { commit } = context
	commit('SET_PROGRESS', round.horses.map((h) => ({ horseId: h.id, progress: 0 })))

	return new Promise((resolve) => {
		engine.run(
			round.horses,
			round.distance,
			(progress) => {
				commit('SET_PROGRESS', progress)
			},
			(standings: RoundStanding[]) => {
				const result: RoundResult = {
					roundId: round.id,
					distance: round.distance,
					standings,
				}
				commit('ADD_RESULT', result)
				resolve()
			},
		)
	})
}
