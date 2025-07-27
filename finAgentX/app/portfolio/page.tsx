"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Filter, Download, RefreshCw } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastContainer } from "@/components/notifications/toast"

const topPerformers = [
  { name: "Mirae Asset Large Cap Fund", xirr: 18.5, amount: 450000, category: "Large Cap", change: "+2.3%" },
  { name: "Axis Bluechip Fund", xirr: 16.8, amount: 320000, category: "Large Cap", change: "+1.8%" },
  { name: "SBI Small Cap Fund", xirr: 22.3, amount: 180000, category: "Small Cap", change: "+4.1%" },
  { name: "HDFC Index Fund - Nifty 50", xirr: 14.2, amount: 280000, category: "Index", change: "+1.2%" },
  { name: "Parag Parikh Flexi Cap", xirr: 19.7, amount: 220000, category: "Flexi Cap", change: "+3.2%" },
]

const underPerformers = [
  { name: "HDFC Small Cap Fund", xirr: 8.2, benchmark: 12.1, amount: 150000, category: "Small Cap", change: "-1.5%" },
  {
    name: "ICICI Prudential Technology Fund",
    xirr: 6.8,
    benchmark: 11.5,
    amount: 120000,
    category: "Sectoral",
    change: "-2.8%",
  },
  {
    name: "Kotak Emerging Equity Fund",
    xirr: 9.1,
    benchmark: 13.2,
    amount: 95000,
    category: "Mid Cap",
    change: "-0.9%",
  },
]

const leakages = [
  {
    type: "Idle Bank Cash",
    amount: 85000,
    impact: "₹5,950/year lost",
    recommendation: "Move to liquid funds for 6-7% returns",
    severity: "medium",
  },
  {
    type: "High Interest Credit Card",
    amount: 45000,
    impact: "₹16,200/year cost",
    recommendation: "Pay off immediately - highest priority",
    severity: "high",
  },
  {
    type: "High Expense Ratio Funds",
    amount: 220000,
    impact: "₹4,400/year extra cost",
    recommendation: "Switch to direct plans to save 0.5-1%",
    severity: "medium",
  },
  {
    type: "Overlapping Fund Holdings",
    amount: 180000,
    impact: "₹2,700/year opportunity cost",
    recommendation: "Consolidate similar funds for better tracking",
    severity: "low",
  },
]

