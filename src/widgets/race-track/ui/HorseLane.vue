<template>
	<div class="horse-lane">
		<div class="horse-lane__number">{{ laneNumber }}</div>
		<div class="horse-lane__track" ref="track">
			<div class="horse-lane__horse" :style="{ transform: horseTransform }">
				<HorseIcon :color="horse.color" :size="horseSize" :animated="isRunning && progress < 100" />
			</div>
			<div class="horse-lane__finish-line" ></div>
		</div>
		<div :style="{width: `${horseSize}px`}" class="horse-lane__finish"></div>
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
	data() {
		return {
			horseSize: 90, // Horse Size in pixels
			trackWidth: 0,
			resizeObserver: null as ResizeObserver | null,
		}
	},
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
		horseTransform(): string {
			const px = (this.trackWidth * this.progress) / 100
			return `translateY(-50%) translateX(${px}px)`
		},
	},
	mounted() {
		const trackEl = this.$refs.track as HTMLElement
		this.trackWidth = trackEl.offsetWidth
		this.resizeObserver = new ResizeObserver((entries) => {
			this.trackWidth = entries[0].contentRect.width
		})
		this.resizeObserver.observe(trackEl)
	},
	beforeUnmount() {
		this.resizeObserver?.disconnect()
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
}

.horse-lane__horse {
	position: absolute;
	top: 50%;
	left: 0;
	transition: transform 0.1s linear;
	z-index: 2;
}

.horse-lane__finish-line {
	position: absolute;
	right: 0;
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

.horse-lane__finish{
	height: 100%;
}
</style>
