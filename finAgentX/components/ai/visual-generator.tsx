"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { ProgressRing } from "@/components/charts/progress-ring"
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, DollarSign } from "lucide-react"

interface VisualData {
  type:
    | "portfolio-performance"
    | "asset-allocation"
    | "goal-progress"
    | "sip-analysis"
    | "market-trend"
    | "comparison"
    | "risk-metrics"
  title: string
  data: any
  insights?: string[]
}

interface VisualGeneratorProps {
  visualData: VisualData
}

export function VisualGenerator({ visualData }: VisualGeneratorProps) {
  const renderVisual = () => {
    switch (visualData.type) {
      case "portfolio-performance":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                {visualData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <LineChart data={visualData.data.chartData} height={250} color="#3b82f6" />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{visualData.data.totalReturn}%</div>
                  <div className="text-sm text-gray-600">Total Return</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{visualData.data.xirr}%</div>
                  <div className="text-sm text-gray-600">XIRR</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">₹{visualData.data.currentValue}L</div>
                  <div className="text-sm text-gray-600">Current Value</div>
                </div>
              </div>
              {visualData.insights && (
                <div className="space-y-2">
                  {visualData.insights.map((insight, index) => (
                    <div key={index} className="flex items-start p-2 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-sm text-blue-800">{insight}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "asset-allocation":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                {visualData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <PieChart data={visualData.data.pieData} size={200} />
                </div>
                <div className="flex-1 space-y-3">
                  {visualData.data.pieData.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">₹{(item.amount / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-gray-500">{item.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {visualData.data.recommendation && (
                <div className="mt-4 p-3 bg-orange-50 border-l-4 border-orange-400 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-orange-800">Rebalancing Recommendation</div>
                      <div className="text-sm text-orange-700 mt-1">{visualData.data.recommendation}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      case "goal-progress":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                {visualData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {visualData.data.goals.map((goal: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{goal.name}</h3>
                        <p className="text-sm text-gray-600">
                          Target: ₹{goal.target}L • Timeline: {goal.timeline}
                        </p>
                      </div>
                      <ProgressRing progress={goal.progress} size={60} color={goal.color}>
                        <div className="text-center">
                          <div className="text-sm font-bold">{goal.progress}%</div>
                        </div>
                      </ProgressRing>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current: ₹{goal.current}L</span>
                        <span
                          className={
                            goal.status === "on-track"
                              ? "text-green-600"
                              : goal.status === "ahead"
                                ? "text-blue-600"
                                : "text-red-600"
                          }
                        >
                          {goal.status === "on-track" ? "On Track" : goal.status === "ahead" ? "Ahead" : "Behind"}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <div className="text-xs text-gray-500">
                        Monthly SIP: ₹{goal.monthlySip.toLocaleString()} • Required: ₹
                        {goal.requiredSip.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "sip-analysis":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                {visualData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Top Performers */}
                <div>
                  <h4 className="font-medium text-green-700 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Top Performers
                  </h4>
                  <div className="space-y-2">
                    {visualData.data.topPerformers.map((fund: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{fund.name}</div>
                          <div className="text-xs text-gray-600">₹{fund.sipAmount.toLocaleString()}/month</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-700">{fund.xirr}%</div>
                          <div className="text-xs text-green-600">XIRR</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Underperformers */}
                <div>
                  <h4 className="font-medium text-red-700 mb-3 flex items-center">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    Needs Attention
                  </h4>
                  <div className="space-y-2">
                    {visualData.data.underPerformers.map((fund: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{fund.name}</div>
                          <div className="text-xs text-gray-600">₹{fund.sipAmount.toLocaleString()}/month</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-red-700">{fund.xirr}%</div>
                          <div className="text-xs text-red-600">vs {fund.benchmark}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {visualData.data.recommendation && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                    <div className="font-medium text-blue-800">AI Recommendation</div>
                    <div className="text-sm text-blue-700 mt-1">{visualData.data.recommendation}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )

      case "market-trend":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                {visualData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{visualData.data.nifty.value}</div>
                  <div className="text-sm text-gray-600">Nifty 50</div>
                  <div
                    className={`text-sm font-medium ${visualData.data.nifty.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {visualData.data.nifty.change > 0 ? "+" : ""}
                    {visualData.data.nifty.change}%
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{visualData.data.sensex.value}</div>
                  <div className="text-sm text-gray-600">Sensex</div>
                  <div
                    className={`text-sm font-medium ${visualData.data.sensex.change > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {visualData.data.sensex.change > 0 ? "+" : ""}
                    {visualData.data.sensex.change}%
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium">Sector Performance</h4>
                {visualData.data.sectors.map((sector: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{sector.name}</span>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium mr-2 ${sector.change > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {sector.change > 0 ? "+" : ""}
                        {sector.change}%
                      </span>
                      {sector.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Market Sentiment</div>
                <div className="flex items-center justify-between mt-2">
                  <Badge
                    variant="secondary"
                    className={`${visualData.data.sentiment === "bullish" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {visualData.data.sentiment.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-blue-700">{visualData.data.confidence}% confidence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "comparison":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">{visualData.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visualData.data.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">{item.category}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold">{item.value}%</div>
                        <div className="text-xs text-gray-500">Returns</div>
                      </div>
                      <div className="w-20">
                        <Progress value={item.value} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case "risk-metrics":
        return (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
                {visualData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(visualData.data.metrics).map(([key, value]: [string, any], index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{value}</div>
                    <div className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                  </div>
                ))}
              </div>
              {visualData.data.riskLevel && (
                <div
                  className={`mt-4 p-3 rounded-lg ${
                    visualData.data.riskLevel === "low"
                      ? "bg-green-50 border-green-200"
                      : visualData.data.riskLevel === "medium"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                  } border`}
                >
                  <div className="font-medium">
                    Risk Level: <span className="capitalize">{visualData.data.riskLevel}</span>
                  </div>
                  <div className="text-sm mt-1">{visualData.data.riskDescription}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return renderVisual()
}
