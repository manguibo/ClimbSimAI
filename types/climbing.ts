export type HoldType = "jug" | "crimp" | "sloper" | "pinch"

export interface Hold {
  id: string
  x: number
  y: number
  type: HoldType
}

export interface UserMetrics {
  height: number
  wingspan: number
  apeIndex: number
  mobility: number
}

export interface BetaRequest {
  holds: Hold[]
  startHoldId: string
  finishHoldId: string
  userMetrics: UserMetrics
}

export interface BetaResult {
  sequence: string[]
  explanations: string[]
}

export interface BetaApiError {
  error: string
}
