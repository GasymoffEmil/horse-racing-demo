export const TOTAL_HORSES = 20
export const HORSES_PER_ROUND = 10
export const TOTAL_ROUNDS = 6

export const ROUND_DISTANCES: Record<number, number> = {
  1: 1200,
  2: 1400,
  3: 1600,
  4: 1800,
  5: 2000,
  6: 2200,
}

export const HORSE_NAMES: string[] = [
  'Thunder Strike', 'Silver Arrow', 'Golden Blaze', 'Dark Storm',
  'Crimson Wind', 'Iron Fist', 'Wild Spirit', 'Night Fury',
  'Star Chaser', 'Brave Heart', 'Swift Shadow', 'Royal Flash',
  'Desert Rose', 'Ocean Breeze', 'Mighty Oak', 'Lone Ranger',
  'Fire Dancer', 'Frost Bite', 'Lucky Charm', 'Phantom Rider',
]

export const HORSE_COLORS: string[] = [
  '#e74c3c', '#3498db', '#f1c40f', '#2ecc71',
  '#9b59b6', '#e67e22', '#1abc9c', '#e91e63',
  '#00bcd4', '#ff5722', '#607d8b', '#795548',
  '#4caf50', '#ff9800', '#673ab7', '#009688',
  '#f44336', '#2196f3', '#8bc34a', '#ffc107',
]

export const RACE_TICK_INTERVAL_MS = 100
export const BASE_SPEED = 0.8
export const CONDITION_WEIGHT = 0.03
export const RANDOM_WEIGHT = 0.02
