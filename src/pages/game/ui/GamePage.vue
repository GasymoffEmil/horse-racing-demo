<template>
	<div class="game-page">
		<header class="game-page__header">
			<h1 class="game-page__title">Horse Racing</h1>
			<div class="game-page__actions">
				<AppButton variant="secondary" :disabled="isRunning" @click="onGenerate">
					Generate Program
				</AppButton>
				<AppButton variant="primary" :disabled="!hasSchedule" @click="onToggleRace">
					{{ startButtonLabel }}
				</AppButton>
			</div>
		</header>

		<main class="game-page__body">
			<section class="game-page__panel game-page__panel--horses">
				<HorseListWidget />
			</section>

			<section class="game-page__panel game-page__panel--track">
				<RaceTrackWidget />
			</section>

			<section class="game-page__panel game-page__panel--info">
				<div class="game-page__info-top">
					<RaceProgramWidget />
				</div>
				<div class="game-page__info-bottom">
					<RaceResultsWidget />
				</div>
			</section>
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HorseListWidget } from '@/widgets/horse-list'
import { RaceTrackWidget } from '@/widgets/race-track'
import { RaceProgramWidget } from '@/widgets/race-program'
import { RaceResultsWidget } from '@/widgets/race-results'
import AppButton from '@/shared/ui/AppButton.vue'

export default defineComponent({
	name: 'GamePage',
	components: {
		HorseListWidget,
		RaceTrackWidget,
		RaceProgramWidget,
		RaceResultsWidget,
		AppButton,
	},
	computed: {
		hasSchedule(): boolean {
			return this.$store.getters['schedule/hasSchedule']
		},
		isRunning(): boolean {
			return this.$store.getters['raceControl/isRunning']
		},
		isPaused(): boolean {
			return this.$store.getters['raceControl/isPaused']
		},
		isFinished(): boolean {
			return this.$store.getters['raceControl/isFinished']
		},
		startButtonLabel(): string {
			if (this.isRunning) return 'Pause'
			if (this.isPaused) return 'Resume'
			if (this.isFinished) return 'Restart'
			return 'Start'
		},
	},
	methods: {
		onGenerate() {
			this.$store.dispatch('horses/generate')
			this.$store.dispatch('schedule/generate')
			this.$store.dispatch('raceControl/resetRace')
		},
		onToggleRace() {
			if (this.isRunning) {
				this.$store.dispatch('raceControl/pauseRace')
			} else if (this.isPaused) {
				this.$store.dispatch('raceControl/resumeRace')
			} else if (this.isFinished) {
				this.$store.dispatch('raceControl/resetRace')
				this.$store.dispatch('schedule/generate')
				this.$store.dispatch('raceControl/startRace')
			} else {
				this.$store.dispatch('raceControl/startRace')
			}
		},
	},
})
</script>

<style scoped lang="scss">
.game-page {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background: #f0f0f0;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.game-page__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 20px;
	background: #e74c3c;
	color: white;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.game-page__title {
	margin: 0;
	font-size: 22px;
	font-weight: 700;
	letter-spacing: 1px;
}

.game-page__actions {
	display: flex;
	gap: 10px;
}

.game-page__body {
	display: grid;
	grid-template-columns: 220px 1fr 380px;
	gap: 12px;
	padding: 12px;
	flex: 1;
	overflow: hidden;
	min-height: 0;
}

.game-page__panel {
	min-height: 0;
	overflow: hidden;
}

.game-page__panel--info {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.game-page__info-top,
.game-page__info-bottom {
	flex: 1;
	min-height: 0;
	overflow: hidden;
}
</style>
