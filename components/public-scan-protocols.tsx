"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Scan,
  Radar,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  Square,
  Settings,
  Download,
  Activity,
  Clock,
} from "lucide-react"

interface ScanResult {
  id: string
  timestamp: string
  location: { x: number; y: number; name: string }
  type: "anomaly" | "artifact" | "resonance" | "temporal" | "energy"
  intensity: number
  confidence: number
  status: "detected" | "confirmed" | "investigating" | "resolved"
  description: string
  metadata: {
    frequency?: number
    duration?: number
    pattern?: string
    threat_level?: "low" | "medium" | "high" | "critical"
  }
}

interface ScanProtocol {
  id: string
  name: string
  type: "passive" | "active" | "deep" | "wide" | "targeted"
  status: "running" | "paused" | "stopped" | "error"
  coverage: number
  sensitivity: number
  frequency: number
  lastScan: string
  detections: number
  falsePositives: number
  accuracy: number
}

interface ScanSession {
  id: string
  protocolId: string
  startTime: string
  duration: number
  status: "active" | "completed" | "aborted"
  progress: number
  resultsCount: number
  coverage: { x: number; y: number; radius: number }
}

export function PublicScanProtocols() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scanResults, setScanResults] = useState<ScanResult[]>([
    {
      id: "scan-001",
      timestamp: "2025-01-21T10:30:00Z",
      location: { x: 200, y: 150, name: "Alpha Nexus" },
      type: "resonance",
      intensity: 87,
      confidence: 94,
      status: "confirmed",
      description: "High-intensity resonance spike detected in Alpha Nexus region",
      metadata: {
        frequency: 432.5,
        duration: 120,
        pattern: "harmonic",
        threat_level: "low",
      },
    },
    {
      id: "scan-002",
      timestamp: "2025-01-21T09:45:00Z",
      location: { x: 350, y: 200, name: "Beta Convergence" },
      type: "anomaly",
      intensity: 76,
      confidence: 82,
      status: "investigating",
      description: "Temporal distortion anomaly requiring further investigation",
      metadata: {
        frequency: 528.0,
        duration: 45,
        pattern: "irregular",
        threat_level: "medium",
      },
    },
    {
      id: "scan-003",
      timestamp: "2025-01-21T08:20:00Z",
      location: { x: 150, y: 300, name: "Gamma Anchor" },
      type: "artifact",
      intensity: 92,
      confidence: 98,
      status: "confirmed",
      description: "Ancient artifact signature detected with high confidence",
      metadata: {
        frequency: 396.0,
        duration: 300,
        pattern: "crystalline",
        threat_level: "low",
      },
    },
    {
      id: "scan-004",
      timestamp: "2025-01-21T07:15:00Z",
      location: { x: 400, y: 100, name: "Delta Outpost" },
      type: "energy",
      intensity: 64,
      confidence: 71,
      status: "detected",
      description: "Unusual energy pattern detected, awaiting confirmation",
      metadata: {
        frequency: 741.0,
        duration: 30,
        pattern: "pulsed",
        threat_level: "high",
      },
    },
  ])

  const [protocols, setProtocols] = useState<ScanProtocol[]>([
    {
      id: "protocol-001",
      name: "Resonance Monitor",
      type: "passive",
      status: "running",
      coverage: 85,
      sensitivity: 75,
      frequency: 5,
      lastScan: "2025-01-21T10:30:00Z",
      detections: 47,
      falsePositives: 3,
      accuracy: 94,
    },
    {
      id: "protocol-002",
      name: "Anomaly Detector",
      type: "active",
      status: "running",
      coverage: 60,
      sensitivity: 90,
      frequency: 15,
      lastScan: "2025-01-21T10:25:00Z",
      detections: 23,
      falsePositives: 5,
      accuracy: 78,
    },
    {
      id: "protocol-003",
      name: "Deep Scan Array",
      type: "deep",
      status: "paused",
      coverage: 40,
      sensitivity: 95,
      frequency: 60,
      lastScan: "2025-01-21T09:00:00Z",
      detections: 12,
      falsePositives: 1,
      accuracy: 92,
    },
  ])

  const [activeSessions, setActiveSessions] = useState<ScanSession[]>([
    {
      id: "session-001",
      protocolId: "protocol-001",
      startTime: "2025-01-21T10:00:00Z",
      duration: 1800,
      status: "active",
      progress: 67,
      resultsCount: 8,
      coverage: { x: 300, y: 200, radius: 150 },
    },
    {
      id: "session-002",
      protocolId: "protocol-002",
      startTime: "2025-01-21T09:30:00Z",
      duration: 900,
      status: "completed",
      progress: 100,
      resultsCount: 3,
      coverage: { x: 200, y: 150, radius: 100 },
    },
  ])

  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [scanMode, setScanMode] = useState<"realtime" | "historical">("realtime")
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh && scanMode === "realtime") {
      interval = setInterval(() => {
        // Simulate new scan results
        if (Math.random() > 0.8) {
          const newResult: ScanResult = {
            id: `scan-${Date.now()}`,
            timestamp: new Date().toISOString(),
            location: {
              x: Math.random() * 400 + 100,
              y: Math.random() * 200 + 100,
              name: `Location ${Math.floor(Math.random() * 100)}`,
            },
            type: ["anomaly", "artifact", "resonance", "temporal", "energy"][
              Math.floor(Math.random() * 5)
            ] as ScanResult["type"],
            intensity: Math.random() * 100,
            confidence: Math.random() * 40 + 60,
            status: "detected",
            description: "Real-time detection from automated scan",
            metadata: {
              frequency: Math.random() * 500 + 300,
              duration: Math.random() * 300 + 30,
              pattern: ["harmonic", "irregular", "crystalline", "pulsed"][Math.floor(Math.random() * 4)],
              threat_level: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
            },
          }
          setScanResults((prev) => [newResult, ...prev.slice(0, 19)]) // Keep last 20 results
        }
      }, 5000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh, scanMode])

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
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.1)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0.05)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw scan grid
    drawScanGrid(ctx, canvas.width, canvas.height)

    // Draw active scan sessions
    activeSessions.forEach((session) => drawScanSession(ctx, session))

    // Draw scan results
    scanResults.forEach((result) => drawScanResult(ctx, result))

    // Draw radar sweep if in realtime mode
    if (scanMode === "realtime") {
      drawRadarSweep(ctx, canvas.width, canvas.height)
    }
  }, [scanResults, activeSessions, scanMode, selectedResult])

  const drawScanGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = "rgba(16, 185, 129, 0.2)"
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

    // Draw range circles
    const centerX = width / 2
    const centerY = height / 2
    const ranges = [100, 200, 300]

    ranges.forEach((range) => {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(centerX, centerY, range, 0, Math.PI * 2)
      ctx.stroke()
    })
    ctx.setLineDash([])
  }

  const drawScanSession = (ctx: CanvasRenderingContext2D, session: ScanSession) => {
    const { x, y, radius } = session.coverage

    // Draw coverage area
    ctx.strokeStyle = session.status === "active" ? "rgba(16, 185, 129, 0.6)" : "rgba(107, 114, 128, 0.4)"
    ctx.lineWidth = 2
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw progress arc
    if (session.status === "active") {
      const progressAngle = (session.progress / 100) * Math.PI * 2
      ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.arc(x, y, radius + 10, -Math.PI / 2, -Math.PI / 2 + progressAngle)
      ctx.stroke()
    }
  }

  const drawScanResult = (ctx: CanvasRenderingContext2D, result: ScanResult) => {
    const { x, y } = result.location
    const isSelected = selectedResult?.id === result.id

    // Get color based on type and threat level
    const color = getScanResultColor(result.type, result.metadata.threat_level)
    const size = isSelected ? 12 : 8

    // Draw detection marker
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()

    // Draw confidence ring
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, size + (result.confidence / 100) * 10, 0, Math.PI * 2)
    ctx.stroke()

    // Draw intensity pulse
    if (result.intensity > 80) {
      const pulseRadius = size + 15 + Math.sin(Date.now() * 0.01) * 5
      ctx.strokeStyle = color.replace("1)", "0.5)")
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw selection indicator
    if (isSelected) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(x, y, size + 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw type indicator
    ctx.fillStyle = "white"
    ctx.font = "10px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(result.type.charAt(0).toUpperCase(), x, y)
  }

  const drawRadarSweep = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20
    const angle = (Date.now() * 0.002) % (Math.PI * 2)

    // Draw sweep line
    ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
    ctx.stroke()

    // Draw sweep gradient
    const gradient = ctx.createConicGradient(angle, centerX, centerY)
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)")
    gradient.addColorStop(0.1, "rgba(16, 185, 129, 0.1)")
    gradient.addColorStop(0.2, "rgba(16, 185, 129, 0)")
    gradient.addColorStop(1, "rgba(16, 185, 129, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.arc(centerX, centerY, radius, angle, angle + Math.PI * 0.3)
    ctx.closePath()
    ctx.fill()
  }

  const getScanResultColor = (type: ScanResult["type"], threatLevel?: string) => {
    const baseColors = {
      anomaly: "rgba(234, 88, 12, 1)",
      artifact: "rgba(139, 92, 246, 1)",
      resonance: "rgba(16, 185, 129, 1)",
      temporal: "rgba(236, 72, 153, 1)",
      energy: "rgba(245, 158, 11, 1)",
    }

    let color = baseColors[type]

    // Modify intensity based on threat level
    if (threatLevel === "critical") {
      color = "rgba(239, 68, 68, 1)"
    } else if (threatLevel === "high") {
      color = color.replace("1)", "0.9)")
    }

    return color
  }

  const getStatusIcon = (status: ScanResult["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "investigating":
        return <Search className="h-4 w-4 text-chart-3" />
      case "detected":
        return <Eye className="h-4 w-4 text-secondary" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-muted" />
      default:
        return <AlertTriangle className="h-4 w-4 text-muted" />
    }
  }

  const getThreatLevelColor = (level?: string) => {
    switch (level) {
      case "critical":
        return "bg-destructive text-white"
      case "high":
        return "bg-chart-3 text-white"
      case "medium":
        return "bg-secondary text-white"
      case "low":
        return "bg-chart-1 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Check if clicked on a scan result
    const clickedResult = scanResults.find((result) => {
      const distance = Math.sqrt(Math.pow(result.location.x - x, 2) + Math.pow(result.location.y - y, 2))
      return distance <= 15
    })

    setSelectedResult(clickedResult || null)
  }

  const handleStartProtocol = (protocolId: string) => {
    setProtocols(
      protocols.map((protocol) =>
        protocol.id === protocolId ? { ...protocol, status: "running" as const } : protocol,
      ),
    )
  }

  const handleStopProtocol = (protocolId: string) => {
    setProtocols(
      protocols.map((protocol) =>
        protocol.id === protocolId ? { ...protocol, status: "stopped" as const } : protocol,
      ),
    )
  }

  const filteredResults = scanResults.filter((result) => {
    const matchesType = filterType === "all" || result.type === filterType
    const matchesStatus = filterStatus === "all" || result.status === filterStatus
    const matchesSearch =
      result.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.location.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5 text-secondary" />
            Public Scan Protocols
          </CardTitle>
          <CardDescription>Real-time scanning and detection of mystical phenomena across the network</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="realtime" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="realtime">Real-time Scan</TabsTrigger>
              <TabsTrigger value="results">Scan Results</TabsTrigger>
              <TabsTrigger value="protocols">Protocols</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="space-y-6">
              {/* Real-time Scan Visualization */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Radar className="h-5 w-5 text-secondary" />
                      Live Scan Display
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={autoRefresh ? "bg-chart-1 text-white" : ""}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        {autoRefresh ? "Live" : "Paused"}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
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
                      Mode: {scanMode} | Results: {scanResults.length}
                    </div>
                    {autoRefresh && (
                      <div className="absolute top-2 right-2 bg-chart-1/80 px-2 py-1 rounded text-xs text-white">
                        SCANNING
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Result Details */}
              {selectedResult && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(selectedResult.status)}
                      Detection Details
                      <Badge variant="outline" className={getThreatLevelColor(selectedResult.metadata.threat_level)}>
                        {selectedResult.metadata.threat_level}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {selectedResult.type} detected at {selectedResult.location.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Intensity</div>
                        <div className="text-lg font-bold text-foreground">{selectedResult.intensity.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="text-lg font-bold text-foreground">{selectedResult.confidence.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Frequency</div>
                        <div className="text-lg font-bold text-foreground">
                          {selectedResult.metadata.frequency?.toFixed(1)} Hz
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="text-lg font-bold text-foreground">{selectedResult.metadata.duration}s</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Description</div>
                      <p className="text-foreground">{selectedResult.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Intensity</div>
                        <Progress value={selectedResult.intensity} className="h-2" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Confidence</div>
                        <Progress value={selectedResult.confidence} className="h-2" />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-chart-1 hover:bg-chart-1/80">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm
                      </Button>
                      <Button size="sm" variant="outline">
                        <Search className="h-4 w-4 mr-2" />
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search results..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Types</option>
                    <option value="anomaly">Anomaly</option>
                    <option value="artifact">Artifact</option>
                    <option value="resonance">Resonance</option>
                    <option value="temporal">Temporal</option>
                    <option value="energy">Energy</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Status</option>
                    <option value="detected">Detected</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="investigating">Investigating</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {filteredResults.map((result) => (
                  <Card
                    key={result.id}
                    className={`border-border cursor-pointer transition-colors ${
                      selectedResult?.id === result.id ? "border-secondary bg-secondary/5" : "hover:border-secondary/50"
                    }`}
                    onClick={() => setSelectedResult(result)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <CardTitle className="text-sm font-medium">{result.type} Detection</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              {result.location.name} • {new Date(result.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getThreatLevelColor(result.metadata.threat_level)}>
                            {result.metadata.threat_level}
                          </Badge>
                          <Badge variant="outline">{result.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Intensity:</span>
                          <div className="font-medium">{result.intensity.toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <div className="font-medium">{result.confidence.toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pattern:</span>
                          <div className="font-medium">{result.metadata.pattern}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Intensity</span>
                            <span className="text-foreground">{result.intensity.toFixed(1)}%</span>
                          </div>
                          <Progress value={result.intensity} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="text-foreground">{result.confidence.toFixed(1)}%</span>
                          </div>
                          <Progress value={result.confidence} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="protocols" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {protocols.map((protocol) => (
                  <Card key={protocol.id} className="border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm font-medium">{protocol.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{protocol.type} scan protocol</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            protocol.status === "running"
                              ? "bg-chart-1 text-white"
                              : protocol.status === "paused"
                                ? "bg-chart-3 text-white"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {protocol.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Coverage:</span>
                          <div className="font-medium">{protocol.coverage}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Accuracy:</span>
                          <div className="font-medium">{protocol.accuracy}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Detections:</span>
                          <div className="font-medium">{protocol.detections}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">False +:</span>
                          <div className="font-medium">{protocol.falsePositives}</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Sensitivity</span>
                          <span className="text-foreground">{protocol.sensitivity}%</span>
                        </div>
                        <Progress value={protocol.sensitivity} className="h-1" />
                      </div>

                      <div className="flex gap-2">
                        {protocol.status === "running" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStopProtocol(protocol.id)}
                            className="flex-1"
                          >
                            <Square className="h-3 w-3 mr-1" />
                            Stop
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStartProtocol(protocol.id)}
                            className="flex-1 bg-chart-1 hover:bg-chart-1/80"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3 mr-1" />
                          Config
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <div className="space-y-4">
                {activeSessions.map((session) => {
                  const protocol = protocols.find((p) => p.id === session.protocolId)
                  return (
                    <Card key={session.id} className="border-border">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-secondary" />
                              {protocol?.name || "Unknown Protocol"}
                            </CardTitle>
                            <CardDescription>
                              Started: {new Date(session.startTime).toLocaleString()} • Duration:{" "}
                              {Math.round(session.duration / 60)}min
                            </CardDescription>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              session.status === "active"
                                ? "bg-chart-1 text-white"
                                : session.status === "completed"
                                  ? "bg-chart-2 text-white"
                                  : "bg-destructive text-white"
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Progress</div>
                            <div className="text-lg font-bold text-foreground">{session.progress}%</div>
                            <Progress value={session.progress} className="h-2 mt-1" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Results Found</div>
                            <div className="text-lg font-bold text-foreground">{session.resultsCount}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Coverage Radius</div>
                            <div className="text-lg font-bold text-foreground">{session.coverage.radius}m</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Monitor
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                          {session.status === "active" && (
                            <Button size="sm" variant="outline">
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scans</CardTitle>
            <Radar className="h-4 w-4 text-chart-1 resonance-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {protocols.filter((p) => p.status === "running").length}
            </div>
            <p className="text-xs text-muted-foreground">of {protocols.length} protocols</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Detections</CardTitle>
            <Eye className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{scanResults.length}</div>
            <p className="text-xs text-muted-foreground">Total scan results</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {scanResults.filter((r) => r.status === "confirmed").length}
            </div>
            <p className="text-xs text-muted-foreground">Verified detections</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(scanResults.reduce((acc, r) => acc + r.confidence, 0) / scanResults.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Detection accuracy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
