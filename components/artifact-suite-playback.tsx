"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  AudioWaveform as Waveform,
  Activity,
  Zap,
  Eye,
  BarChart3,
  Settings,
  Download,
} from "lucide-react"

interface Artifact {
  id: string
  name: string
  type: "crystal" | "rune" | "talisman" | "orb" | "scroll"
  discoveredAt: string
  location: string
  resonancePattern: number[]
  harmonicFrequency: number
  powerLevel: number
  stability: number
  lastAnalyzed: string
  metadata: {
    origin?: string
    age?: string
    material?: string
    inscriptions?: string
  }
}

interface PlaybackSession {
  id: string
  artifactId: string
  startTime: string
  duration: number
  analysisType: "resonance" | "harmonic" | "temporal" | "spectral"
  status: "recording" | "completed" | "analyzing"
}

export function ArtifactSuitePlayback() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [artifacts, setArtifacts] = useState<Artifact[]>([
    {
      id: "art-001",
      name: "Resonance Crystal Alpha",
      type: "crystal",
      discoveredAt: "2025-01-15T10:30:00Z",
      location: "Alpha Nexus",
      resonancePattern: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.1) * 50 + Math.random() * 20),
      harmonicFrequency: 432.5,
      powerLevel: 87,
      stability: 94,
      lastAnalyzed: "2025-01-21T09:15:00Z",
      metadata: {
        origin: "Ancient Temple",
        age: "~2000 years",
        material: "Crystalline Matrix",
        inscriptions: "Runic symbols detected",
      },
    },
    {
      id: "art-002",
      name: "Temporal Rune Stone",
      type: "rune",
      discoveredAt: "2025-01-18T14:20:00Z",
      location: "Beta Convergence",
      resonancePattern: Array.from({ length: 100 }, (_, i) => Math.cos(i * 0.15) * 40 + Math.sin(i * 0.05) * 30),
      harmonicFrequency: 528.0,
      powerLevel: 92,
      stability: 78,
      lastAnalyzed: "2025-01-21T08:45:00Z",
      metadata: {
        origin: "Nordic Settlement",
        age: "~1500 years",
        material: "Enchanted Stone",
        inscriptions: "Elder Futhark",
      },
    },
    {
      id: "art-003",
      name: "Mystic Orb of Echoes",
      type: "orb",
      discoveredAt: "2025-01-20T16:45:00Z",
      location: "Gamma Anchor",
      resonancePattern: Array.from({ length: 100 }, (_, i) => Math.sin(i * 0.08) * 60 + Math.cos(i * 0.12) * 25),
      harmonicFrequency: 396.0,
      powerLevel: 76,
      stability: 89,
      lastAnalyzed: "2025-01-21T07:30:00Z",
      metadata: {
        origin: "Celestial Observatory",
        age: "~800 years",
        material: "Ethereal Glass",
        inscriptions: "Astronomical markings",
      },
    },
  ])

  const [selectedArtifact, setSelectedArtifact] = useState<Artifact>(artifacts[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [volume, setVolume] = useState([75])
  const [analysisMode, setAnalysisMode] = useState<"resonance" | "harmonic" | "temporal" | "spectral">("resonance")
  const [showWaveform, setShowWaveform] = useState(true)
  const [showSpectrum, setShowSpectrum] = useState(false)

  const [playbackSessions, setPlaybackSessions] = useState<PlaybackSession[]>([
    {
      id: "session-001",
      artifactId: "art-001",
      startTime: "2025-01-21T09:15:00Z",
      duration: 120,
      analysisType: "resonance",
      status: "completed",
    },
    {
      id: "session-002",
      artifactId: "art-002",
      startTime: "2025-01-21T08:45:00Z",
      duration: 95,
      analysisType: "harmonic",
      status: "completed",
    },
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + playbackSpeed[0]
          return newTime >= selectedArtifact.resonancePattern.length ? 0 : newTime
        })
      }, 50)
    }
    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, selectedArtifact.resonancePattern.length])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "rgba(139, 92, 246, 0.1)")
    gradient.addColorStop(1, "rgba(139, 92, 246, 0.05)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"
    ctx.lineWidth = 1
    const gridSpacing = 40
    for (let x = 0; x <= canvas.width; x += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += gridSpacing) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    if (showWaveform) {
      drawWaveform(ctx, canvas.width, canvas.height)
    }

    if (showSpectrum) {
      drawSpectrum(ctx, canvas.width, canvas.height)
    }

    // Draw playback cursor
    const cursorX = (currentTime / selectedArtifact.resonancePattern.length) * canvas.width
    ctx.strokeStyle = "rgba(16, 185, 129, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cursorX, 0)
    ctx.lineTo(cursorX, canvas.height)
    ctx.stroke()
  }, [selectedArtifact, currentTime, showWaveform, showSpectrum, analysisMode])

  const drawWaveform = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const pattern = selectedArtifact.resonancePattern
    const centerY = height / 2
    const amplitude = height * 0.3

    ctx.strokeStyle = "rgba(139, 92, 246, 0.8)"
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i < pattern.length; i++) {
      const x = (i / pattern.length) * width
      const y = centerY + (pattern[i] / 100) * amplitude

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw harmonic overlay
    if (analysisMode === "harmonic") {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.6)"
      ctx.lineWidth = 1
      ctx.beginPath()

      for (let i = 0; i < pattern.length; i++) {
        const x = (i / pattern.length) * width
        const harmonic = Math.sin((i * selectedArtifact.harmonicFrequency) / 100) * amplitude * 0.5
        const y = centerY + harmonic

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }
  }

  const drawSpectrum = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const barCount = 32
    const barWidth = width / barCount
    const maxHeight = height * 0.8

    for (let i = 0; i < barCount; i++) {
      const frequency = (i / barCount) * 1000
      const amplitude = Math.sin((frequency + currentTime) * 0.01) * 0.5 + 0.5
      const barHeight = amplitude * maxHeight

      const hue = (i / barCount) * 60 + 240 // Purple to blue spectrum
      ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.7)`
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const getArtifactIcon = (type: Artifact["type"]) => {
    switch (type) {
      case "crystal":
        return "💎"
      case "rune":
        return "🗿"
      case "talisman":
        return "🔮"
      case "orb":
        return "⚪"
      case "scroll":
        return "📜"
      default:
        return "❓"
    }
  }

  const getStatusColor = (status: PlaybackSession["status"]) => {
    switch (status) {
      case "completed":
        return "bg-chart-1 text-white"
      case "recording":
        return "bg-chart-3 text-white"
      case "analyzing":
        return "bg-secondary text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-secondary" />
            Artifact Suite Playback
          </CardTitle>
          <CardDescription>Analyze and replay artifact resonance patterns with advanced visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="playback" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="playback">Playback</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            <TabsContent value="playback" className="space-y-6">
              {/* Artifact Selection */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Selected Artifact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{getArtifactIcon(selectedArtifact.type)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{selectedArtifact.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedArtifact.type} • {selectedArtifact.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Power Level</div>
                      <div className="text-lg font-bold text-foreground">{selectedArtifact.powerLevel}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <div className="font-medium">{selectedArtifact.harmonicFrequency} Hz</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stability:</span>
                      <div className="font-medium">{selectedArtifact.stability}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Analyzed:</span>
                      <div className="font-medium">{new Date(selectedArtifact.lastAnalyzed).toLocaleDateString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visualization Canvas */}
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Waveform className="h-5 w-5 text-secondary" />
                      Resonance Visualization
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowWaveform(!showWaveform)}
                        className={showWaveform ? "bg-secondary text-white" : ""}
                      >
                        <Activity className="h-4 w-4 mr-1" />
                        Waveform
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSpectrum(!showSpectrum)}
                        className={showSpectrum ? "bg-secondary text-white" : ""}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Spectrum
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={300}
                      className="w-full border border-border rounded-lg bg-card"
                    />
                    <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                      Mode: {analysisMode} | Time: {currentTime.toFixed(1)}s
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Playback Controls */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Playback Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Transport Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <Button size="sm" variant="outline" onClick={() => setCurrentTime(0)}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="lg" onClick={handlePlayPause} className="bg-secondary hover:bg-secondary/80">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleStop}>
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentTime(selectedArtifact.resonancePattern.length - 1)}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{currentTime.toFixed(1)}s</span>
                      <span>{selectedArtifact.resonancePattern.length.toFixed(1)}s</span>
                    </div>
                    <Slider
                      value={[currentTime]}
                      onValueChange={handleSeek}
                      max={selectedArtifact.resonancePattern.length - 1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  {/* Control Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Playback Speed</label>
                      <Slider
                        value={playbackSpeed}
                        onValueChange={setPlaybackSpeed}
                        min={0.1}
                        max={3}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="text-xs text-muted-foreground mt-1">{playbackSpeed[0].toFixed(1)}x</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Volume</label>
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-muted-foreground" />
                        <Slider value={volume} onValueChange={setVolume} max={100} className="flex-1" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{volume[0]}%</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Analysis Mode</label>
                      <select
                        value={analysisMode}
                        onChange={(e) => setAnalysisMode(e.target.value as typeof analysisMode)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="resonance">Resonance</option>
                        <option value="harmonic">Harmonic</option>
                        <option value="temporal">Temporal</option>
                        <option value="spectral">Spectral</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-secondary" />
                      Resonance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Peak Amplitude</span>
                        <span className="text-foreground font-medium">
                          {Math.max(...selectedArtifact.resonancePattern).toFixed(1)}
                        </span>
                      </div>
                      <Progress value={Math.max(...selectedArtifact.resonancePattern)} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Stability Index</span>
                        <span className="text-foreground font-medium">{selectedArtifact.stability}%</span>
                      </div>
                      <Progress value={selectedArtifact.stability} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Harmonic Coherence</span>
                        <span className="text-foreground font-medium">87.3%</span>
                      </div>
                      <Progress value={87.3} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-secondary" />
                      Power Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{selectedArtifact.powerLevel}%</div>
                        <div className="text-sm text-muted-foreground">Current Power</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{selectedArtifact.harmonicFrequency}</div>
                        <div className="text-sm text-muted-foreground">Base Frequency (Hz)</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="text-sm text-muted-foreground mb-2">Energy Distribution</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Resonance Core</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Harmonic Field</span>
                          <span>32%</span>
                        </div>
                        <Progress value={32} className="h-1" />
                        <div className="flex justify-between text-xs">
                          <span>Temporal Echo</span>
                          <span>23%</span>
                        </div>
                        <Progress value={23} className="h-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="artifacts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artifacts.map((artifact) => (
                  <Card
                    key={artifact.id}
                    className={`border-border cursor-pointer transition-colors ${
                      selectedArtifact.id === artifact.id
                        ? "border-secondary bg-secondary/5"
                        : "hover:border-secondary/50"
                    }`}
                    onClick={() => setSelectedArtifact(artifact)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="text-2xl">{getArtifactIcon(artifact.type)}</div>
                          <div>
                            <CardTitle className="text-sm font-medium">{artifact.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{artifact.location}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{artifact.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Power:</span>
                          <div className="font-medium">{artifact.powerLevel}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stability:</span>
                          <div className="font-medium">{artifact.stability}%</div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Resonance</span>
                          <span className="text-foreground">{artifact.powerLevel}%</span>
                        </div>
                        <Progress value={artifact.powerLevel} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-secondary" />
                    Playback Sessions
                  </CardTitle>
                  <CardDescription>History of artifact analysis sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {playbackSessions.map((session) => {
                      const artifact = artifacts.find((a) => a.id === session.artifactId)
                      return (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg bg-card"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{artifact ? getArtifactIcon(artifact.type) : "❓"}</div>
                            <div>
                              <div className="font-medium text-foreground">{artifact?.name || "Unknown Artifact"}</div>
                              <div className="text-sm text-muted-foreground">
                                {session.analysisType} analysis • {session.duration}s duration
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(session.startTime).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-3 w-3 mr-1" />
                                Export
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
