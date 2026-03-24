import type { Horse } from '@/entities/horse/model/types'
import type { Round } from '@/entities/round/model/types'
import { ROUND_DISTANCES, TOTAL_ROUNDS, HORSES_PER_ROUND } from '@/shared/constants/race'
import { pickRandom } from '@/shared/lib/random'

export function generateSchedule(horses: Horse[]): Round[] {
	return Array.from({ length: TOTAL_ROUNDS }, (_, index) => {
		const roundNumber = index + 1
		return {
			id: roundNumber,
			distance: ROUND_DISTANCES[roundNumber],
			horses: pickRandom(horses, HORSES_PER_ROUND),
		}
	})
}
