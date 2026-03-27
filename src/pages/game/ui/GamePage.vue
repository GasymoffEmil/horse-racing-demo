<template>
	<div class="game-page">
		<header class="game-page__header">
			<h1 class="game-page__title">Horse Racing</h1>
			<div class="game-page__actions">
				<AppButton variant="secondary" :disabled="isRunning" @click="onGenerate">
					Generate
				</AppButton>
				<AppButton variant="primary" :disabled="!hasSchedule" @click="onToggleRace">
					{{ startButtonLabel }}
				</AppButton>
			</div>
		</header>

		<main class="game-page__body">
			<section
				class="game-page__panel game-page__panel--horses"
				:class="{ 'game-page__panel--active': activeTab === 'horses' }"
			>
				<HorseListWidget />
			</section>

			<section
				class="game-page__panel game-page__panel--track"
				:class="{ 'game-page__panel--active': activeTab === 'track' }"
			>
				<RaceTrackWidget />
			</section>

			<section
				class="game-page__panel game-page__panel--info"
				:class="{ 'game-page__panel--active': activeTab === 'info' }"
			>
				<div class="game-page__info-top">
					<RaceProgramWidget />
				</div>
				<div class="game-page__info-bottom">
					<RaceResultsWidget />
				</div>
			</section>
		</main>

		<nav class="game-page__tab-bar">
			<button
				class="game-page__tab"
				:class="{ 'game-page__tab--active': activeTab === 'track' }"
				@click="activeTab = 'track'"
			>
				Race
			</button>
			<button
				class="game-page__tab"
				:class="{ 'game-page__tab--active': activeTab === 'horses' }"
				@click="activeTab = 'horses'"
			>
				Horses
			</button>
			<button
				class="game-page__tab"
				:class="{ 'game-page__tab--active': activeTab === 'info' }"
				@click="activeTab = 'info'"
			>
				Info
			</button>
		</nav>
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
	data() {
		return {
			activeTab: 'track' as 'track' | 'horses' | 'info',
		}
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
	beforeUnmount() {
		this.$store.dispatch('raceControl/resetRace')
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
// ── Base (all sizes) ────────────────────────────────────────────────────────

.game-page {
	display: flex;
	flex-direction: column;
	height: 100dvh; // dynamic viewport height — avoids mobile browser chrome
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
	flex-shrink: 0;
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

// Tab bar hidden on desktop
.game-page__tab-bar {
	display: none;
}

// ── Tablet (768px – 1023px) ─────────────────────────────────────────────────

@media (max-width: 1023px) {
	.game-page__body {
		grid-template-columns: 200px 1fr;
		grid-template-rows: 1fr 210px;
		grid-template-areas:
			"horses track"
			"horses info";
	}

	.game-page__panel--horses {
		grid-area: horses;
	}

	.game-page__panel--track {
		grid-area: track;
	}

	.game-page__panel--info {
		grid-area: info;
		flex-direction: row; // program | results side by side
		gap: 8px;
	}
}

// ── Mobile (< 768px) ────────────────────────────────────────────────────────

@media (max-width: 767px) {
	.game-page__header {
		padding: 10px 14px;
		gap: 8px;
	}

	.game-page__title {
		font-size: 17px;
		letter-spacing: 0.5px;
	}

	.game-page__actions {
		gap: 6px;
	}

	.game-page__body {
		display: flex;
		flex-direction: column;
		padding: 8px;
		gap: 0;
		overflow: hidden;
	}

	// Hide all panels; only the active one is shown
	.game-page__panel {
		display: none;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.game-page__panel--active {
		display: flex;
		flex-direction: column;
	}

	// Info panel: program on top, results below
	.game-page__panel--info.game-page__panel--active {
		flex-direction: column;
		gap: 8px;
	}

	// Tab bar
	.game-page__tab-bar {
		display: flex;
		flex-shrink: 0;
		border-top: 2px solid #e0e0e0;
		background: #fff;
	}

	.game-page__tab {
		flex: 1;
		padding: 11px 6px;
		border: none;
		border-top: 3px solid transparent;
		background: none;
		font-size: 12px;
		font-weight: 700;
		color: #888;
		cursor: pointer;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		transition: color 0.15s, border-color 0.15s, background 0.15s;
	}

	.game-page__tab--active {
		color: #e74c3c;
		border-top-color: #e74c3c;
		background: #fff8f8;
	}
}
</style>
