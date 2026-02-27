export function clampToUnit(value: number): number {
  if (value < 0) {
    return 0
  }

  if (value > 1) {
    return 1
  }

  return value
}

export function stepToProgress(step: number, sequenceLength: number): number {
  if (sequenceLength <= 1 || step <= 0) {
    return 0
  }

  return clampToUnit((step - 1) / (sequenceLength - 1))
}

export function progressToStep(progress: number, sequenceLength: number): number {
  if (sequenceLength <= 0) {
    return 0
  }

  if (sequenceLength === 1) {
    return 1
  }

  const normalized = clampToUnit(progress)
  return Math.round(normalized * (sequenceLength - 1)) + 1
}
