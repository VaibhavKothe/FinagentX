export function getFinancialDataContext() {
  return {
    portfolio: {
      totalValue: 4285000, // ₹42.85L
      totalInvested: 3800000, // ₹38L
      absoluteReturns: 485000, // ₹4.85L
      xirr: 15.2,
      sharpeRatio: 1.8,
      beta: 1.1,
      maxDrawdown: -18.5,
      volatility: 22.3,
    },
    holdings: {
      topPerformers: [
        {
          name: "SBI Small Cap Fund",
          amount: 450000,
          xirr: 22.3,
          category: "Small Cap",
        },
        {
          name: "Axis Bluechip Fund",
          amount: 650000,
          xirr: 18.7,
          category: "Large Cap",
        },
        {
          name: "Mirae Asset Emerging Bluechip",
          amount: 380000,
          xirr: 17.9,
          category: "Large & Mid Cap",
        },
      ],
      underPerformers: [
        {
          name: "HDFC Mid-Cap Opportunities",
          amount: 320000,
          xirr: 8.2,
          benchmark: 12.5,
        },
        {
          name: "Franklin India Prima Fund",
          amount: 280000,
          xirr: 6.8,
          benchmark: 11.2,
        },
      ],
    },
    goals: [
      {
        name: "Dream Home",
        current: 1200000, // ₹12L
        target: 8000000, // ₹80L
        progress: 15,
        status: "On Track",
        timeRemaining: "11 years",
      },
      {
        name: "Child Education",
        current: 380000, // ₹3.8L
        target: 2500000, // ₹25L
        progress: 15.2,
        status: "Behind",
        timeRemaining: "8 years",
      },
      {
        name: "Retirement",
        current: 2100000, // ₹21L
        target: 50000000, // ₹5Cr
        progress: 4.2,
        status: "Behind",
        timeRemaining: "25 years",
      },
    ],
    leakages: [
      {
        type: "High Expense Ratio Funds",
        amount: 18500,
        impact: "Reduces returns by 0.8% annually",
        severity: "High",
      },
      {
        type: "Overlapping Fund Holdings",
        amount: 7250,
        impact: "Dilutes diversification benefits",
        severity: "Medium",
      },
      {
        type: "Inactive SIP in Underperforming Fund",
        amount: 3500,
        impact: "Opportunity cost vs better alternatives",
        severity: "Low",
      },
    ],
    debts: [
      {
        type: "Credit Card",
        amount: 45000,
        interestRate: 36,
        emi: 5000,
      },
      {
        type: "Personal Loan",
        amount: 280000,
        interestRate: 14.5,
        emi: 8500,
      },
      {
        type: "Home Loan",
        amount: 3200000,
        interestRate: 8.75,
        emi: 28500,
      },
    ],
    emergencyFund: {
      current: 350000, // ₹3.5L
      target: 400000, // ₹4L
      monthsOfExpenses: 5.8,
      progress: 87.5,
    },
    assetAllocation: [
      { name: "Equity", value: 68, amount: 2913800 },
      { name: "Debt", value: 22, amount: 942700 },
      { name: "Gold", value: 7, amount: 299950 },
      { name: "Cash", value: 3, amount: 128550 },
    ],
    taxPlanning: {
      currentYear: {
        section80C: {
          used: 120000,
          remaining: 30000,
        },
        section80D: {
          used: 15000,
          remaining: 10000,
        },
        elssInvestment: 85000,
        taxSavingPotential: 14000,
      },
    },
    transactions: [
      {
        date: "2024-01-15",
        type: "SIP",
        fund: "SBI Small Cap Fund",
        amount: 5000,
      },
      {
        date: "2024-01-12",
        type: "Redemption",
        fund: "HDFC Top 100 Fund",
        amount: -25000,
      },
      {
        date: "2024-01-10",
        type: "SIP",
        fund: "Axis Bluechip Fund",
        amount: 8000,
      },
      {
        date: "2024-01-08",
        type: "Lumpsum",
        fund: "Mirae Asset Emerging Bluechip",
        amount: 50000,
      },
      {
        date: "2024-01-05",
        type: "SIP",
        fund: "Franklin India Prima Fund",
        amount: 3000,
      },
    ],
    marketData: {
      nifty: {
        value: 21850,
        change: 1.2,
      },
      sensex: {
        value: 72240,
        change: 0.8,
      },
      sentiment: "Bullish",
      confidence: 78,
    },
  }
}
