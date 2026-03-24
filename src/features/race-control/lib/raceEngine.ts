import type { Horse } from '@/entities/horse/model/types'
import type { HorseProgress, RoundStanding } from '@/entities/round/model/types'
import {
	RACE_TICK_INTERVAL_MS,
	BASE_SPEED,
	CONDITION_WEIGHT,
	RANDOM_WEIGHT,
} from '@/shared/constants/race'

type OnTickCallback = (progress: HorseProgress[]) => void
type OnFinishCallback = (standings: RoundStanding[]) => void

export class RaceEngine {
	private intervalId: ReturnType<typeof setInterval> | null = null
	private progress: Map<number, number> = new Map()
	private finishTimes: Map<number, number> = new Map()
	private tick = 0

	run(
		horses: Horse[],
		onTick: OnTickCallback,
		onFinish: OnFinishCallback,
	): void {
		this.reset()
		horses.forEach((h) => this.progress.set(h.id, 0))

		this.intervalId = setInterval(() => {
			this.tick++

			horses.forEach((horse) => {
				const current = this.progress.get(horse.id) ?? 0
				if (current >= 100) return

				const speed =
					BASE_SPEED +
					horse.condition * CONDITION_WEIGHT +
					Math.random() * RANDOM_WEIGHT * 100

				const next = Math.min(100, current + speed)
				this.progress.set(horse.id, next)

				if (next >= 100 && !this.finishTimes.has(horse.id)) {
					this.finishTimes.set(horse.id, this.tick)
				}
			})

			const snapshot: HorseProgress[] = horses.map((h) => ({
				horseId: h.id,
				progress: this.progress.get(h.id) ?? 0,
			}))

			onTick(snapshot)

			const allFinished = horses.every((h) => (this.progress.get(h.id) ?? 0) >= 100)
			if (allFinished) {
				this.stop()
				const standings = this.buildStandings(horses)
				onFinish(standings)
			}
		}, RACE_TICK_INTERVAL_MS)
	}

	stop(): void {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
	}

	private reset(): void {
		this.stop()
		this.progress.clear()
		this.finishTimes.clear()
		this.tick = 0
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
