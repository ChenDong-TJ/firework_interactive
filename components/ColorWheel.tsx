'use client'

import React, { useRef, useEffect } from "react"

interface ColorWheelProps {
  hue: number
  onChange: (hue: number) => void
}

export function ColorWheel({ hue, onChange }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D | null
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const outerRadius = Math.min(centerX, centerY)
    const innerRadius = outerRadius * 0.7

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw the hue ring
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 1) * Math.PI / 180
      const endAngle = (angle + 1) * Math.PI / 180

      ctx.beginPath()
      ctx.moveTo(centerX + innerRadius * Math.cos(startAngle), centerY + innerRadius * Math.sin(startAngle))
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle)
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
      ctx.closePath()

      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`
      ctx.fill()
    }

    // Draw the selector
    const selectorAngle = hue * Math.PI / 180
    const selectorRadius = (innerRadius + outerRadius) / 2
    const selectorX = centerX + selectorRadius * Math.cos(selectorAngle)
    const selectorY = centerY + selectorRadius * Math.sin(selectorAngle)

    ctx.beginPath()
    ctx.arc(selectorX, selectorY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 2
    ctx.stroke()
  }, [hue])

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const angle = Math.atan2(y - centerY, x - centerX)
    const clickRadius = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
    const outerRadius = Math.min(centerX, centerY)
    const innerRadius = outerRadius * 0.7

    // Check if the click is within the hue ring
    if (clickRadius >= innerRadius && clickRadius <= outerRadius) {
      // Calculate the hue based on the angle
      const newHue = (angle * 180) / Math.PI
      const normalizedHue = (newHue + 360) % 360 // Normalize the hue to 0-360
      onChange(normalizedHue)
    }
  }

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      onClick={handleClick}
      className="cursor-pointer"
      role="img"
      aria-label={`Color wheel with current hue at ${Math.round(hue)}°`}
    />
  )
}
