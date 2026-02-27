import type { BetaRequest, Hold, HoldType, UserMetrics } from "@/types/climbing"

const HOLD_TYPES: HoldType[] = ["jug", "crimp", "sloper", "pinch"]

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isUserMetrics(value: unknown): value is UserMetrics {
  if (!value || typeof value !== "object") {
    return false
  }

  const maybe = value as Partial<UserMetrics>
  return (
    isFiniteNumber(maybe.height) &&
    isFiniteNumber(maybe.wingspan) &&
    isFiniteNumber(maybe.apeIndex) &&
    isFiniteNumber(maybe.mobility) &&
    maybe.mobility >= 1 &&
    maybe.mobility <= 10
  )
}

function isHold(value: unknown): value is Hold {
  if (!value || typeof value !== "object") {
    return false
  }

  const maybe = value as Partial<Hold>
  return (
    typeof maybe.id === "string" &&
    maybe.id.length > 0 &&
    isFiniteNumber(maybe.x) &&
    isFiniteNumber(maybe.y) &&
    typeof maybe.type === "string" &&
    HOLD_TYPES.includes(maybe.type as HoldType)
  )
}

export function validateBetaRequest(value: unknown): { ok: true; data: BetaRequest } | { ok: false; error: string } {
  if (!value || typeof value !== "object") {
    return { ok: false, error: "Invalid input body." }
  }

  const body = value as Partial<BetaRequest>
  if (!Array.isArray(body.holds) || body.holds.length === 0) {
    return { ok: false, error: "At least one hold is required." }
  }

  if (!body.holds.every(isHold)) {
    return { ok: false, error: "Holds payload is invalid." }
  }

  if (typeof body.startHoldId !== "string" || typeof body.finishHoldId !== "string") {
    return { ok: false, error: "Start and finish hold IDs are required." }
  }

  if (body.startHoldId === body.finishHoldId) {
    return { ok: false, error: "Start and finish holds must be different." }
  }

  const holdIds = new Set(body.holds.map((hold) => hold.id))
  if (!holdIds.has(body.startHoldId) || !holdIds.has(body.finishHoldId)) {
    return { ok: false, error: "Start/finish hold IDs must exist on the wall." }
  }

  if (!isUserMetrics(body.userMetrics)) {
    return { ok: false, error: "User metrics payload is invalid." }
  }

  return {
    ok: true,
    data: {
      holds: body.holds,
      startHoldId: body.startHoldId,
      finishHoldId: body.finishHoldId,
      userMetrics: body.userMetrics
    }
  }
}
