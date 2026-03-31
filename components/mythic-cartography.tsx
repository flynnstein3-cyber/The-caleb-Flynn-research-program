"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Map, Layers, Target, RotateCcw, ZoomIn, ZoomOut, Navigation } from "lucide-react"

interface LeyLine {
  id: string
  name: string
  points: { x: number; y: number }[]
  intensity: number
  type: "primary" | "secondary" | "tertiary"
  active: boolean
}

interface ResonanceField {
  id: string
  center: { x: number; y: number }
  radius: number
  intensity: number
  type: "convergence" | "vortex" | "anchor"
}

interface MythicLocation {
  id: string
  name: string
  position: { x: number; y: number }
  type: "nexus" | "artifact" | "portal" | "shrine"
  power: number
  discovered: boolean
}

export function MythicCartography() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState([1])
  const [showLeyLines, setShowLeyLines] = useState(true)
  const [showResonanceFields, setShowResonanceFields] = useState(true)
  const [showLocations, setShowLocations] = useState(true)
  const [showCurvature, setShowCurvature] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState("all")
  const [animationSpeed, setAnimationSpeed] = useState([50])

  const [leyLines] = useState<LeyLine[]>([
    {
      id: "ley-1",
      name: "Dragon's Spine",
      points: [
        { x: 100, y: 150 },
        { x: 200, y: 120 },
        { x: 350, y: 180 },
        { x: 500, y: 140 },
      ],
      intensity: 0.9,
      type: "primary",
      active: true,
    },
    {
      id: "ley-2",
      name: "Serpent's Path",
      points: [
        { x: 80, y: 300 },
        { x: 180, y: 280 },
        { x: 280, y: 320 },
        { x: 420, y: 290 },
        { x: 520, y: 310 },
      ],
      intensity: 0.7,
      type: "secondary",
      active: true,
    },
    {
      id: "ley-3",
      name: "Phoenix Wing",
      points: [
        { x: 150, y: 80 },
        { x: 250, y: 200 },
        { x: 380, y: 250 },
        { x: 480, y: 200 },
      ],
      intensity: 0.8,
      type: "primary",
      active: true,
    },
  ])

  const [resonanceFields] = useState<ResonanceField[]>([
    {
      id: "field-1",
      center: { x: 200, y: 150 },
      radius: 60,
      intensity: 0.8,
      type: "convergence",
    },
    {
      id: "field-2",
      center: { x: 400, y: 200 },
      radius: 80,
      intensity: 0.9,
      type: "vortex",
    },
    {
      id: "field-3",
      center: { x: 300, y: 300 },
      radius: 45,
      intensity: 0.6,
      type: "anchor",
    },
  ])

  const [mythicLocations] = useState<MythicLocation[]>([
    {
      id: "loc-1",
      name: "Alpha Nexus",
      position: { x: 200, y: 150 },
      type: "nexus",
      power: 95,
      discovered: true,
    },
    {
      id: "loc-2",
      name: "Ancient Portal",
      position: { x: 400, y: 200 },
      type: "portal",
      power: 87,
      discovered: true,
    },
    {
      id: "loc-3",
      name: "Crystal Shrine",
      position: { x: 300, y: 300 },
      type: "shrine",
      power: 72,
      discovered: false,
    },
    {
      id: "loc-4",
      name: "Lost Artifact",
      position: { x: 150, y: 250 },
      type: "artifact",
      power: 64,
      discovered: false,
    },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up canvas scaling
    const scale = zoom[0]
    ctx.save()
    ctx.scale(scale, scale)

    // Draw background grid
    drawGrid(ctx, canvas.width / scale, canvas.height / scale)

    // Draw curvature overlay if enabled
    if (showCurvature) {
      drawCurvatureOverlay(ctx, canvas.width / scale, canvas.height / scale)
    }

    // Draw resonance fields
    if (showResonanceFields) {
      resonanceFields.forEach((field) => drawResonanceField(ctx, field))
    }

    // Draw ley lines
    if (showLeyLines) {
      leyLines.forEach((line) => drawLeyLine(ctx, line))
    }

    // Draw mythic locations
    if (showLocations) {
      mythicLocations.forEach((location) => drawMythicLocation(ctx, location))
    }

    ctx.restore()
  }, [
    zoom,
    showLeyLines,
    showResonanceFields,
    showLocations,
    showCurvature,
    leyLines,
    resonanceFields,
    mythicLocations,
  ])

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(139, 92, 246, 0.1)"
    ctx.lineWidth = 1

    const gridSize = 50
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const drawCurvatureOverlay = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2)
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.1)")
    gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.05)")
    gradient.addColorStop(1, "rgba(139, 92, 246, 0)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  const drawLeyLine = (ctx: CanvasRenderingContext2D, line: LeyLine) => {
    if (!line.active) return

    const colors = {
      primary: "rgba(139, 92, 246, 0.8)",
      secondary: "rgba(16, 185, 129, 0.6)",
      tertiary: "rgba(234, 88, 12, 0.4)",
    }

    ctx.strokeStyle = colors[line.type]
    ctx.lineWidth = line.type === "primary" ? 4 : line.type === "secondary" ? 3 : 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Draw the main line
    ctx.beginPath()
    ctx.moveTo(line.points[0].x, line.points[0].y)
    for (let i = 1; i < line.points.length; i++) {
      ctx.lineTo(line.points[i].x, line.points[i].y)
    }
    ctx.stroke()

    // Draw energy flow animation
    const time = Date.now() * 0.001 * (animationSpeed[0] / 50)
    const dashLength = 20
    const dashOffset = (time * 50) % (dashLength * 2)

    ctx.setLineDash([dashLength, dashLength])
    ctx.lineDashOffset = -dashOffset
    ctx.strokeStyle = colors[line.type].replace("0.8", "1").replace("0.6", "0.8").replace("0.4", "0.6")
    ctx.lineWidth = 1

    ctx.beginPath()
    ctx.moveTo(line.points[0].x, line.points[0].y)
    for (let i = 1; i < line.points.length; i++) {
      ctx.lineTo(line.points[i].x, line.points[i].y)
    }
    ctx.stroke()

    ctx.setLineDash([])
  }

  const drawResonanceField = (ctx: CanvasRenderingContext2D, field: ResonanceField) => {
    const colors = {
      convergence: "rgba(139, 92, 246, 0.2)",
      vortex: "rgba(16, 185, 129, 0.2)",
      anchor: "rgba(234, 88, 12, 0.2)",
    }

    // Draw field boundary
    ctx.strokeStyle = colors[field.type].replace("0.2", "0.6")
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    ctx.beginPath()
    ctx.arc(field.center.x, field.center.y, field.radius, 0, Math.PI * 2)
    ctx.stroke()

    // Draw field fill
    ctx.fillStyle = colors[field.type]
    ctx.fill()

    ctx.setLineDash([])
  }

  const drawMythicLocation = (ctx: CanvasRenderingContext2D, location: MythicLocation) => {
    const { x, y } = location.position
    const size = location.discovered ? 12 : 8
    const alpha = location.discovered ? 1 : 0.5

    const colors = {
      nexus: `rgba(139, 92, 246, ${alpha})`,
      portal: `rgba(16, 185, 129, ${alpha})`,
      shrine: `rgba(234, 88, 12, ${alpha})`,
      artifact: `rgba(245, 158, 11, ${alpha})`,
    }

    // Draw location marker
    ctx.fillStyle = colors[location.type]
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    // Draw power ring
    ctx.strokeStyle = colors[location.type]
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, size + 5, 0, Math.PI * 2)
    ctx.stroke()

    // Draw name if discovered
    if (location.discovered) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.font = "12px monospace"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y - size - 10)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-secondary" />
            Mythic Cartography System
          </CardTitle>
          <CardDescription>Interactive mapping of ley lines, resonance fields, and mystical locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Controls Panel */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Layer Controls</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="ley-lines" className="text-sm">
                      Ley Lines
                    </Label>
                    <Switch id="ley-lines" checked={showLeyLines} onCheckedChange={setShowLeyLines} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resonance-fields" className="text-sm">
                      Resonance Fields
                    </Label>
                    <Switch
                      id="resonance-fields"
                      checked={showResonanceFields}
                      onCheckedChange={setShowResonanceFields}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="locations" className="text-sm">
                      Mythic Locations
                    </Label>
                    <Switch id="locations" checked={showLocations} onCheckedChange={setShowLocations} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="curvature" className="text-sm">
                      Curvature Overlay
                    </Label>
                    <Switch id="curvature" checked={showCurvature} onCheckedChange={setShowCurvature} />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Zoom Level</Label>
                <Slider value={zoom} onValueChange={setZoom} min={0.5} max={3} step={0.1} className="w-full" />
                <div className="text-xs text-muted-foreground mt-1">{zoom[0].toFixed(1)}x</div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Animation Speed</Label>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  min={10}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">{animationSpeed[0]}%</div>
              </div>

              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  <Navigation className="h-4 w-4 mr-2" />
                  Center Map
                </Button>
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset View
                </Button>
              </div>
            </div>

            {/* Map Canvas */}
            <div className="lg:col-span-3">
              <div className="relative border border-border rounded-lg overflow-hidden bg-card">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-full cursor-crosshair"
                  style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)" }}
                />
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="outline" className="bg-background/80">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-background/80">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend and Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-secondary" />
              Map Legend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Ley Lines</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1 bg-secondary rounded"></div>
                  <span className="text-sm">Primary Lines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1 bg-chart-1 rounded"></div>
                  <span className="text-sm">Secondary Lines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-1 bg-chart-3 rounded"></div>
                  <span className="text-sm">Tertiary Lines</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Resonance Fields</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-secondary/20 border-2 border-secondary rounded-full"></div>
                  <span className="text-sm">Convergence</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-chart-1/20 border-2 border-chart-1 rounded-full"></div>
                  <span className="text-sm">Vortex</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-chart-3/20 border-2 border-chart-3 rounded-full"></div>
                  <span className="text-sm">Anchor</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-secondary" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold text-foreground">{leyLines.length}</div>
                <div className="text-sm text-muted-foreground">Active Ley Lines</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{resonanceFields.length}</div>
                <div className="text-sm text-muted-foreground">Resonance Fields</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {mythicLocations.filter((l) => l.discovered).length}
                </div>
                <div className="text-sm text-muted-foreground">Discovered Locations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(mythicLocations.reduce((acc, l) => acc + l.power, 0) / mythicLocations.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Average Power</div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Network Coherence</span>
                <Badge variant="outline" className="bg-chart-1 text-white">
                  Stable
                </Badge>
              </div>
              <div className="text-lg font-semibold text-foreground">94.7%</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
