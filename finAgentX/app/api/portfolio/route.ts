export async function GET() {
  // Mock portfolio data - replace with real data source
  const portfolioData = {
    netWorth: 4285000,
    totalInvested: 3650000,
    xirr: 15.2,
    monthlyGrowth: 12.5,
    assets: [
      { name: "Mirae Asset Large Cap Fund", value: 450000, xirr: 18.5, category: "Large Cap" },
      { name: "Axis Bluechip Fund", value: 320000, xirr: 16.8, category: "Large Cap" },
      { name: "SBI Small Cap Fund", value: 180000, xirr: 22.3, category: "Small Cap" },
      { name: "HDFC Small Cap Fund", value: 150000, xirr: 8.2, category: "Small Cap" },
      { name: "ICICI Prudential Technology Fund", value: 120000, xirr: 6.8, category: "Sectoral" },
    ],
    goals: [
      { name: "Dream Home", target: 8000000, current: 1200000, progress: 15 },
      { name: "Child Education", target: 2500000, current: 450000, progress: 18 },
      { name: "Retirement Fund", target: 50000000, current: 2800000, progress: 5.6 },
    ],
    emergencyFund: {
      current: 350000,
      target: 400000,
      progress: 87.5,
    },
  }

  return Response.json(portfolioData)
}
