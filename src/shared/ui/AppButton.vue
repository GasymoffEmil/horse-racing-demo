<template>
	<button class="app-button" :class="[`app-button--${variant}`, { 'app-button--disabled': disabled }]"
		:disabled="disabled" @click="$emit('click')">
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'AppButton',
	props: {
		variant: {
			type: String as () => 'primary' | 'secondary' | 'danger',
			default: 'primary',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['click'],
})
</script>

<style scoped lang="scss">
.app-button {
	padding: 10px 20px;
	font-size: 14px;
	font-weight: 600;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s, opacity 0.2s;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.app-button--primary {
	background-color: #e74c3c;
	color: white;
}

.app-button--primary:hover:not(:disabled) {
	background-color: #c0392b;
}

.app-button--secondary {
	background-color: #2c3e50;
	color: white;
}

.app-button--secondary:hover:not(:disabled) {
	background-color: #1a252f;
}

.app-button--danger {
	background-color: #e67e22;
	color: white;
}

.app-button--danger:hover:not(:disabled) {
	background-color: #d35400;
}

.app-button--disabled,
.app-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>