const portfolioMetrics = {
  totalValue: 4285000,
  totalInvested: 3650000,
  absoluteReturns: 635000,
  xirr: 15.2,
  sharpeRatio: 1.42,
  beta: 1.15,
  maxDrawdown: -18.5,
  volatility: 16.8,
}

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterCategory, setFilterCategory] = useState("all")
  const [showFilterDialog, setShowFilterDialog] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      if ((window as any).addToast) {
        ;(window as any).addToast({
          type: "success",
          title: "Portfolio Updated",
          message: "Latest data has been fetched successfully",
        })
      }
    }, 2000)
  }

  const handleExport = () => {
    // Create CSV content with portfolio data
    const csvContent = [
      ["Fund Name", "Category", "Investment Amount", "Current Value", "XIRR", "Status"].join(","),
      ...topPerformers.map((fund) =>
        [
          fund.name,
          fund.category,
          fund.amount,
          Math.round(fund.amount * (1 + fund.xirr / 100)),
          `${fund.xirr}%`,
          "Top Performer",
        ].join(","),
      ),
      ...underPerformers.map((fund) =>
        [
          fund.name,
          fund.category,
          fund.amount,
          Math.round(fund.amount * (1 + fund.xirr / 100)),
          `${fund.xirr}%`,
          "Underperformer",
        ].join(","),
      ),
    ].join("\n")

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `portfolio-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if ((window as any).addToast) {
      ;(window as any).addToast({
        type: "success",
        title: "Export Complete",
        message: "Portfolio report has been downloaded successfully",
      })
    }
  }

  const getFilteredFunds = (funds: any[]) => {
    if (filterCategory === "all") return funds
    return funds.filter((fund) => fund.category === filterCategory)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Portfolio Analyzer" />
      <ToastContainer />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(portfolioMetrics.totalValue / 100000).toFixed(2)}L
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">
                      +
                      {(
                        ((portfolioMetrics.totalValue - portfolioMetrics.totalInvested) /
                          portfolioMetrics.totalInvested) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">XIRR</p>
                  <p className="text-2xl font-bold text-green-600">{portfolioMetrics.xirr}%</p>
                  <p className="text-sm text-gray-500">Annualized</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-purple-600">{portfolioMetrics.sharpeRatio}</p>
                  <p className="text-sm text-gray-500">Risk-adjusted</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
                  <p className="text-2xl font-bold text-red-600">{portfolioMetrics.maxDrawdown}%</p>
                  <p className="text-sm text-gray-500">Risk measure</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight Box */}
        <Card className="mb-8 border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start">
              <Lightbulb className="h-6 w-6 text-blue-600 mr-3 mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 mb-2">AI Portfolio Insight</h3>
                <p className="text-blue-800 mb-4">
                  Your portfolio shows strong performance with 15.2% XIRR, outperforming market by 3.1%. However,
                  identified leakages could save you ₹29,250 annually. Small-cap exposure needs rebalancing - consider
                  switching underperforming funds.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="bg-white">
                    Get Detailed Analysis
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white">
                    Rebalance Suggestions
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Filter Holdings
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filter Dialog */}
        {showFilterDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
              <h3 className="text-lg font-semibold mb-4">Filter Holdings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All Categories</option>
                    <option value="Large Cap">Large Cap</option>
                    <option value="Mid Cap">Mid Cap</option>
                    <option value="Small Cap">Small Cap</option>
                    <option value="Index">Index</option>
                    <option value="Sectoral">Sectoral</option>
                    <option value="Flexi Cap">Flexi Cap</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowFilterDialog(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowFilterDialog(false)
                      if ((window as any).addToast) {
                        ;(window as any).addToast({
                          type: "info",
                          title: "Filter Applied",
                          message: `Showing ${filterCategory === "all" ? "all" : filterCategory} funds`,
                        })
                      }
                    }}
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performers">Performance</TabsTrigger>
            <TabsTrigger value="leakages">Leakages</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPerformers.slice(0, 3).map((fund, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{fund.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {fund.category} • ₹{(fund.amount / 1000).toFixed(0)}K invested
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-700">{fund.xirr}%</div>
                          <div className="text-xs text-green-600">{fund.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Underperformers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <TrendingDown className="h-5 w-5 mr-2" />
                    Needs Attention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {underPerformers.map((fund, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{fund.name}</div>
                          <div className="text-xs text-gray-600 mt-1">
                            {fund.category} • ₹{(fund.amount / 1000).toFixed(0)}K invested
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-700">{fund.xirr}%</div>
                          <div className="text-xs text-red-600">vs {fund.benchmark}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Complete Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredFunds([...topPerformers, ...underPerformers]).map((fund, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{fund.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {fund.category} • Invested: ₹{(fund.amount / 1000).toFixed(0)}K
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${fund.xirr > 12 ? "text-green-600" : "text-red-600"}`}>
                          {fund.xirr}%
                        </div>
                        <div className="text-sm text-gray-500">XIRR</div>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  {getFilteredFunds([...topPerformers, ...underPerformers]).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No funds match the selected filter</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leakages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Portfolio Leakage Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {leakages.map((leakage, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        leakage.severity === "high"
                          ? "bg-red-50 border-red-200"
                          : leakage.severity === "medium"
                            ? "bg-orange-50 border-orange-200"
                            : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={`font-medium ${
                            leakage.severity === "high"
                              ? "text-red-900"
                              : leakage.severity === "medium"
                                ? "text-orange-900"
                                : "text-yellow-900"
                          }`}
                        >
                          {leakage.type}
                        </h3>
                        <Badge variant={leakage.severity === "high" ? "destructive" : "secondary"} className="text-xs">
                          {leakage.impact}
                        </Badge>
                      </div>
                      <div
                        className={`text-sm mb-3 ${
                          leakage.severity === "high"
                            ? "text-red-800"
                            : leakage.severity === "medium"
                              ? "text-orange-800"
                              : "text-yellow-800"
                        }`}
                      >
                        Amount: ₹{leakage.amount.toLocaleString()}
                      </div>
                      <div
                        className={`text-xs p-2 rounded ${
                          leakage.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : leakage.severity === "medium"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        💡 {leakage.recommendation}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Total Annual Impact</h3>
                      <p className="text-sm text-gray-600">Potential savings from fixing leakages</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">₹29,250</div>
                      <div className="text-sm text-gray-600">per year</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Portfolio Beta</span>
                    <span className="font-semibold">{portfolioMetrics.beta}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Volatility</span>
                    <span className="font-semibold">{portfolioMetrics.volatility}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sharpe Ratio</span>
                    <span className="font-semibold text-green-600">{portfolioMetrics.sharpeRatio}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Drawdown</span>
                    <span className="font-semibold text-red-600">{portfolioMetrics.maxDrawdown}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Invested</span>
                    <span className="font-semibold">₹{(portfolioMetrics.totalInvested / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Value</span>
                    <span className="font-semibold">₹{(portfolioMetrics.totalValue / 100000).toFixed(2)}L</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Absolute Returns</span>
                    <span className="font-semibold text-green-600">
                      ₹{(portfolioMetrics.absoluteReturns / 100000).toFixed(2)}L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">XIRR</span>
                    <span className="font-semibold text-green-600">{portfolioMetrics.xirr}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
