import type { Hold, HoldId } from "@/types/climbing"

export function orderedHoldIds(holds: Hold[]): HoldId[] {
  return [...holds].sort((a, b) => a.y - b.y).map((hold) => hold.id)
}

export function defaultStartHoldId(holds: Hold[]): HoldId {
  const ordered = orderedHoldIds(holds)
  return ordered[0] ?? ""
}

export function defaultFinishHoldId(holds: Hold[]): HoldId {
  const ordered = orderedHoldIds(holds)
  return ordered[ordered.length - 1] ?? ""
}
