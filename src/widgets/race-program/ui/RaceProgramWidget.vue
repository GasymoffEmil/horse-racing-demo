<template>
	<div class="race-program">
		<h2 class="race-program__title">Program</h2>
		<div v-if="!rounds.length" class="race-program__empty">
			No schedule generated yet.
		</div>
		<div v-else class="race-program__rounds">
			<div v-for="round in rounds" :key="round.id" class="race-program__round"
				:class="{ 'race-program__round--active': round.id === activeRoundId }">
				<div class="race-program__round-header">
					Round {{ round.id }} — {{ round.distance }}m
				</div>
				<table class="race-program__table">
					<thead>
						<tr>
							<th>Position</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(horse, index) in round.horses" :key="horse.id">
							<td>{{ index + 1 }}</td>
							<td>
								<span class="race-program__dot" :style="{ backgroundColor: horse.color }" />
								{{ horse.name }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Round } from '@/entities/round'

export default defineComponent({
	name: 'RaceProgramWidget',
	computed: {
		rounds(): Round[] {
			return this.$store.getters['schedule/allRounds']
		},
		activeRoundId(): number {
			const index: number = this.$store.getters['raceControl/currentRoundIndex']
			const rounds = this.rounds
			return rounds[index]?.id ?? -1
		},
	},
})
</script>

<style scoped>
.race-program {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 6px;
	overflow: hidden;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.race-program__title {
	background: #3498db;
	color: #fff;
	margin: 0;
	padding: 10px 14px;
	font-size: 14px;
	font-weight: 700;
	text-align: center;
}

.race-program__empty {
	padding: 20px;
	color: #999;
	font-size: 13px;
	text-align: center;
}

.race-program__rounds {
	overflow-y: auto;
	flex: 1;
}

.race-program__round {
	border-bottom: 2px solid #eee;
}

.race-program__round--active .race-program__round-header {
	background: #e74c3c;
	color: #fff;
}

.race-program__round-header {
	background: #ecf0f1;
	padding: 6px 10px;
	font-size: 12px;
	font-weight: 700;
	color: #2c3e50;
	border-bottom: 1px solid #ddd;
}

.race-program__table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
}

.race-program__table th {
	padding: 5px 8px;
	text-align: left;
	background: #f8f8f8;
	border-bottom: 1px solid #eee;
	font-weight: 600;
}

.race-program__table td {
	padding: 5px 8px;
	border-bottom: 1px solid #f5f5f5;
}

.race-program__dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin-right: 5px;
	vertical-align: middle;
	border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
