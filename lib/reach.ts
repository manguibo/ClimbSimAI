const MAX_REACH_MULTIPLIER = 1.05
const MOBILITY_BONUS_PER_POINT = 0.015

export function calculateReachLimit(wingspan: number, mobility: number): number {
  const mobilityFactor = 1 + mobility * MOBILITY_BONUS_PER_POINT
  return wingspan * MAX_REACH_MULTIPLIER * mobilityFactor
}

export function holdDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}