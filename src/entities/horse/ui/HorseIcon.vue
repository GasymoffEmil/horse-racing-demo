<template>
	<Vue3Lottie
		:animation-data="coloredAnimation"
		:width="size"
		:height="size"
		:auto-play="animated"
		:loop="true"
		:pause-animation="!animated"
		class="horse-icon"
	/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'
import baseAnimation from '../assets/running_horse.json'

function hexToLottieColor(hex: string): [number, number, number] {
	const clean = hex.replace('#', '')
	const num = parseInt(clean, 16)
	return [
		((num >> 16) & 0xff) / 255,
		((num >> 8) & 0xff) / 255,
		(num & 0xff) / 255,
	]
}

function recolorAnimation(data: unknown, rgb: [number, number, number]): unknown {
	if (Array.isArray(data)) {
		return data.map(item => recolorAnimation(item, rgb))
	}
	if (data !== null && typeof data === 'object') {
		const obj = data as Record<string, unknown>
		// Shape fill: ty === 'fl', color array stored in c.k
		if (obj['ty'] === 'fl' && obj['c']) {
			const c = obj['c'] as Record<string, unknown>
			const k = c['k'] as number[]
			// Only recolor non-white fills (white = eye whites, keep them)
			if (Array.isArray(k) && !(k[0] === 1 && k[1] === 1 && k[2] === 1)) {
				return {
					...obj,
					c: { ...c, k: [rgb[0], rgb[1], rgb[2], k[3] ?? 1] },
				}
			}
		}
		const result: Record<string, unknown> = {}
		for (const key of Object.keys(obj)) {
			result[key] = recolorAnimation(obj[key], rgb)
		}
		return result
	}
	return data
}

export default defineComponent({
	name: 'HorseIcon',
	components: { Vue3Lottie },
	props: {
		color: {
			type: String,
			default: '#4a4a4a',
		},
		size: {
			type: Number,
			default: 48,
		},
		animated: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		coloredAnimation(): unknown {
			const rgb = hexToLottieColor(this.color)
			return recolorAnimation(baseAnimation, rgb)
		},
	},
})
</script>

<style scoped lang="scss">
.horse-icon {
	display: block;
	transform: scaleX(-1);
}
</style>
