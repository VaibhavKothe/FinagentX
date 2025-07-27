"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, RefreshCw } from "lucide-react"

interface PortfolioInsight {
  type: "positive" | "negative" | "warning" | "info"
  title: string
  description: string
  impact: string
  action?: string
}

export function PortfolioInsights() {
  const [insights, setInsights] = useState<PortfolioInsight[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generateInsights = async () => {
    setIsLoading(true)

    // Simulate AI-generated insights
    setTimeout(() => {
      const newInsights: PortfolioInsight[] = [
        {
          type: "positive",
          title: "Strong Large Cap Performance",
          description: "Your large cap funds are outperforming benchmark by 3.2%",
          impact: "+₹45,000 additional returns",
          action: "Consider increasing allocation by 5%",
        },
        {
          type: "warning",
          title: "Small Cap Underperformance",
          description: "HDFC Small Cap Fund trailing benchmark by 3.9%",
          impact: "-₹18,500 opportunity cost",
          action: "Switch to SBI Small Cap Fund",
        },
        {
          type: "info",
          title: "Tax Optimization Opportunity",
          description: "You have ₹30,000 unused 80C limit",
          impact: "₹9,300 potential tax savings",
          action: "Increase ELSS SIP by ₹2,500/month",
        },
        {
          type: "negative",
          title: "High Cash Balance",
          description: "₹85,000 idle in savings account earning 3.5%",
          impact: "-₹2,550 annual opportunity cost",
          action: "Move to liquid funds for 6-7% returns",
        },
      ]

      setInsights(newInsights)
      setIsLoading(false)
    }, 2000)
  }

  useEffect(() => {
    generateInsights()
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case "negative":
        return <TrendingDown className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <Lightbulb className="h-5 w-5 text-blue-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
        return "border-l-green-500 bg-green-50"
      case "negative":
        return "border-l-red-500 bg-red-50"
      case "warning":
        return "border-l-orange-500 bg-orange-50"
      default:
        return "border-l-blue-500 bg-blue-50"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            AI Portfolio Insights
          </CardTitle>
          <Button variant="outline" size="sm" onClick={generateInsights} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`border-l-4 p-4 rounded-lg ${getInsightColor(insight.type)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {insight.impact}
                        </Badge>
                        {insight.action && <span className="text-xs text-gray-600">💡 {insight.action}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
