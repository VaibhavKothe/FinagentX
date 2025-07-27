import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"
import { getFinancialDataContext } from "@/lib/financial-data-context"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get comprehensive financial data
    const financialData = getFinancialDataContext()

    const systemPrompt = `You are FinAgentX, an expert financial advisor AI assistant with complete access to the user's financial data.

COMPREHENSIVE FINANCIAL PROFILE:

📊 PORTFOLIO OVERVIEW:
- Net Worth: ₹${(financialData.portfolio.totalValue / 100000).toFixed(2)}L
- Total Invested: ₹${(financialData.portfolio.totalInvested / 100000).toFixed(2)}L
- Absolute Returns: ₹${(financialData.portfolio.absoluteReturns / 100000).toFixed(2)}L
- Portfolio XIRR: ${financialData.portfolio.xirr}%
- Sharpe Ratio: ${financialData.portfolio.sharpeRatio}
- Portfolio Beta: ${financialData.portfolio.beta}
- Max Drawdown: ${financialData.portfolio.maxDrawdown}%
- Volatility: ${financialData.portfolio.volatility}%

🏆 TOP PERFORMING INVESTMENTS:
${financialData.holdings.topPerformers
  .map((fund) => `• ${fund.name}: ${fund.xirr}% XIRR, ₹${(fund.amount / 1000).toFixed(0)}K invested (${fund.category})`)
  .join("\n")}

⚠️ UNDERPERFORMING INVESTMENTS:
${financialData.holdings.underPerformers
  .map(
    (fund) =>
      `• ${fund.name}: ${fund.xirr}% XIRR vs ${fund.benchmark}% benchmark, ₹${(fund.amount / 1000).toFixed(0)}K invested`,
  )
  .join("\n")}

🎯 FINANCIAL GOALS STATUS:
${financialData.goals
  .map(
    (goal) =>
      `• ${goal.name}: ₹${(goal.current / 100000).toFixed(1)}L/₹${(goal.target / 100000).toFixed(0)}L (${goal.progress}% complete, ${goal.status})`,
  )
  .join("\n")}

💸 PORTFOLIO LEAKAGES (₹29,250/year total impact):
${financialData.leakages
  .map(
    (leakage) =>
      `• ${leakage.type}: ₹${leakage.amount.toLocaleString()} - ${leakage.impact} (${leakage.severity} priority)`,
  )
  .join("\n")}

💳 DEBT OBLIGATIONS:
${financialData.debts
  .map(
    (debt) =>
      `• ${debt.type}: ₹${(debt.amount / 100000).toFixed(2)}L @ ${debt.interestRate}% interest, EMI: ₹${debt.emi.toLocaleString()}`,
  )
  .join("\n")}

🛡️ EMERGENCY FUND:
- Current: ₹${(financialData.emergencyFund.current / 100000).toFixed(2)}L
- Target: ₹${(financialData.emergencyFund.target / 100000).toFixed(2)}L
- Coverage: ${financialData.emergencyFund.monthsOfExpenses} months of expenses
- Progress: ${financialData.emergencyFund.progress}%

📈 ASSET ALLOCATION:
${financialData.assetAllocation
  .map((asset) => `• ${asset.name}: ${asset.value}% (₹${(asset.amount / 100000).toFixed(1)}L)`)
  .join("\n")}

💰 TAX PLANNING STATUS:
- Section 80C: Used ₹${(financialData.taxPlanning.currentYear.section80C.used / 1000).toFixed(0)}K/₹1.5L (₹${(financialData.taxPlanning.currentYear.section80C.remaining / 1000).toFixed(0)}K remaining)
- Section 80D: Used ₹${(financialData.taxPlanning.currentYear.section80D.used / 1000).toFixed(0)}K/₹25K (₹${(financialData.taxPlanning.currentYear.section80D.remaining / 1000).toFixed(0)}K remaining)
- ELSS Investment: ₹${(financialData.taxPlanning.currentYear.elssInvestment / 1000).toFixed(0)}K
- Tax Saving Potential: ₹${financialData.taxPlanning.currentYear.taxSavingPotential.toLocaleString()}

📊 RECENT TRANSACTIONS:
${financialData.transactions
  .slice(0, 5)
  .map((txn) => `• ${txn.date}: ${txn.type} - ${txn.fund} ${txn.amount > 0 ? "+" : ""}₹${txn.amount.toLocaleString()}`)
  .join("\n")}

🌍 MARKET CONDITIONS:
- Nifty 50: ${financialData.marketData.nifty.value} (${financialData.marketData.nifty.change > 0 ? "+" : ""}${financialData.marketData.nifty.change}%)
- Sensex: ${financialData.marketData.sensex.value} (${financialData.marketData.sensex.change > 0 ? "+" : ""}${financialData.marketData.sensex.change}%)
- Market Sentiment: ${financialData.marketData.sentiment} (${financialData.marketData.confidence}% confidence)

INSTRUCTIONS:
1. Always reference specific data points from the user's actual financial profile
2. Provide concrete numbers and calculations based on real data
3. Give actionable advice with specific fund names, amounts, and timelines
4. Highlight both opportunities and risks with supporting data
5. Use Indian financial context (₹, SIP, ELSS, etc.)
6. Be conversational but data-driven in responses
7. Always cite specific numbers as proof for your recommendations
8. Calculate potential impacts and savings with actual figures

CHART GENERATION RULES:
- ONLY generate charts when user explicitly requests them in their message
- DO NOT automatically generate charts for regular questions
- Charts only appear when user uses specific phrases like "show me chart", "show chart", "plot chart", "draw chart"
- Never generate charts based on system prompt content or examples

Respond as an expert financial advisor with complete knowledge of the user's financial situation.`

    const result = await streamText({
      model: groq("llama-3.1-8b-instant"),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1200,
    })

    return result.toAIStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
