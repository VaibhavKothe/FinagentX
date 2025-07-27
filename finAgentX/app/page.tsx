"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, MessageCircle, Target, BarChart3, Settings, ArrowUpRight, ArrowDownRight } from "lucide-react"
import Link from "next/link"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastContainer } from "@/components/notifications/toast"
import { PortfolioInsights } from "@/components/ai/portfolio-insights"
import { MarketSentiment } from "@/components/ai/market-sentiment"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { ProgressRing } from "@/components/charts/progress-ring"

const assetData = [
  { name: "Mutual Funds", value: 45, color: "#3b82f6", amount: 1928250 },
  { name: "Stocks", value: 25, color: "#10b981", amount: 1071250 },
  { name: "FDs", value: 15, color: "#f59e0b", amount: 642750 },
  { name: "Real Estate", value: 10, color: "#ef4444", amount: 428500 },
  { name: "Others", value: 5, color: "#8b5cf6", amount: 214250 },
]

const performanceData = [
  { month: "Jan", value: 3800000 },
  { month: "Feb", value: 3950000 },
  { month: "Mar", value: 4100000 },
  { month: "Apr", value: 4050000 },
  { month: "May", value: 4200000 },
  { month: "Jun", value: 4285000 },
]

const recentTransactions = [
  { type: "SIP", fund: "Mirae Asset Large Cap", amount: 5000, date: "2024-01-15", status: "completed" },
  { type: "Dividend", fund: "HDFC Index Fund", amount: 1250, date: "2024-01-14", status: "completed" },
  { type: "SIP", fund: "Axis Bluechip Fund", amount: 3000, date: "2024-01-10", status: "completed" },
  { type: "Redemption", fund: "SBI Small Cap", amount: -15000, date: "2024-01-08", status: "completed" },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Dashboard" />
      <ToastContainer />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Worth</p>
                  <p className="text-2xl font-bold text-gray-900">₹42.85L</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.5%</span>
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
                  <p className="text-sm font-medium text-gray-600">Monthly SIP</p>
                  <p className="text-2xl font-bold text-gray-900">₹25,000</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5.2%</span>
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Portfolio Return</p>
                  <p className="text-2xl font-bold text-gray-900">15.2%</p>
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">CAGR</span>
                  </div>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Debt</p>
                  <p className="text-2xl font-bold text-red-600">₹26.95L</p>
                  <div className="flex items-center mt-1">
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600">-2.1%</span>
                  </div>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Net Worth Trend */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Net Worth Trend</CardTitle>
              <Link href="/chat">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ask AI
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <LineChart data={performanceData} height={250} color="#3b82f6" />
              </div>
            </CardContent>
          </Card>

          {/* Assets Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Assets Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <PieChart data={assetData} size={200} />
                <div className="mt-4 space-y-2 w-full">
                  {assetData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">₹{(item.amount / 100000).toFixed(1)}L</div>
                        <div className="text-xs text-gray-500">{item.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${
                          transaction.type === "SIP"
                            ? "bg-blue-500"
                            : transaction.type === "Dividend"
                              ? "bg-green-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">{transaction.type}</div>
                        <div className="text-xs text-gray-600">{transaction.fund}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-medium text-sm ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Fund */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Fund Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">₹3,50,000</div>
                  <div className="text-sm text-gray-500">Available Liquidity</div>
                </div>
                <ProgressRing progress={87.5} size={80} color="#10b981">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">87.5%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </ProgressRing>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Target: 6 months expenses</span>
                  <span>₹4,00,000</span>
                </div>
                <Progress value={87.5} className="h-2" />
                <div className="text-xs text-gray-500">₹50,000 more needed</div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-800 mb-1">AI Recommendation</div>
                <div className="text-xs text-blue-700">
                  Add ₹50,000 more to reach your ideal emergency fund target. Consider liquid funds for better returns.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add the new AI components */}
          <PortfolioInsights />
          <MarketSentiment />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/goals">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Target className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-medium">Goal Simulator</h3>
                  <p className="text-sm text-gray-500">Plan financial goals</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/portfolio">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <BarChart3 className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-medium">Portfolio Analyzer</h3>
                  <p className="text-sm text-gray-500">Analyze performance</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/api-view">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <Settings className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-medium">Custom Queries</h3>
                  <p className="text-sm text-gray-500">Advanced API access</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-6">
                <MessageCircle className="h-8 w-8 text-orange-600 mr-4" />
                <div>
                  <h3 className="font-medium">AI Assistant</h3>
                  <p className="text-sm text-gray-500">Ask questions</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
