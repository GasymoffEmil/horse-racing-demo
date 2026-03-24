<template>
	<div class="horse-list">
		<h2 class="horse-list__title">Horse List (1 - 20)</h2>
		<div class="horse-list__table-wrapper">
			<table class="horse-list__table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Condition</th>
						<th>Color</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="horse in horses" :key="horse.id">
						<td>{{ horse.name }}</td>
						<td>{{ horse.condition }}</td>
						<td>
							<span class="horse-list__color-dot" :style="{ backgroundColor: horse.color }" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Horse } from '@/entities/horse'

export default defineComponent({
	name: 'HorseListWidget',
	computed: {
		horses(): Horse[] {
			return this.$store.getters['horses/allHorses']
		},
	},
})
</script>

<style scoped>
.horse-list {
	background: #fff;
	border: 2px solid #e8a838;
	border-radius: 6px;
	overflow: hidden;
	height: 100%;
	display: flex;
	flex-direction: column;
}

.horse-list__title {
	background: #e8a838;
	color: #fff;
	margin: 0;
	padding: 10px 14px;
	font-size: 14px;
	font-weight: 700;
}

.horse-list__table-wrapper {
	overflow-y: auto;
	flex: 1;
}

.horse-list__table {
	width: 100%;
	border-collapse: collapse;
	font-size: 13px;
}

.horse-list__table th {
	background: #f5f5f5;
	padding: 8px 10px;
	text-align: left;
	font-weight: 600;
	border-bottom: 1px solid #ddd;
	position: sticky;
	top: 0;
}

.horse-list__table td {
	padding: 7px 10px;
	border-bottom: 1px solid #f0f0f0;
}

.horse-list__table tr:hover {
	background: #fafafa;
}

.horse-list__color-dot {
	display: inline-block;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	border: 1px solid rgba(0, 0, 0, 0.15);
	vertical-align: middle;
}
</style>
