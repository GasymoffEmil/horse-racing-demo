<template>
	<GamePage />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GamePage } from '@/pages/game'

export default defineComponent({
	name: 'App',
	components: { GamePage },
})
</script>
