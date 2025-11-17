import { generateText } from "ai"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL!)

export const maxDuration = 30

export async function POST(req: Request) {
  const { message, userName, assistantId } = await req.json()

  try {
    let systemPrompt = `Ти си приятелски AI гласов асистент за фирма VOXAL, която предлага AI гласови решения за бизнеси. 
    
Потребителят се казва ${userName || "Гост"}.

Отговори на български език на следното съобщение кратко, приятелски и професионално (максимум 2-3 изречения):

Ако те питат за услугите на VOXAL, споменавай че предлагаме:
- 24/7 AI гласови асистенти
- Автоматизация на обслужването на клиенти
- Интеграция с CRM системи
- Намалени разходи и увеличена ефективност`

    if (assistantId) {
      const assistants = await sql`
        SELECT system_prompt FROM assistants WHERE id = ${assistantId} AND is_active = true
      `

      if (assistants.length > 0) {
        systemPrompt = `${assistants[0].system_prompt}

Потребителят се казва ${userName || "Гост"}.

Ако те питат за услугите на VOXAL, споменавай че предлагаме:
- 24/7 AI гласови асистенти
- Автоматизация на обслужването на клиенти
- Интеграция с CRM системи
- Намалени разходи и увеличена ефективност`
      }
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `${systemPrompt}

Съобщение от потребителя:
${message}`,
      maxOutputTokens: 200,
      temperature: 0.7,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("[v0] Error generating response:", error)
    return Response.json({ error: "Грешка при обработката на съобщението" }, { status: 500 })
  }
}
