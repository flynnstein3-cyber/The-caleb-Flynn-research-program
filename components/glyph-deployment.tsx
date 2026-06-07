"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  Zap,
  Shield,
  Eye,
  Settings,
  Play,
  Pause,
  Square,
  Download,
  Plus,
  Copy,
  Edit,
  MapPin,
  Activity,
  Clock,
} from "lucide-react"

interface Glyph {
  id: string
  name: string
  symbol: string
  type: "protection" | "amplification" | "binding" | "detection" | "temporal"
  powerLevel: number
  stability: number
  range: number
  duration: number
  createdAt: string
  lastActivated?: string
  status: "active" | "dormant" | "charging" | "depleted"
  coordinates: { x: number; y: number }
  properties: {
    resonanceFreq: number
    harmonicPattern: number[]
    energyConsumption: number
    effectRadius: number
  }
}

interface Deployment {
  id: string
  name: string
  glyphIds: string[]
  targetLocation: { x: number; y: number; name: string }
  status: "planning" | "deploying" | "active" | "completed" | "failed"
  startTime?: string
  estimatedDuration: number
  progress: number
  networkEffect: number
}

export function GlyphDeployment() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [glyphs, setGlyphs] = useState<Glyph[]>([
    {
      id: "glyph-001",
      name: "Aegis Ward",
      symbol: "⚡",
      type: "protection",
      powerLevel: 87,
      stability: 94,
      range: 500,
      duration: 3600,
      createdAt: "2025-01-20T10:30:00Z",
      lastActivated: "2025-01-21T09:15:00Z",
      status: "active",
      coordinates: { x: 200, y: 150 },
      properties: {
        resonanceFreq: 432.5,
        harmonicPattern: [1, 0.8, 0.6, 0.4, 0.2],
        energyConsumption: 25,
        effectRadius: 100,
      },
    },
    {
      id: "glyph-002",
      name: "Resonance Amplifier",
      symbol: "◈",
      type: "amplification",
      powerLevel: 92,
      stability: 89,
      range: 750,
      duration: 7200,
      createdAt: "2025-01-19T14:20:00Z",
      lastActivated: "2025-01-21T08:30:00Z",
      status: "active",
      coordinates: { x: 400, y: 200 },
      properties: {
        resonanceFreq: 528.0,
        harmonicPattern: [1, 0.9, 0.7, 0.5, 0.3],
        energyConsumption: 35,
        effectRadius: 150,
      },
    },
    {
      id: "glyph-003",
      name: "Temporal Anchor",
      symbol: "⧖",
      type: "temporal",
      powerLevel: 76,
      stability: 82,
      range: 300,
      duration: 1800,
      createdAt: "2025-01-21T07:45:00Z",
      status: "charging",
      coordinates: { x: 300, y: 300 },
      properties: {
        resonanceFreq: 396.0,
        harmonicPattern: [1, 0.6, 0.8, 0.4, 0.6],
        energyConsumption: 40,
        effectRadius: 80,
      },
    },
    {
      id: "glyph-004",
      name: "Detection Matrix",
      symbol: "◉",
      type: "detection",
      powerLevel: 64,
      stability: 91,
      range: 1000,
      duration: 5400,
      createdAt: "2025-01-18T16:10:00Z",
      status: "dormant",
      coordinates: { x: 150, y: 250 },
      properties: {
        resonanceFreq: 741.0,
        harmonicPattern: [1, 0.7, 0.5, 0.8, 0.4],
        energyConsumption: 20,
        effectRadius: 200,
      },
    },
  ])

  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: "deploy-001",
      name: "Alpha Nexus Defense Grid",
      glyphIds: ["glyph-001", "glyph-002"],
      targetLocation: { x: 200, y: 150, name: "Alpha Nexus" },
      status: "active",
      startTime: "2025-01-21T09:00:00Z",
      estimatedDuration: 3600,
      progress: 75,
      networkEffect: 94,
    },
    {
      id: "deploy-002",
      name: "Temporal Stabilization Array",
      glyphIds: ["glyph-003", "glyph-004"],
      targetLocation: { x: 300, y: 300, name: "Gamma Anchor" },
      status: "deploying",
      startTime: "2025-01-21T10:30:00Z",
      estimatedDuration: 1800,
      progress: 45,
      networkEffect: 67,
    },
  ])

  const [selectedGlyph, setSelectedGlyph] = useState<Glyph | null>(null)
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [newGlyph, setNewGlyph] = useState({
    name: "",
    type: "protection" as Glyph["type"],
    symbol: "",
    powerLevel: 50,
    range: 500,
    duration: 3600,
  })
  const [deploymentMode, setDeploymentMode] = useState(false)
  const [selectedGlyphsForDeployment, setSelectedGlyphsForDeployment] = useState<string[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
    )
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.1)")
    gradient.addColorStop(1, "rgba(139, 92, 246, 0.05)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"
    ctx.lineWidth = 1
    const gridSize = 50
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw glyph connections
    drawGlyphConnections(ctx)

    // Draw glyphs
    glyphs.forEach((glyph) => drawGlyph(ctx, glyph))

    // Draw deployment areas
    deployments.forEach((deployment) => drawDeploymentArea(ctx, deployment))
  }, [glyphs, deployments, selectedGlyph])

  const drawGlyph = (ctx: CanvasRenderingContext2D, glyph: Glyph) => {
    const { x, y } = glyph.coordinates
    const isSelected = selectedGlyph?.id === glyph.id
    const isSelectedForDeployment = selectedGlyphsForDeployment.includes(glyph.id)

    // Draw effect radius
    ctx.strokeStyle = getGlyphColor(glyph.type, 0.3)
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(x, y, glyph.properties.effectRadius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw glyph base
    const baseRadius = isSelected ? 25 : 20
    ctx.fillStyle = getGlyphColor(glyph.type, glyph.status === "active" ? 0.8 : 0.4)
    ctx.beginPath()
    ctx.arc(x, y, baseRadius, 0, Math.PI * 2)
    ctx.fill()

    // Draw selection ring
    if (isSelected || isSelectedForDeployment) {
      ctx.strokeStyle = isSelectedForDeployment ? "rgba(16, 185, 129, 0.8)" : "rgba(139, 92, 246, 0.8)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, baseRadius + 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw glyph symbol
    ctx.fillStyle = "white"
    ctx.font = "20px serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(glyph.symbol, x, y)

    // Draw power level indicator
    if (glyph.status === "active") {
      const pulseRadius = baseRadius + 10 + Math.sin(Date.now() * 0.005) * 5
      ctx.strokeStyle = getGlyphColor(glyph.type, 0.6)
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw status indicator
    const statusColor = getStatusColor(glyph.status)
    ctx.fillStyle = statusColor
    ctx.beginPath()
    ctx.arc(x + 15, y - 15, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  const drawGlyphConnections = (ctx: CanvasRenderingContext2D) => {
    const activeGlyphs = glyphs.filter((g) => g.status === "active")

    for (let i = 0; i < activeGlyphs.length; i++) {
      for (let j = i + 1; j < activeGlyphs.length; j++) {
        const glyph1 = activeGlyphs[i]
        const glyph2 = activeGlyphs[j]
        const distance = Math.sqrt(
          Math.pow(glyph1.coordinates.x - glyph2.coordinates.x, 2) +
            Math.pow(glyph1.coordinates.y - glyph2.coordinates.y, 2),
        )

        if (distance < 300) {
          const opacity = 1 - distance / 300
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.5})`
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(glyph1.coordinates.x, glyph1.coordinates.y)
          ctx.lineTo(glyph2.coordinates.x, glyph2.coordinates.y)
          ctx.stroke()
        }
      }
    }
  }

  const drawDeploymentArea = (ctx: CanvasRenderingContext2D, deployment: Deployment) => {
    const { x, y } = deployment.targetLocation
    const radius = 60

    // Draw deployment zone
    ctx.strokeStyle = deployment.status === "active" ? "rgba(16, 185, 129, 0.6)" : "rgba(234, 88, 12, 0.6)"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw progress arc
    if (deployment.status === "deploying") {
      const progressAngle = (deployment.progress / 100) * Math.PI * 2
      ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.arc(x, y, radius + 10, -Math.PI / 2, -Math.PI / 2 + progressAngle)
      ctx.stroke()
    }

    // Draw deployment name
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(deployment.targetLocation.name, x, y + radius + 20)
  }

  const getGlyphColor = (type: Glyph["type"], alpha = 1) => {
    const colors = {
      protection: `rgba(139, 92, 246, ${alpha})`,
      amplification: `rgba(16, 185, 129, ${alpha})`,
      binding: `rgba(234, 88, 12, ${alpha})`,
      detection: `rgba(245, 158, 11, ${alpha})`,
      temporal: `rgba(236, 72, 153, ${alpha})`,
    }
    return colors[type]
  }

  const getStatusColor = (status: Glyph["status"]) => {
    switch (status) {
      case "active":
        return "rgba(16, 185, 129, 1)"
      case "charging":
        return "rgba(234, 88, 12, 1)"
      case "dormant":
        return "rgba(107, 114, 128, 1)"
      case "depleted":
        return "rgba(239, 68, 68, 1)"
      default:
        return "rgba(107, 114, 128, 1)"
    }
  }

  const getTypeIcon = (type: Glyph["type"]) => {
    switch (type) {
      case "protection":
        return <Shield className="h-4 w-4" />
      case "amplification":
        return <Zap className="h-4 w-4" />
      case "binding":
        return <Target className="h-4 w-4" />
      case "detection":
        return <Eye className="h-4 w-4" />
      case "temporal":
        return <Clock className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if clicked on a glyph
    const clickedGlyph = glyphs.find((glyph) => {
      const distance = Math.sqrt(Math.pow(glyph.coordinates.x - x, 2) + Math.pow(glyph.coordinates.y - y, 2))
      return distance <= 25
    })

    if (clickedGlyph) {
      if (deploymentMode) {
        setSelectedGlyphsForDeployment((prev) =>
          prev.includes(clickedGlyph.id) ? prev.filter((id) => id !== clickedGlyph.id) : [...prev, clickedGlyph.id],
        )
      } else {
        setSelectedGlyph(clickedGlyph)
      }
    } else {
      setSelectedGlyph(null)
    }
  }

  const handleCreateGlyph = () => {
    const newGlyphData: Glyph = {
      id: `glyph-${String(glyphs.length + 1).padStart(3, "0")}`,
      name: newGlyph.name,
      symbol: newGlyph.symbol || "◯",
      type: newGlyph.type,
      powerLevel: newGlyph.powerLevel,
      stability: Math.random() * 20 + 80,
      range: newGlyph.range,
      duration: newGlyph.duration,
      createdAt: new Date().toISOString(),
      status: "dormant",
      coordinates: { x: Math.random() * 400 + 100, y: Math.random() * 200 + 100 },
      properties: {
        resonanceFreq: Math.random() * 300 + 400,
        harmonicPattern: Array.from({ length: 5 }, () => Math.random()),
        energyConsumption: Math.random() * 30 + 20,
        effectRadius: newGlyph.range / 5,
      },
    }

    setGlyphs([...glyphs, newGlyphData])
    setNewGlyph({ name: "", type: "protection", symbol: "", powerLevel: 50, range: 500, duration: 3600 })
  }

  const handleActivateGlyph = (glyphId: string) => {
    setGlyphs(
      glyphs.map((glyph) =>
        glyph.id === glyphId ? { ...glyph, status: "active" as const, lastActivated: new Date().toISOString() } : glyph,
      ),
    )
  }

  const handleDeactivateGlyph = (glyphId: string) => {
    setGlyphs(glyphs.map((glyph) => (glyph.id === glyphId ? { ...glyph, status: "dormant" as const } : glyph)))
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-secondary" />
            Glyph Deployment Interface
          </CardTitle>
          <CardDescription>Deploy and manage mystical glyphs across the resonance network</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="network" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="network">Network View</TabsTrigger>
              <TabsTrigger value="glyphs">Glyph Library</TabsTrigger>
              <TabsTrigger value="deployments">Deployments</TabsTrigger>
              <TabsTrigger value="create">Create Glyph</TabsTrigger>
            </TabsList>

            <TabsContent value="network" className="space-y-6">
              {/* Network Visualization */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-secondary" />
                      Glyph Network Visualization
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeploymentMode(!deploymentMode)}
                        className={deploymentMode ? "bg-secondary text-white" : ""}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        {deploymentMode ? "Exit Deploy" : "Deploy Mode"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={400}
                      className="w-full border border-border rounded-lg bg-card cursor-crosshair"
                      onClick={handleCanvasClick}
                    />
                    <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                      {deploymentMode ? "Deployment Mode: Click glyphs to select" : "Click glyphs to inspect"}
                    </div>
                    {deploymentMode && selectedGlyphsForDeployment.length > 0 && (
                      <div className="absolute top-2 right-2 bg-background/80 px-2 py-1 rounded text-xs">
                        Selected: {selectedGlyphsForDeployment.length} glyphs
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Glyph Details */}
              {selectedGlyph && !deploymentMode && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{selectedGlyph.symbol}</span>
                      {selectedGlyph.name}
                      <Badge
                        variant="outline"
                        className={`ml-2 ${getStatusColor(selectedGlyph.status).replace("1)", "0.8)")}`}
                      >
                        {selectedGlyph.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{selectedGlyph.type} glyph</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Power Level</div>
                        <div className="text-lg font-bold text-foreground">{selectedGlyph.powerLevel}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Stability</div>
                        <div className="text-lg font-bold text-foreground">{selectedGlyph.stability}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Range</div>
                        <div className="text-lg font-bold text-foreground">{selectedGlyph.range}m</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="text-lg font-bold text-foreground">
                          {Math.round(selectedGlyph.duration / 60)}min
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Power Level</div>
                        <Progress value={selectedGlyph.powerLevel} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Stability</div>
                        <Progress value={selectedGlyph.stability} className="h-2" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {selectedGlyph.status === "dormant" ? (
                        <Button
                          onClick={() => handleActivateGlyph(selectedGlyph.id)}
                          className="bg-chart-1 hover:bg-chart-1/80"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                      ) : (
                        <Button onClick={() => handleDeactivateGlyph(selectedGlyph.id)} variant="outline">
                          <Pause className="h-4 w-4 mr-2" />
                          Deactivate
                        </Button>
                      )}
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="glyphs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {glyphs.map((glyph) => (
                  <Card key={glyph.id} className="border-border hover:border-secondary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{glyph.symbol}</span>
                          <div>
                            <CardTitle className="text-sm font-medium">{glyph.name}</CardTitle>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              {getTypeIcon(glyph.type)}
                              {glyph.type}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${getStatusColor(glyph.status).replace("1)", "0.8)")}`}>
                          {glyph.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Power:</span>
                          <div className="font-medium">{glyph.powerLevel}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Range:</span>
                          <div className="font-medium">{glyph.range}m</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Stability</span>
                          <span className="text-foreground">{glyph.stability}%</span>
                        </div>
                        <Progress value={glyph.stability} className="h-1" />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => setSelectedGlyph(glyph)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Inspect
                        </Button>
                        {glyph.status === "dormant" ? (
                          <Button
                            size="sm"
                            onClick={() => handleActivateGlyph(glyph.id)}
                            className="bg-chart-1 hover:bg-chart-1/80"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Activate
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleDeactivateGlyph(glyph.id)}>
                            <Pause className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="deployments" className="space-y-6">
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <Card key={deployment.id} className="border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-secondary" />
                            {deployment.name}
                          </CardTitle>
                          <CardDescription>
                            Target: {deployment.targetLocation.name} • {deployment.glyphIds.length} glyphs
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            deployment.status === "active"
                              ? "bg-chart-1 text-white"
                              : deployment.status === "deploying"
                                ? "bg-chart-3 text-white"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {deployment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Progress</div>
                          <div className="text-lg font-bold text-foreground">{deployment.progress}%</div>
                          <Progress value={deployment.progress} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Network Effect</div>
                          <div className="text-lg font-bold text-foreground">{deployment.networkEffect}%</div>
                          <Progress value={deployment.networkEffect} className="h-2 mt-1" />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                          <div className="text-lg font-bold text-foreground">
                            {Math.round(deployment.estimatedDuration / 60)}min
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Glyphs:</span>
                        <div className="flex gap-1">
                          {deployment.glyphIds.map((glyphId) => {
                            const glyph = glyphs.find((g) => g.id === glyphId)
                            return glyph ? (
                              <Badge key={glyphId} variant="outline" className="text-xs">
                                {glyph.symbol} {glyph.name}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Monitor
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                        {deployment.status === "active" && (
                          <Button size="sm" variant="outline">
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-secondary" />
                    Create New Glyph
                  </CardTitle>
                  <CardDescription>Design and deploy a new mystical glyph</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="glyph-name">Glyph Name</Label>
                      <Input
                        id="glyph-name"
                        value={newGlyph.name}
                        onChange={(e) => setNewGlyph({ ...newGlyph, name: e.target.value })}
                        placeholder="Enter glyph name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="glyph-symbol">Symbol</Label>
                      <Input
                        id="glyph-symbol"
                        value={newGlyph.symbol}
                        onChange={(e) => setNewGlyph({ ...newGlyph, symbol: e.target.value })}
                        placeholder="◯ ◈ ⚡ ⧖ ◉"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="glyph-type">Glyph Type</Label>
                    <select
                      id="glyph-type"
                      value={newGlyph.type}
                      onChange={(e) => setNewGlyph({ ...newGlyph, type: e.target.value as Glyph["type"] })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="protection">Protection</option>
                      <option value="amplification">Amplification</option>
                      <option value="binding">Binding</option>
                      <option value="detection">Detection</option>
                      <option value="temporal">Temporal</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Power Level: {newGlyph.powerLevel}%</Label>
                      <Slider
                        value={[newGlyph.powerLevel]}
                        onValueChange={(value) => setNewGlyph({ ...newGlyph, powerLevel: value[0] })}
                        max={100}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <Label>Range: {newGlyph.range}m</Label>
                      <Slider
                        value={[newGlyph.range]}
                        onValueChange={(value) => setNewGlyph({ ...newGlyph, range: value[0] })}
                        min={100}
                        max={1000}
                        className="w-full mt-2"
                      />
                    </div>
                    <div>
                      <Label>Duration: {Math.round(newGlyph.duration / 60)}min</Label>
                      <Slider
                        value={[newGlyph.duration]}
                        onValueChange={(value) => setNewGlyph({ ...newGlyph, duration: value[0] })}
                        min={300}
                        max={7200}
                        step={300}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>

                  <Button onClick={handleCreateGlyph} disabled={!newGlyph.name} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Glyph
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Glyphs</CardTitle>
            <Zap className="h-4 w-4 text-chart-1 resonance-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {glyphs.filter((g) => g.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">of {glyphs.length} total glyphs</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Coverage</CardTitle>
            <Target className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round((glyphs.filter((g) => g.status === "active").length / glyphs.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Area protected</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{deployments.length}</div>
            <p className="text-xs text-muted-foreground">Active operations</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Power</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(glyphs.reduce((acc, g) => acc + g.powerLevel, 0) / glyphs.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Network strength</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
