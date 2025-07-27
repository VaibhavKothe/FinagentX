"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface MarketData {
  sentiment: "bullish" | "bearish" | "neutral"
  confidence: number
  nifty: { value: number; change: number }
  sectors: Array<{ name: string; change: number }>
  recommendation: string
}

export function MarketSentiment() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)

  useEffect(() => {
    // Simulate real-time market data
    const fetchMarketData = () => {
      const data: MarketData = {
        sentiment: "bullish",
        confidence: 78,
        nifty: { value: 21456, change: 0.8 },
        sectors: [
          { name: "IT", change: 2.1 },
          { name: "Banking", change: -0.8 },
          { name: "Pharma", change: 1.5 },
          { name: "Auto", change: 0.9 },
          { name: "FMCG", change: -0.3 },
        ],
        recommendation: "Market showing positive momentum. Good time to increase equity allocation in large-cap funds.",
      }
      setMarketData(data)
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (!marketData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Live Market Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{marketData.nifty.value.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Nifty 50</div>
          </div>
          <div className="text-right">
            <div className={`flex items-center ${marketData.nifty.change > 0 ? "text-green-600" : "text-red-600"}`}>
              {marketData.nifty.change > 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {marketData.nifty.change > 0 ? "+" : ""}
              {marketData.nifty.change}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Sentiment</span>
            <Badge
              variant={marketData.sentiment === "bullish" ? "default" : "secondary"}
              className={marketData.sentiment === "bullish" ? "bg-green-100 text-green-800" : ""}
            >
              {marketData.sentiment.toUpperCase()}
            </Badge>
          </div>
          <Progress value={marketData.confidence} className="h-2" />
          <div className="text-xs text-gray-600">{marketData.confidence}% confidence</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Sector Performance</div>
          {marketData.sectors.map((sector, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{sector.name}</span>
              <span className={`text-sm font-medium ${sector.change > 0 ? "text-green-600" : "text-red-600"}`}>
                {sector.change > 0 ? "+" : ""}
                {sector.change}%
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-1">AI Recommendation</div>
          <div className="text-xs text-blue-800">{marketData.recommendation}</div>
        </div>
      </CardContent>
    </Card>
  )
}
