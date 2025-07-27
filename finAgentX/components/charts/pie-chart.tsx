"use client"

import { useState } from "react"

interface PieData {
  name: string
  value: number
  color: string
  amount: number
}

interface PieChartProps {
  data: PieData[]
  size?: number
}

export function PieChart({ data, size = 200 }: PieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const centerX = size / 2
  const centerY = size / 2
  const radius = size / 2 - 20
  const innerRadius = radius * 0.5

  let currentAngle = -90 // Start from top

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    // Calculate path for donut segment
    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startAngleRad)
    const y1 = centerY + radius * Math.sin(startAngleRad)
    const x2 = centerX + radius * Math.cos(endAngleRad)
    const y2 = centerY + radius * Math.sin(endAngleRad)

    const x3 = centerX + innerRadius * Math.cos(endAngleRad)
    const y3 = centerY + innerRadius * Math.sin(endAngleRad)
    const x4 = centerX + innerRadius * Math.cos(startAngleRad)
    const y4 = centerY + innerRadius * Math.sin(startAngleRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      "Z",
    ].join(" ")

    currentAngle += angle

    return {
      ...item,
      pathData,
      percentage,
      startAngle,
      endAngle,
      index,
    }
  })

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {segments.map((segment, index) => {
            const isHovered = hoveredSegment === index
            const scale = isHovered ? 1.05 : 1

            return (
              <g key={index}>
                <path
                  d={segment.pathData}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200 drop-shadow-sm"
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: `${centerX}px ${centerY}px`,
                  }}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                />

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={centerX - 50}
                      y={centerY - 40}
                      width="100"
                      height="30"
                      rx="4"
                      fill="rgba(0, 0, 0, 0.8)"
                      className="animate-in fade-in duration-200"
                    />
                    <text x={centerX} y={centerY - 30} textAnchor="middle" className="text-xs fill-white font-medium">
                      {segment.name}
                    </text>
                    <text x={centerX} y={centerY - 15} textAnchor="middle" className="text-xs fill-white">
                      {segment.percentage.toFixed(1)}% • ₹{(segment.amount / 100000).toFixed(1)}L
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Center text */}
          <text x={centerX} y={centerY - 5} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
            Total Assets
          </text>
          <text x={centerX} y={centerY + 10} textAnchor="middle" className="text-xs fill-gray-500">
            ₹{(data.reduce((sum, item) => sum + item.amount, 0) / 100000).toFixed(1)}L
          </text>
        </svg>
      </div>
    </div>
  )
}
