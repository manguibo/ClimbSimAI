import type { BetaRequest } from "@/types/climbing"
import { generateBetaSequence } from "@/lib/betaRules"

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<BetaRequest>

  if (!body || !Array.isArray(body.holds) || !body.startHoldId || !body.finishHoldId || !body.userMetrics) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const result = generateBetaSequence(body as BetaRequest)
  return Response.json(result)
}