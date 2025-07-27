"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastContainer } from "@/components/notifications/toast"
import { EnhancedChat } from "@/components/ai/enhanced-chat"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
  isStreaming?: boolean
}

const aiResponses = {
  netWorth: `Your net worth has grown impressively by 12.5% over the last 6 months, from ₹38.1L to ₹42.85L. 

Here's the breakdown of your growth:
• Mutual Fund gains: +₹2.8L (15.2% CAGR)
• Stock portfolio: +₹1.2L (18.5% returns)
• Real estate appreciation: +₹0.8L (6.2% growth)
• FD maturity reinvestment: +₹0.15L

Your SIP contributions of ₹25,000/month have been the primary driver, with smart asset allocation showing excellent results. The large-cap funds are performing particularly well, beating their benchmarks by 3-4%.`,

  sip: `I've analyzed your SIP portfolio and found some concerning underperformers:

🔴 **Underperforming SIPs:**
1. **HDFC Small Cap Fund** - 8.2% XIRR (vs Nifty Small Cap 12.1%)
   - Underperforming by 3.9%
   - Investment: ₹1.5L | Current Value: ₹1.35L

2. **ICICI Prudential Technology Fund** - 6.8% XIRR (vs Nifty IT 11.5%)
   - Underperforming by 4.7%
   - Investment: ₹1.2L | Current Value: ₹1.08L

🟢 **Top Performers:**
1. **Mirae Asset Large Cap** - 18.5% XIRR
2. **Axis Bluechip Fund** - 16.8% XIRR

**Recommendation:** Consider switching the underperforming funds to better alternatives like SBI Small Cap Fund (22.3% XIRR) or Parag Parikh Flexi Cap Fund.`,

  portfolio: `Your portfolio analysis shows a well-diversified but optimization-ready structure:

📊 **Current Allocation:**
• Large Cap: 45% (₹19.3L) - **Optimal**
• Mid Cap: 20% (₹8.6L) - **Good**
• Small Cap: 15% (₹6.4L) - **Needs Review**
• International: 10% (₹4.3L) - **Good**
• Debt: 10% (₹4.3L) - **Low**

🎯 **Key Insights:**
• Portfolio Beta: 1.15 (Higher volatility than market)
• Sharpe Ratio: 1.42 (Excellent risk-adjusted returns)
• Maximum Drawdown: -18.5% (Acceptable)

⚠️ **Action Items:**
1. Increase debt allocation to 20% for stability
2. Review small-cap exposure - some funds underperforming
3. Consider adding REIT exposure (5-10%)`,

  goals: `Let me analyze your financial goals and current progress:

🎯 **Goal Status Overview:**

**1. Dream Home (₹80L target)**
• Current: ₹12L (15% complete)
• Timeline: 7 years remaining
• Monthly Required: ₹45,000
• Status: 🟢 On Track

**2. Child Education (₹25L target)**
• Current: ₹4.5L (18% complete)
• Timeline: 12 years remaining
• Monthly Required: ₹12,000
• Status: 🟢 Ahead of Schedule

**3. Retirement Fund (₹5Cr target)**
• Current: ₹28L (5.6% complete)
• Timeline: 25 years remaining
• Monthly Required: ₹85,000
• Status: 🔴 Behind Target

**AI Recommendation:** Increase retirement SIP by ₹15,000/month to get back on track. Consider ELSS funds for tax benefits.`,

  performance: `📈 **Portfolio Performance Analysis:**

**Overall Performance:**
• Total Returns: +17.4% (Last 12 months)
• XIRR: 15.2% (Annualized)
• Benchmark Comparison: +3.1% vs Nifty 50

**Top Performing Assets:**
1. **Mirae Asset Large Cap Fund** - 18.5% returns
2. **SBI Small Cap Fund** - 22.3% returns  
3. **Axis Bluechip Fund** - 16.8% returns

**Risk Metrics:**
• Sharpe Ratio: 1.42 (Excellent)
• Beta: 1.15 (Moderate volatility)
• Max Drawdown: -18.5%

Your portfolio is outperforming the market with good risk management!`,

  market: `🌍 **Current Market Analysis:**

**Market Overview:**
• Nifty 50: 21,456 (+0.8% today)
• Sensex: 70,842 (+1.2% today)
• Bank Nifty: 45,123 (-0.3% today)

**Sector Performance:**
• IT Sector: +2.1% (Strong)
• Banking: -0.8% (Weak)
• Pharma: +1.5% (Positive)
• Auto: +0.9% (Stable)

**AI Market Insights:**
• FII inflows positive this month
• Earnings season showing mixed results
• Consider booking profits in overvalued small-caps
• Good time to increase large-cap allocation`,

  tax: `💰 **Tax Planning Analysis:**

**Current Tax Status:**
• Tax Saver Investments: ₹1.2L (80% of 80C limit)
• ELSS Exposure: ₹85,000
• Remaining 80C Limit: ₹30,000

**Tax Optimization Opportunities:**
1. **Increase ELSS SIP** by ₹2,500/month to maximize 80C
2. **NPS Investment** - Additional ₹50,000 deduction under 80CCD
3. **Health Insurance** - Claim ₹25,000 under 80D

**Projected Tax Savings:**
• Additional savings: ₹23,400/year
• Effective tax rate reduction: 2.1%

**Recommendation:** Redirect some regular SIPs to ELSS funds for dual benefit.`,

  default: `Hello! I'm your advanced AI financial assistant. I can provide detailed analysis on:

💡 **Available Analysis:**
• Portfolio performance and optimization
• SIP and mutual fund analysis  
• Goal planning and tracking
• Tax planning strategies
• Market insights and trends
• Risk assessment

🎯 **Try asking me:**
• "How's my portfolio performing?"
• "Which SIPs are underperforming?"
• "Show my goal progress"
• "Help with tax planning"
• "What's the market outlook?"

What would you like to analyze today?`,
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="AI Financial Advisor" />
      <ToastContainer />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <EnhancedChat />
        </div>
      </main>
    </div>
  )
}
