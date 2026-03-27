import type { Horse } from '@/entities/horse/model/types'
import type { HorseProgress, RoundStanding } from '@/entities/round/model/types'
import {
	RACE_TICK_INTERVAL_MS,
	BASE_SPEED,
	CONDITION_WEIGHT,
	RANDOM_WEIGHT,
	BASE_DISTANCE,
} from '@/shared/constants/race'

type OnTickCallback = (progress: HorseProgress[]) => void
type OnFinishCallback = (standings: RoundStanding[]) => void

export class RaceEngine {
	private intervalId: ReturnType<typeof setInterval> | null = null
	private progress: Map<number, number> = new Map()
	private finishTimes: Map<number, number> = new Map()
	private tick = 0
	private horses: Horse[] = []
	private distance = BASE_DISTANCE
	private onTick: OnTickCallback | null = null
	private onFinish: OnFinishCallback | null = null

	run(
		horses: Horse[],
		distance: number,
		onTick: OnTickCallback,
		onFinish: OnFinishCallback,
	): void {
		this.stop()
		this.horses = horses
		this.distance = distance
		this.onTick = onTick
		this.onFinish = onFinish
		horses.forEach((h) => this.progress.set(h.id, 0))
		this.startInterval()
	}

	/**
	 * Stops the interval but preserves all race state (progress, tick, callbacks).
	 * Call resume() to continue from where the race left off.
	 */
	pause(): void {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
	}

	/**
	 * Restarts the interval after a pause(), continuing from the saved state.
	 * No-op if the engine is already running or has no active race.
	 */
	resume(): void {
		if (this.intervalId === null && this.horses.length > 0 && this.onTick !== null && this.onFinish !== null) {
			this.startInterval()
		}
	}

	/**
	 * Fully resets the engine — stops the interval and clears all state.
	 */
	stop(): void {
		this.pause()
		this.progress.clear()
		this.finishTimes.clear()
		this.tick = 0
		this.horses = []
		this.distance = BASE_DISTANCE
		this.onTick = null
		this.onFinish = null
	}

	private startInterval(): void {
		this.intervalId = setInterval(() => {
			this.tick++

			this.horses.forEach((horse) => {
				const current = this.progress.get(horse.id) ?? 0
				if (current >= 100) return

				// Scale speed by distance so longer rounds take proportionally more time.
				// At BASE_DISTANCE (1200 m) the formula is unchanged from the original.
				const speed =
					(BASE_SPEED +
						horse.condition * CONDITION_WEIGHT +
						Math.random() * RANDOM_WEIGHT * 100) *
					(BASE_DISTANCE / this.distance)

				const next = Math.min(100, current + speed)
				this.progress.set(horse.id, next)

				if (next >= 100 && !this.finishTimes.has(horse.id)) {
					this.finishTimes.set(horse.id, this.tick)
				}
			})

			const snapshot: HorseProgress[] = this.horses.map((h) => ({
				horseId: h.id,
				progress: this.progress.get(h.id) ?? 0,
			}))

			this.onTick!(snapshot)

			const allFinished = this.horses.every((h) => (this.progress.get(h.id) ?? 0) >= 100)
			if (allFinished) {
				const standings = this.buildStandings(this.horses)
				const onFinish = this.onFinish!
				this.stop() // full reset so a stale resume() call cannot restart a finished race
				onFinish(standings)
			}
		}, RACE_TICK_INTERVAL_MS)
	}

	private buildStandings(horses: Horse[]): RoundStanding[] {
		return horses
			.map((horse) => ({
				horse,
				finishTime: this.finishTimes.get(horse.id) ?? Infinity,
				position: 0,
			}))
			.sort((a, b) => a.finishTime - b.finishTime)
			.map((entry, index) => ({ ...entry, position: index + 1 }))
	}
}
