<template>
	<div class="race-track">
		<div v-if="!currentRound" class="race-track__empty">
			<p>Generate a program and press Start to begin the race.</p>
		</div>
		<template v-else>
			<div class="race-track__header">
				<span class="race-track__round-label">
					Round {{ currentRound.id }} — {{ currentRound.distance }}m
				</span>
				<span class="race-track__finish-label">FINISH</span>
			</div>
			<div class="race-track__lanes">
				<HorseLane v-for="(horse, index) in currentRound.horses" :key="horse.id" :horse="horse"
					:lane-number="index + 1" :progress="getProgress(horse.id)" :is-running="isRunning" />
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Round } from '@/entities/round'
import HorseLane from './HorseLane.vue'

export default defineComponent({
	name: 'RaceTrackWidget',
	components: { HorseLane },
	computed: {
		currentRound(): Round | null {
			const rounds: Round[] = this.$store.getters['schedule/allRounds']
			const index: number = this.$store.getters['raceControl/currentRoundIndex']
			return rounds[index] ?? null
		},
		progressMap(): Map<number, number> {
			return this.$store.getters['raceControl/progressMap']
		},
		isRunning(): boolean {
			return this.$store.getters['raceControl/isRunning']
		},
	},
	methods: {
		getProgress(horseId: number): number {
			return this.progressMap.get(horseId) ?? 0
		},
	},
})
</script>

<style scoped>
.race-track {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 6px;
	overflow: hidden;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.race-track__empty {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #999;
	font-size: 14px;
	text-align: center;
	padding: 20px;
}

.race-track__header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 16px;
	background: #2c3e50;
	color: #fff;
	font-size: 13px;
	font-weight: 600;
}

.race-track__round-label {
	font-size: 14px;
}

.race-track__finish-label {
	color: #e74c3c;
	font-size: 13px;
	font-weight: 700;
	letter-spacing: 1px;
}

.race-track__lanes {
	flex: 1;
	overflow-y: auto;
}
</style>
