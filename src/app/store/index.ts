import { createStore } from 'vuex'
import type { RootState } from './types'
import { horsesModule } from '@/features/generate-horses/model/store'
import { scheduleModule } from '@/features/generate-schedule/model/store'
import { raceControlModule } from '@/features/race-control/model/store'

export const store = createStore<RootState>({
	strict: import.meta.env.DEV,
	modules: {
		horses: horsesModule,
		schedule: scheduleModule,
		raceControl: raceControlModule,
	},
})

export type { RootState }
