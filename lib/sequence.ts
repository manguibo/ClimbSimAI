export function clampStep(step: number, sequenceLength: number): number {
  if (sequenceLength <= 0) {
    return 0
  }

  if (step < 1) {
    return 1
  }

  if (step > sequenceLength) {
    return sequenceLength
  }

  return step
}

export function activeSequenceForStep(sequence: string[], step: number): string[] {
  if (sequence.length === 0) {
    return []
  }

  const safeStep = clampStep(step, sequence.length)
  return sequence.slice(0, safeStep)
}
