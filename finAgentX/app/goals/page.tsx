"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Target, AlertCircle, CheckCircle, TrendingUp, Calculator } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { ToastContainer } from "@/components/notifications/toast"

export default function GoalsPage() {
  const [goalType, setGoalType] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [timeline, setTimeline] = useState([5])
  const [monthlySIP, setMonthlySIP] = useState("")
  const [showProjection, setShowProjection] = useState(false)
  const [projectionData, setProjectionData] = useState<any[]>([])
  const [goalGap, setGoalGap] = useState<any>(null)

  const calculateProjection = () => {
    const target = Number.parseFloat(targetAmount)
    const monthly = Number.parseFloat(monthlySIP)
    const years = timeline[0]
    const annualReturn = 0.12 // 12% assumed return

    if (!target || !monthly || !years) return

    const data = []
    let currentAmount = 0

    for (let year = 0; year <= years; year++) {
      if (year > 0) {
        // Calculate SIP growth with compound interest
        const monthlyReturn = annualReturn / 12
        const months = year * 12
        currentAmount = monthly * (((1 + monthlyReturn) ** months - 1) / monthlyReturn) * (1 + monthlyReturn)
      }

      data.push({
        year,
        amount: currentAmount,
        target: target,
        shortfall: Math.max(0, target - currentAmount),
      })
    }

    setProjectionData(data)

    // Calculate gap analysis
    const finalAmount = data[data.length - 1].amount
    const gap = target - finalAmount
    const requiredMonthly = gap > 0 ? gap / years / 12 + monthly : monthly

    setGoalGap({
      gap: gap,
      isAchievable: gap <= 0,
      requiredMonthly: Math.ceil(requiredMonthly),
      currentMonthly: monthly,
      recommendations:
        gap > 0
          ? [
              `Increase SIP to ₹${Math.ceil(requiredMonthly).toLocaleString()}/month`,
              `Or extend timeline to ${Math.ceil(years * (target / finalAmount))} years`,
              `Consider lump sum investment of ₹${Math.ceil(gap * 0.3).toLocaleString()}`,
            ]
          : [
              "You're on track to achieve this goal!",
              "Consider investing surplus in other goals",
              "Review and rebalance annually",
            ],
    })

    setShowProjection(true)

    // Show notification
    if ((window as any).addToast) {
      ;(window as any).addToast({
        type: gap <= 0 ? "success" : "info",
        title: "Goal Analysis Complete",
        message: gap <= 0 ? "You're on track!" : "Gap identified - see recommendations",
      })
    }
  }

  const existingGoals = [
    {
      name: "Dream Home",
      target: 8000000,
      current: 1200000,
      timeline: "7 years",
      status: "on-track",
      monthlyRequired: 45000,
      currentSIP: 45000,
      progress: 15,
    },
    {
      name: "Child Education",
      target: 2500000,
      current: 450000,
      timeline: "12 years",
      status: "ahead",
      monthlyRequired: 12000,
      currentSIP: 15000,
      progress: 18,
    },
    {
      name: "Retirement Fund",
      target: 50000000,
      current: 2800000,
      timeline: "25 years",
      status: "behind",
      monthlyRequired: 85000,
      currentSIP: 65000,
      progress: 5.6,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title="Goal Simulator" />
      <ToastContainer />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Goal Simulator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Create New Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select value={goalType} onValueChange={setGoalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home Purchase</SelectItem>
                    <SelectItem value="car">Car Purchase</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="education">Child Education</SelectItem>
                    <SelectItem value="vacation">Dream Vacation</SelectItem>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="business">Business Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="target-amount">Target Amount (₹)</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="50,00,000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                />
              </div>

              <div>
                <Label>Timeline: {timeline[0]} years</Label>
                <Slider value={timeline} onValueChange={setTimeline} max={30} min={1} step={1} className="mt-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>

              <div>
                <Label htmlFor="monthly-sip">Monthly SIP Capacity (₹)</Label>
                <Input
                  id="monthly-sip"
                  type="number"
                  placeholder="15,000"
                  value={monthlySIP}
                  onChange={(e) => setMonthlySIP(e.target.value)}
                />
              </div>

              <Button
                onClick={calculateProjection}
                className="w-full"
                disabled={!goalType || !targetAmount || !monthlySIP}
              >
                <Target className="h-4 w-4 mr-2" />
                Calculate Goal Projection
              </Button>
            </CardContent>
          </Card>

          {/* Projection Results */}
          <Card>
            <CardHeader>
              <CardTitle>Goal Projection Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {showProjection && projectionData.length > 0 ? (
                <div className="space-y-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={projectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                        <Tooltip
                          formatter={(value, name) => [
                            `₹${(value / 100000).toFixed(2)}L`,
                            name === "amount" ? "Projected Amount" : "Target",
                          ]}
                        />
                        <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} name="amount" />
                        <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="target" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {goalGap && (
                    <div
                      className={`border rounded-lg p-4 ${
                        goalGap.isAchievable ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        {goalGap.isAchievable ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                        )}
                        <span className={`font-medium ${goalGap.isAchievable ? "text-green-800" : "text-red-800"}`}>
                          {goalGap.isAchievable ? "Goal Achievable!" : "Goal Gap Identified"}
                        </span>
                      </div>

                      {!goalGap.isAchievable && (
                        <p className="text-red-700 text-sm mb-3">
                          With current SIP of ₹{goalGap.currentMonthly.toLocaleString()}/month, you'll have a shortfall
                          of ₹{(goalGap.gap / 100000).toFixed(1)}L.
                        </p>
                      )}

                      <div className="space-y-2">
                        <div
                          className={`text-sm font-medium ${goalGap.isAchievable ? "text-green-800" : "text-red-800"}`}
                        >
                          AI Recommendations:
                        </div>
                        <ul className={`text-sm space-y-1 ${goalGap.isAchievable ? "text-green-700" : "text-red-700"}`}>
                          {goalGap.recommendations.map((rec: string, index: number) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Fill in the goal details and click "Calculate Goal Projection" to see analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Existing Goals */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Your Existing Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {existingGoals.map((goal, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    goal.status === "on-track"
                      ? "border-l-blue-500"
                      : goal.status === "ahead"
                        ? "border-l-green-500"
                        : "border-l-red-500"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          goal.status === "on-track"
                            ? "bg-blue-100 text-blue-800"
                            : goal.status === "ahead"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {goal.status === "on-track" ? "On Track" : goal.status === "ahead" ? "Ahead" : "Behind"}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target:</span>
                        <span className="font-semibold">₹{(goal.target / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current:</span>
                        <span className="font-semibold">₹{(goal.current / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-semibold">{goal.timeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Required SIP:</span>
                        <span className="font-semibold">₹{goal.monthlyRequired.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current SIP:</span>
                        <span
                          className={`font-semibold ${
                            goal.currentSIP >= goal.monthlyRequired ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          ₹{goal.currentSIP.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{goal.progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            goal.status === "ahead"
                              ? "bg-green-500"
                              : goal.status === "on-track"
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
