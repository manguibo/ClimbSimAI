import type { BetaApiError, BetaRequest, BetaResult } from "@/types/climbing"

export async function requestBetaSequence(payload: BetaRequest): Promise<BetaResult> {
  const response = await fetch("/api/beta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({ error: "Request failed" }))) as BetaApiError
    throw new Error(errorBody.error ?? "Request failed")
  }

  return (await response.json()) as BetaResult
}
