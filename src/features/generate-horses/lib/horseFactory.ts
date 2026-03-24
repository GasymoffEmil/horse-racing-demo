import type { Horse } from '@/entities/horse/model/types'
import { HORSE_NAMES, HORSE_COLORS, TOTAL_HORSES } from '@/shared/constants/race'
import { randomInt } from '@/shared/lib/random'

export function generateHorses(): Horse[] {
	return Array.from({ length: TOTAL_HORSES }, (_, index) => ({
		id: index + 1,
		name: HORSE_NAMES[index],
		color: HORSE_COLORS[index],
		condition: randomInt(1, 100),
	}))
}
