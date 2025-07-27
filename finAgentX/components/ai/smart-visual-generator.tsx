"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { getFinancialDataContext } from "@/lib/financial-data-context"

interface SmartVisualGeneratorProps {
  type: string
  title: string
  description: string
}

export function SmartVisualGenerator({ type, title, description }: SmartVisualGeneratorProps) {
  const data = getFinancialDataContext()

  const renderChart = () => {
    switch (type) {
      case "goal-progress":
        return (
          <div className="space-y-6">
            {data.goals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ₹{(goal.current / 100000).toFixed(1)}L / ₹{(goal.target / 100000).toFixed(0)}L
                  </span>
                </div>
                <Progress value={goal.progress} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{goal.progress}% Complete</span>
                  <span>{goal.timeRemaining} remaining</span>
                </div>
              </div>
            ))}
          </div>
        )

      case "portfolio-performance":
        const performanceData = [
          { month: "Jan", value: 3800 },
          { month: "Feb", value: 3920 },
          { month: "Mar", value: 3850 },
          { month: "Apr", value: 4100 },
          { month: "May", value: 4050 },
          { month: "Jun", value: 4200 },
          { month: "Jul", value: 4150 },
          { month: "Aug", value: 4300 },
          { month: "Sep", value: 4250 },
          { month: "Oct", value: 4400 },
          { month: "Nov", value: 4350 },
          { month: "Dec", value: 4285 },
        ]
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}K`, "Portfolio Value"]} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )

      case "asset-allocation":
        const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.assetAllocation}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.assetAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )

      case "debt-analysis":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.debts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${(value / 1000).toFixed(0)}K`, "Amount"]} />
              <Bar dataKey="amount" fill="#ff6b6b" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "leakage-analysis":
        return (
          <div className="space-y-4">
            {data.leakages.map((leakage, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <div className="font-medium">{leakage.type}</div>
                  <div className="text-sm text-muted-foreground">{leakage.impact}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">₹{leakage.amount.toLocaleString()}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded ${
                      leakage.severity === "High"
                        ? "bg-red-100 text-red-800"
                        : leakage.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {leakage.severity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case "fund-performance":
        const allFunds = [...data.holdings.topPerformers, ...data.holdings.underPerformers]
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allFunds}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, "XIRR"]} />
              <Bar dataKey="xirr" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return <div className="text-center text-muted-foreground">Chart type not supported</div>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">AI Generated</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  )
}
