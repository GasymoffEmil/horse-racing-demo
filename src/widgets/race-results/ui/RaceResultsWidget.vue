<template>
	<div class="race-results">
		<h2 class="race-results__title">Results</h2>
		<div v-if="!results.length" class="race-results__empty">
			Results will appear here after each round.
		</div>
		<div v-else class="race-results__rounds">
			<div v-for="result in results" :key="result.roundId" class="race-results__round">
				<div class="race-results__round-header">
					Round {{ result.roundId }} — {{ result.distance }}m
				</div>
				<table class="race-results__table">
					<thead>
						<tr>
							<th>Position</th>
							<th>Name</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="standing in result.standings" :key="standing.horse.id"
							:class="{ 'race-results__row--winner': standing.position === 1 }">
							<td>{{ standing.position }}</td>
							<td>
								<span class="race-results__dot" :style="{ backgroundColor: standing.horse.color }" />
								{{ standing.horse.name }}
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
import type { RoundResult } from '@/entities/round'

export default defineComponent({
	name: 'RaceResultsWidget',
	computed: {
		results(): RoundResult[] {
			return this.$store.getters['raceControl/results']
		},
	},
})
</script>

<style scoped lang="scss">
.race-results {
	background: #fff;
	border: 1px solid #ddd;
	border-radius: 6px;
	overflow: hidden;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.race-results__title {
	background: #27ae60;
	color: #fff;
	margin: 0;
	padding: 10px 14px;
	font-size: 14px;
	font-weight: 700;
	text-align: center;
}

.race-results__empty {
	padding: 20px;
	color: #999;
	font-size: 13px;
	text-align: center;
}

.race-results__rounds {
	overflow-y: auto;
	flex: 1;
}

.race-results__round {
	border-bottom: 2px solid #eee;
}

.race-results__round-header {
	background: #ecf0f1;
	padding: 6px 10px;
	font-size: 12px;
	font-weight: 700;
	color: #2c3e50;
	border-bottom: 1px solid #ddd;
}

.race-results__table {
	width: 100%;
	border-collapse: collapse;
	font-size: 12px;
}

.race-results__table th {
	padding: 5px 8px;
	text-align: left;
	background: #f8f8f8;
	border-bottom: 1px solid #eee;
	font-weight: 600;
}

.race-results__table td {
	padding: 5px 8px;
	border-bottom: 1px solid #f5f5f5;
}

.race-results__row--winner td {
	background: #fffde7;
	font-weight: 600;
	color: #e67e22;
}

.race-results__dot {
	display: inline-block;
	width: 10px;
	height: 10px;
	border-radius: 50%;
	margin-right: 5px;
	vertical-align: middle;
	border: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
