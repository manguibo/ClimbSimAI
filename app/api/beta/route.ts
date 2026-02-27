import { generateBetaSequence } from "@/lib/betaRules"
import { validateBetaRequest } from "@/lib/beta-validation"

export async function POST(req: Request) {
  const body = (await req.json()) as unknown
  const validation = validateBetaRequest(body)

  if (!validation.ok) {
    return Response.json({ error: validation.error }, { status: 400 })
  }

  const result = generateBetaSequence(validation.data)
  return Response.json(result)
}
