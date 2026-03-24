<template>
	<div class="horse-lane">
		<div class="horse-lane__number">{{ laneNumber }}</div>
		<div class="horse-lane__track" ref="track">
			<div class="horse-lane__horse" :style="{ left: horseLeftPercent }">
				<HorseIcon :color="horse.color" :size="66" :animated="isRunning && progress < 100" />
			</div>
			<div class="horse-lane__finish-line" ></div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { Horse } from '@/entities/horse'
import { HorseIcon } from '@/entities/horse'

export default defineComponent({
	name: 'HorseLane',
	components: { HorseIcon },
	props: {
		horse: {
			type: Object as PropType<Horse>,
			required: true,
		},
		laneNumber: {
			type: Number,
			required: true,
		},
		progress: {
			type: Number,
			default: 0,
		},
		isRunning: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		horseLeftPercent(): string {
			// Reserve last 6% for the finish line area, horse moves from 0 to 94%
			const maxLeft = 90
			return `${(this.progress / 100) * maxLeft}%`
		},
	},
})
</script>

<style scoped lang="scss">
.horse-lane {
	display: flex;
	align-items: center;
	height: 60px;
	border-bottom: 1px dashed #ccc;
	background: #fafafa;
}

.horse-lane:last-child {
	border-bottom: none;
}

.horse-lane__number {
	width: 32px;
	min-width: 32px;
	text-align: center;
	font-weight: 700;
	font-size: 14px;
	color: #555;
	background: #eee;
	align-self: stretch;
	display: flex;
	align-items: center;
	justify-content: center;
	border-right: 1px solid #ddd;
}

.horse-lane__track {
	position: relative;
	flex: 1;
	height: 100%;
	overflow: hidden;
}

.horse-lane__horse {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	transition: left 0.1s linear;
	z-index: 2;
}

.horse-lane__finish-line {
	position: absolute;
	right: 6%;
	top: 0;
	bottom: 0;
	width: 3px;
	background: repeating-linear-gradient(to bottom,
			#222 0px,
			#222 6px,
			#fff 6px,
			#fff 12px);
	z-index: 1;
}
</style>
