<template>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" :width="size" :height="size" :fill="color"
		class="horse-icon">
		<!-- Body -->
		<ellipse cx="32" cy="38" rx="18" ry="10" />
		<!-- Neck -->
		<ellipse cx="46" cy="26" rx="7" ry="10" transform="rotate(-20 46 26)" />
		<!-- Head -->
		<ellipse cx="54" cy="16" rx="6" ry="5" transform="rotate(-30 54 16)" />
		<!-- Ear -->
		<polygon points="55,10 58,4 61,10" />
		<!-- Mane -->
		<ellipse cx="49" cy="20" rx="3" ry="6" transform="rotate(-20 49 20)" :fill="darkenColor(color)" />
		<!-- Tail -->
		<path d="M14,36 Q4,28 6,44 Q8,50 14,46" :fill="darkenColor(color)" />
		<!-- Legs -->
		<rect x="22" y="46" width="5" height="14" rx="2" :class="{ 'leg-front': true, animated }" />
		<rect x="30" y="46" width="5" height="14" rx="2" :class="{ 'leg-mid': true, animated }" />
		<rect x="38" y="46" width="5" height="14" rx="2" :class="{ 'leg-back': true, animated }" />
		<rect x="16" y="46" width="5" height="14" rx="2" :class="{ 'leg-tail': true, animated }" />
		<!-- Eye -->
		<circle cx="56" cy="15" r="1.5" fill="white" />
		<circle cx="56.5" cy="15" r="0.8" fill="#222" />
	</svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'HorseIcon',
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
	methods: {
		darkenColor(hex: string): string {
			const num = parseInt(hex.replace('#', ''), 16)
			const r = Math.max(0, (num >> 16) - 40)
			const g = Math.max(0, ((num >> 8) & 0xff) - 40)
			const b = Math.max(0, (num & 0xff) - 40)
			return `rgb(${r},${g},${b})`
		},
	},
})
</script>

<style scoped lang="scss">
.horse-icon {
	display: block;
}

@keyframes gallop-front {

	0%,
	100% {
		transform: rotate(0deg) translateY(0);
	}

	25% {
		transform: rotate(20deg) translateY(-4px);
	}

	75% {
		transform: rotate(-20deg) translateY(-2px);
	}
}

@keyframes gallop-back {

	0%,
	100% {
		transform: rotate(0deg) translateY(0);
	}

	25% {
		transform: rotate(-20deg) translateY(-2px);
	}

	75% {
		transform: rotate(20deg) translateY(-4px);
	}
}

.leg-front.animated {
	transform-origin: top center;
	animation: gallop-front 0.4s infinite;
}

.leg-back.animated {
	transform-origin: top center;
	animation: gallop-back 0.4s infinite;
}

.leg-mid.animated {
	transform-origin: top center;
	animation: gallop-front 0.4s infinite 0.1s;
}

.leg-tail.animated {
	transform-origin: top center;
	animation: gallop-back 0.4s infinite 0.1s;
}
</style>
