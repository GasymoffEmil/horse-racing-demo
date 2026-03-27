import { RaceEngine } from '../raceEngine'
import type { Horse } from '@/entities/horse/model/types'
import type { HorseProgress, RoundStanding } from '@/entities/round/model/types'
import { RACE_TICK_INTERVAL_MS, BASE_DISTANCE } from '@/shared/constants/race'

const makeHorse = (id: number, condition = 100): Horse => ({
	id,
	name: `Horse ${id}`,
	color: '#ff0000',
	condition,
})

describe('RaceEngine', () => {
	let engine: RaceEngine

	beforeEach(() => {
		jest.useFakeTimers()
		// Fix Math.random so speed is deterministic: 0.8 + condition*0.03 + 0.5*2 = 0.8+3+1=4.8 for condition=100
		jest.spyOn(Math, 'random').mockReturnValue(0.5)
		engine = new RaceEngine()
	})

	afterEach(() => {
		engine.stop()
		jest.useRealTimers()
		jest.restoreAllMocks()
	})

	it('calls onTick once per interval tick', () => {
		const onTick = jest.fn()
		const onFinish = jest.fn()
		engine.run([makeHorse(1)], BASE_DISTANCE, onTick, onFinish)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS)
		expect(onTick).toHaveBeenCalledTimes(1)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 2)
		expect(onTick).toHaveBeenCalledTimes(3)
	})

	it('onTick receives a progress snapshot for every horse', () => {
		const horses = [makeHorse(1), makeHorse(2), makeHorse(3)]
		const onTick = jest.fn<void, [HorseProgress[]]>()
		engine.run(horses, BASE_DISTANCE, onTick, jest.fn())

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS)

		const [snapshot] = onTick.mock.calls[0]
		expect(snapshot).toHaveLength(3)
		snapshot.forEach((p) => {
			expect(p.progress).toBeGreaterThan(0)
			expect(p.horseId).toBeGreaterThanOrEqual(1)
		})
	})

	it('progress never exceeds 100', () => {
		const onTick = jest.fn<void, [HorseProgress[]]>()
		engine.run([makeHorse(1, 100)], BASE_DISTANCE, onTick, jest.fn())

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 50)

		onTick.mock.calls.forEach(([snapshot]) => {
			snapshot.forEach((p) => expect(p.progress).toBeLessThanOrEqual(100))
		})
	})

	it('stop() halts the interval — no further onTick calls', () => {
		const onTick = jest.fn()
		engine.run([makeHorse(1)], BASE_DISTANCE, onTick, jest.fn())

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS)
		expect(onTick).toHaveBeenCalledTimes(1)

		engine.stop()
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 10)
		expect(onTick).toHaveBeenCalledTimes(1) // still 1
	})

	it('calls onFinish once when all horses reach 100%', () => {
		// condition=100, Math.random()=0.5 → speed=4.8/tick at BASE_DISTANCE → 21 ticks to finish
		const onFinish = jest.fn<void, [RoundStanding[]]>()
		engine.run([makeHorse(1, 100)], BASE_DISTANCE, jest.fn(), onFinish)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(1)
	})

	it('onFinish standings are sorted by finish position ascending', () => {
		// Horse 1: condition=100 (faster), Horse 2: condition=1 (slower)
		const onFinish = jest.fn<void, [RoundStanding[]]>()
		engine.run([makeHorse(1, 100), makeHorse(2, 1)], BASE_DISTANCE, jest.fn(), onFinish)

		// Enough time for both to finish
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 100)

		expect(onFinish).toHaveBeenCalledTimes(1)
		const [standings] = onFinish.mock.calls[0]
		expect(standings[0].position).toBe(1)
		expect(standings[1].position).toBe(2)
		// Faster horse (condition=100) should finish first
		expect(standings[0].horse.id).toBe(1)
	})

	it('calling run() again resets state from the previous race', () => {
		const onFinish = jest.fn()
		engine.run([makeHorse(1, 100)], BASE_DISTANCE, jest.fn(), onFinish)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(1)

		// Second race
		engine.run([makeHorse(2, 100)], BASE_DISTANCE, jest.fn(), onFinish)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(2)
	})

	it('longer distance takes proportionally more ticks than BASE_DISTANCE', () => {
		const onFinish1 = jest.fn()
		const onFinish2 = jest.fn()

		// Race at BASE_DISTANCE (1200m)
		engine.run([makeHorse(1, 100)], BASE_DISTANCE, jest.fn(), onFinish1)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish1).toHaveBeenCalledTimes(1)

		// Race at double distance (2400m) — needs ~42 ticks, not yet done after 21
		engine.run([makeHorse(1, 100)], BASE_DISTANCE * 2, jest.fn(), onFinish2)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish2).toHaveBeenCalledTimes(0) // not finished yet

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish2).toHaveBeenCalledTimes(1) // now finished
	})

	it('pause() stops ticks and resume() continues from saved progress', () => {
		const onTick = jest.fn<void, [HorseProgress[]]>()
		const onFinish = jest.fn()
		engine.run([makeHorse(1, 100)], BASE_DISTANCE, onTick, onFinish)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 5)
		expect(onTick).toHaveBeenCalledTimes(5)
		const progressBeforePause = onTick.mock.calls[4][0][0].progress

		engine.pause()
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 5) // no ticks while paused
		expect(onTick).toHaveBeenCalledTimes(5) // still 5

		engine.resume()
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS)
		expect(onTick).toHaveBeenCalledTimes(6)
		// Progress must continue from where it was paused, not restart from 0
		const progressAfterResume = onTick.mock.calls[5][0][0].progress
		expect(progressAfterResume).toBeGreaterThan(progressBeforePause)
	})

	it('resume() after a finished race is a no-op', () => {
		const onTick = jest.fn()
		const onFinish = jest.fn()
		engine.run([makeHorse(1, 100)], BASE_DISTANCE, onTick, onFinish)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(1)

		engine.resume() // should do nothing — race already finished and engine was reset
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 5)
		expect(onFinish).toHaveBeenCalledTimes(1) // still 1
	})
})
