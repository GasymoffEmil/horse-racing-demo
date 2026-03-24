import type { HorsesState } from '@/features/generate-horses/model/store'
import type { ScheduleState } from '@/features/generate-schedule/model/store'
import type { RaceControlState } from '@/features/race-control/model/store'

export interface RootState {
	horses: HorsesState
	schedule: ScheduleState
	raceControl: RaceControlState
}
