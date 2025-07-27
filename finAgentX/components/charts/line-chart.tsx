"use client"

import { useState } from "react"

interface DataPoint {
  month: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  color?: string
}

export function LineChart({ data, height = 200, color = "#3b82f6" }: LineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue
  const padding = 40

  const width = 600
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + ((maxValue - point.value) / range) * chartHeight
    return { x, y, ...point }
  })

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L"
    return `${path} ${command} ${point.x} ${point.y}`
  }, "")

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="50" height="40" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 40" fill="none" stroke="#f0f0f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const value = minValue + range * ratio
          const y = padding + (1 - ratio) * chartHeight
          return (
            <g key={index}>
              <text x={padding - 10} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">
                ₹{(value / 100000).toFixed(1)}L
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text key={index} x={point.x} y={height - 10} textAnchor="middle" className="text-xs fill-gray-500">
            {point.month}
          </text>
        ))}

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-sm"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === index ? 6 : 4}
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 drop-shadow-sm"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />

            {/* Tooltip */}
            {hoveredPoint === index && (
              <g>
                <rect
                  x={point.x - 40}
                  y={point.y - 35}
                  width="80"
                  height="25"
                  rx="4"
                  fill="rgba(0, 0, 0, 0.8)"
                  className="animate-in fade-in duration-200"
                />
                <text x={point.x} y={point.y - 20} textAnchor="middle" className="text-xs fill-white font-medium">
                  ₹{(point.value / 100000).toFixed(2)}L
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
