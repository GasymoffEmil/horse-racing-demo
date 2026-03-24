import type { Horse } from '@/entities/horse/model/types'

export interface Round {
	id: number
	distance: number
	horses: Horse[]
}

export interface RoundStanding {
	position: number
	horse: Horse
	finishTime: number
}

export interface RoundResult {
	roundId: number
	distance: number
	standings: RoundStanding[]
}

export interface HorseProgress {
	horseId: number
	progress: number // 0–100
}
