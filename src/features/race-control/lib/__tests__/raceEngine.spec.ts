import { RaceEngine } from '../raceEngine'
import type { Horse } from '@/entities/horse/model/types'
import type { HorseProgress, RoundStanding } from '@/entities/round/model/types'
import { RACE_TICK_INTERVAL_MS } from '@/shared/constants/race'

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
		engine.run([makeHorse(1)], onTick, onFinish)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS)
		expect(onTick).toHaveBeenCalledTimes(1)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 2)
		expect(onTick).toHaveBeenCalledTimes(3)
	})

	it('onTick receives a progress snapshot for every horse', () => {
		const horses = [makeHorse(1), makeHorse(2), makeHorse(3)]
		const onTick = jest.fn<void, [HorseProgress[]]>()
		engine.run(horses, onTick, jest.fn())

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
		engine.run([makeHorse(1, 100)], onTick, jest.fn())

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 50)

		onTick.mock.calls.forEach(([snapshot]) => {
			snapshot.forEach((p) => expect(p.progress).toBeLessThanOrEqual(100))
		})
	})

	it('stop() halts the interval — no further onTick calls', () => {
		const onTick = jest.fn()
		engine.run([makeHorse(1)], onTick, jest.fn())

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS)
		expect(onTick).toHaveBeenCalledTimes(1)

		engine.stop()
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 10)
		expect(onTick).toHaveBeenCalledTimes(1) // still 1
	})

	it('calls onFinish once when all horses reach 100%', () => {
		// condition=100, Math.random()=0.5 → speed=4.8/tick → 21 ticks to finish
		const onFinish = jest.fn<void, [RoundStanding[]]>()
		engine.run([makeHorse(1, 100)], jest.fn(), onFinish)

		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(1)
	})

	it('onFinish standings are sorted by finish position ascending', () => {
		// Horse 1: condition=100 (faster), Horse 2: condition=1 (slower)
		const onFinish = jest.fn<void, [RoundStanding[]]>()
		engine.run([makeHorse(1, 100), makeHorse(2, 1)], jest.fn(), onFinish)

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
		engine.run([makeHorse(1, 100)], jest.fn(), onFinish)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(1)

		// Second race
		engine.run([makeHorse(2, 100)], jest.fn(), onFinish)
		jest.advanceTimersByTime(RACE_TICK_INTERVAL_MS * 21)
		expect(onFinish).toHaveBeenCalledTimes(2)
	})
})
