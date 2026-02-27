import { calculateReachLimit, holdDistance } from "@/lib/reach"
import type { BetaRequest, BetaResult, Hold } from "@/types/climbing"

function findHoldById(holds: Hold[], id: string): Hold | undefined {
  return holds.find((hold) => hold.id === id)
}

function findNextReachableHold(current: Hold, holds: Hold[], reach: number): Hold | undefined {
  const candidates = holds
    .filter((hold) => hold.y > current.y)
    .sort((a, b) => a.y - b.y)

  return candidates.find((candidate) => holdDistance(current.x, current.y, candidate.x, candidate.y) <= reach)
}

export function generateBetaSequence(request: BetaRequest): BetaResult {
  const { holds, startHoldId, finishHoldId, userMetrics } = request
  const start = findHoldById(holds, startHoldId)
  const finish = findHoldById(holds, finishHoldId)

  if (!start || !finish) {
    return { sequence: [], explanations: ["Invalid start or finish hold"] }
  }

  const reach = calculateReachLimit(userMetrics.wingspan, userMetrics.mobility)
  const sequence = [start.id]
  const explanations = ["Starting position set"]

  let current = start
  let safety = 0
  while (current.id !== finish.id && safety < holds.length) {
    safety += 1
    const next = findNextReachableHold(current, holds, reach)
    if (!next) {
      explanations.push("No reachable next hold found")
      break
    }

    sequence.push(next.id)
    explanations.push(`Moved from ${current.id} to ${next.id}`)
    current = next
  }

  return { sequence, explanations }
}