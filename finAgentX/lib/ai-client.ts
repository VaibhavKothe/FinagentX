import { groq } from "@ai-sdk/groq"
import { streamText, generateText } from "ai"

// Use Groq as the primary client
export const aiClient = groq

export async function streamFinancialAdvice(
  message: string,
  context: {
    portfolio?: any
    goals?: any
    transactions?: any
    userProfile?: any
  },
) {
  const systemPrompt = `You are FinAgentX, an expert financial advisor AI assistant. You have access to the user's complete financial data and should provide personalized, actionable advice.

User's Financial Context:
- Portfolio Value: ₹42.85L (Net Worth)
- Monthly SIP: ₹25,000
- Portfolio XIRR: 15.2%
- Asset Allocation: 45% Large Cap, 25% Stocks, 15% FDs, 10% Real Estate, 5% Others
- Goals: Dream Home (₹80L), Child Education (₹25L), Retirement (₹5Cr)
- Emergency Fund: ₹3.5L (87.5% of target)

Guidelines:
1. Always provide specific, actionable financial advice
2. Use Indian financial context (₹, SIP, ELSS, etc.)
3. Reference actual portfolio data when relevant
4. Be conversational but professional
5. Include specific numbers and calculations
6. Suggest concrete next steps
7. Consider risk tolerance and time horizon
8. Mention tax implications when relevant

Respond as a knowledgeable financial advisor would, with empathy and expertise.`

  try {
    const result = await streamText({
      model: aiClient("llama-3.1-8b-instant"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result
  } catch (error) {
    console.error("AI streaming error:", error)
    throw error
  }
}

export async function generateQuickResponse(message: string) {
  const systemPrompt = `You are a financial advisor AI. Provide a brief, helpful response about the user's financial query. Keep it under 100 words and actionable.`

  try {
    const result = await generateText({
      model: aiClient("llama-3.1-8b-instant"),
      system: systemPrompt,
      prompt: message,
      temperature: 0.5,
      maxTokens: 200,
    })

    return result.text
  } catch (error) {
    console.error("AI generation error:", error)
    return "I'm having trouble processing your request right now. Please try again."
  }
}
