"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Download, Copy, Code, Database, Zap, History } from "lucide-react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastContainer } from "@/components/notifications/toast"

export default function ApiViewPage() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [queryHistory, setQueryHistory] = useState<string[]>([
    "Show all SIPs with XIRR < 10%",
    "List mutual funds with expense ratio > 1.5%",
    "Get portfolio allocation by asset class",
  ])

  const sampleQueries = [
    "Show all SIPs with XIRR < 10%",
    "List mutual funds with expense ratio > 1.5%",
    "Get portfolio allocation by asset class",
    "Find transactions in last 30 days",
    "Show underperforming investments vs benchmark",
    "Calculate portfolio beta and volatility",
    "Get top 5 performing funds this year",
    "Show dividend income for tax planning",
  ]

  const apiEndpoints = [
    { method: "GET", endpoint: "/api/portfolio/summary", description: "Get portfolio overview" },
    { method: "GET", endpoint: "/api/investments/sips", description: "List all SIP investments" },
    { method: "GET", endpoint: "/api/performance/xirr", description: "Calculate XIRR for investments" },
    { method: "POST", endpoint: "/api/goals/simulate", description: "Simulate financial goals" },
    { method: "GET", endpoint: "/api/transactions/recent", description: "Get recent transactions" },
  ]

  const handleRunQuery = () => {
    if (!query.trim()) return

    setIsLoading(true)

    // Add to history
    if (!queryHistory.includes(query)) {
      setQueryHistory((prev) => [query, ...prev.slice(0, 9)])
    }

    // Enhanced query processing with better responses
    setTimeout(() => {
      let mockResult = ""

      const queryLower = query.toLowerCase()

      if (queryLower.includes("stock") && queryLower.includes("perform")) {
        mockResult = JSON.stringify(
          {
            query: query,
            results: [
              {
                stock_name: "Reliance Industries",
                current_price: 2456.75,
                change_percent: 2.3,
                investment_amount: 125000,
                current_value: 142500,
                returns: 14.0,
                recommendation: "Hold - Strong fundamentals",
              },
              {
                stock_name: "TCS",
                current_price: 3789.2,
                change_percent: -0.8,
                investment_amount: 95000,
                current_value: 108500,
                returns: 14.2,
                recommendation: "Buy - Undervalued",
              },
              {
                stock_name: "HDFC Bank",
                current_price: 1654.3,
                change_percent: 1.5,
                investment_amount: 80000,
                current_value: 89200,
                returns: 11.5,
                recommendation: "Hold - Stable performer",
              },
            ],
            portfolio_summary: {
              total_investment: 300000,
              current_value: 340200,
              overall_returns: 13.4,
              best_performer: "TCS",
              worst_performer: "HDFC Bank",
            },
            total_count: 3,
            execution_time: "0.045s",
            recommendations: [
              "Your stock portfolio is performing well with 13.4% returns",
              "Consider booking partial profits in Reliance",
              "TCS is undervalued - good time to add more",
            ],
          },
          null,
          2,
        )
      } else if (queryLower.includes("sip") && queryLower.includes("xirr")) {
        mockResult = JSON.stringify(
          {
            query: query,
            results: [
              {
                fund_name: "HDFC Small Cap Fund",
                sip_amount: 5000,
                xirr: 8.2,
                investment_date: "2022-01-15",
                current_value: 150000,
                invested_amount: 135000,
                status: "underperforming",
                benchmark_xirr: 12.1,
                underperformance: -3.9,
              },
              {
                fund_name: "ICICI Prudential Technology Fund",
                sip_amount: 3000,
                xirr: 6.8,
                investment_date: "2021-08-10",
                current_value: 120000,
                invested_amount: 108000,
                status: "underperforming",
                benchmark_xirr: 11.5,
                underperformance: -4.7,
              },
            ],
            total_count: 2,
            execution_time: "0.045s",
            recommendations: [
              "Switch HDFC Small Cap to SBI Small Cap Fund (22.3% XIRR)",
              "Consider Parag Parikh Flexi Cap as technology alternative",
              "Review and rebalance portfolio allocation",
            ],
            potential_improvement: "₹18,500 additional returns annually",
          },
          null,
          2,
        )
      } else if (queryLower.includes("expense ratio")) {
        mockResult = JSON.stringify(
          {
            query: query,
            results: [
              {
                fund_name: "ABC Large Cap Fund (Regular)",
                expense_ratio: 1.8,
                category: "Large Cap",
                current_value: 85000,
                annual_cost: 1530,
                direct_plan_available: true,
                direct_plan_expense_ratio: 1.2,
                potential_savings: 510,
              },
              {
                fund_name: "XYZ Mid Cap Fund (Regular)",
                expense_ratio: 2.1,
                category: "Mid Cap",
                current_value: 65000,
                annual_cost: 1365,
                direct_plan_available: true,
                direct_plan_expense_ratio: 1.5,
                potential_savings: 390,
              },
            ],
            total_count: 2,
            execution_time: "0.032s",
            total_annual_cost: 2895,
            potential_annual_savings: 900,
            recommendation: "Switch to direct plans to save ₹900 annually",
          },
          null,
          2,
        )
      } else if (queryLower.includes("allocation")) {
        mockResult = JSON.stringify(
          {
            query: query,
            results: {
              equity: {
                percentage: 75,
                value: 3213750,
                breakdown: {
                  large_cap: { percentage: 45, value: 1928250, funds: 8 },
                  mid_cap: { percentage: 20, value: 857000, funds: 4 },
                  small_cap: { percentage: 10, value: 428500, funds: 3 },
                },
              },
              debt: {
                percentage: 15,
                value: 642750,
                breakdown: {
                  liquid_funds: { percentage: 8, value: 342800 },
                  corporate_bonds: { percentage: 4, value: 171400 },
                  government_securities: { percentage: 3, value: 128550 },
                },
              },
              international: {
                percentage: 10,
                value: 428500,
                breakdown: {
                  us_equity: { percentage: 7, value: 299950 },
                  global_funds: { percentage: 3, value: 128550 },
                },
              },
            },
            total_portfolio_value: 4285000,
            execution_time: "0.028s",
            risk_profile: "Moderate to Aggressive",
            recommendations: [
              "Increase debt allocation to 20% for better stability",
              "Consider adding REITs (5%) for diversification",
              "Rebalance small cap exposure - currently overweight",
            ],
          },
          null,
          2,
        )
      } else {
        mockResult = JSON.stringify(
          {
            query: query,
            results: [
              {
                message: "Query processed successfully",
                data: "Financial data analysis completed",
                timestamp: new Date().toISOString(),
                insights: [
                  "Portfolio showing strong performance",
                  "Consider rebalancing for optimal returns",
                  "Tax optimization opportunities available",
                ],
              },
            ],
            total_count: 1,
            execution_time: "0.028s",
            suggestions: [
              "Try asking about specific funds or investments",
              "Query portfolio performance metrics",
              "Ask about tax planning opportunities",
            ],
          },
          null,
          2,
        )
      }

      setResult(mockResult)
      setIsLoading(false)

      // Show success notification
      if ((window as any).addToast) {
        ;(window as any).addToast({
          type: "success",
          title: "Query Executed",
          message: "Results fetched successfully",
        })
      }
    }, 800) // Reduced delay for faster response
  }

  const handleCopyResult = () => {
    navigator.clipboard.writeText(result)
    if ((window as any).addToast) {
      ;(window as any).addToast({
        type: "info",
        title: "Copied",
        message: "Results copied to clipboard",
      })
    }
  }

  const handleDownloadCsv = () => {
    const csvContent =
      "fund_name,xirr,current_value\nHDFC Small Cap Fund,8.2,150000\nICICI Prudential Technology Fund,6.8,120000"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "portfolio_data.csv"
    a.click()

    if ((window as any).addToast) {
      ;(window as any).addToast({
        type: "success",
        title: "Download Started",
        message: "CSV file is being downloaded",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Custom Queries & API" />
      <ToastContainer />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="query-builder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="query-builder">Query Builder</TabsTrigger>
            <TabsTrigger value="api-docs">API Documentation</TabsTrigger>
            <TabsTrigger value="history">Query History</TabsTrigger>
          </TabsList>

          <TabsContent value="query-builder">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Query Input */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      Natural Language Query
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Enter your query</label>
                      <Textarea
                        placeholder="Ask anything about your portfolio..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                    </div>

                    <Button onClick={handleRunQuery} disabled={!query.trim() || isLoading} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      {isLoading ? "Executing..." : "Run Query"}
                    </Button>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Sample Queries:</label>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {sampleQueries.map((sample, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start text-xs bg-transparent hover:bg-gray-50"
                            onClick={() => setQuery(sample)}
                          >
                            {sample}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* API Status */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Connection Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Connected
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Session:</span>
                      <span className="text-sm font-mono">23 min left</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rate Limit:</span>
                      <span className="text-sm">52/100 requests</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Sync:</span>
                      <span className="text-sm">2 min ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Query Results
                      </CardTitle>
                      {result && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={handleCopyResult}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                            <Download className="h-4 w-4 mr-2" />
                            CSV
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Processing your query...</p>
                          <p className="text-sm text-gray-500 mt-2">Analyzing financial data</p>
                        </div>
                      </div>
                    ) : result ? (
                      <div className="space-y-4">
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96">
                          {result}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Ready to analyze your data</p>
                        <p>Enter a natural language query above to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Export Options */}
                {result && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-sm">Export & Integration Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button variant="outline" size="sm" onClick={handleDownloadCsv}>
                          <Download className="h-4 w-4 mr-2" />
                          Excel
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          JSON
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Notion
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Google Sheets
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api-docs">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>{endpoint.method}</Badge>
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{endpoint.endpoint}</code>
                        </div>
                        <div className="text-sm text-gray-600">{endpoint.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium mb-2">Bearer Token Required</p>
                      <code className="block bg-gray-100 p-2 rounded text-xs">
                        Authorization: Bearer your_api_token_here
                      </code>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium mb-2">Rate Limits</p>
                      <ul className="text-gray-600 space-y-1">
                        <li>• 100 requests per hour</li>
                        <li>• 1000 requests per day</li>
                        <li>• Burst limit: 10 requests per minute</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Response Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                      {`{
  "status": "success",
  "data": [...],
  "meta": {
    "total_count": 10,
    "execution_time": "0.045s",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Query History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {queryHistory.map((historyQuery, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <code className="text-sm">{historyQuery}</code>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setQuery(historyQuery)}>
                        Run Again
                      </Button>
                    </div>
                  ))}
                  {queryHistory.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No query history yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
