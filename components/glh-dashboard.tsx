"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MythicCartography } from "@/components/mythic-cartography"
import { ArchiveProofCapsules } from "@/components/archive-proof-capsules"
import { ArtifactSuitePlayback } from "@/components/artifact-suite-playback"
import { GlyphDeployment } from "@/components/glyph-deployment"
import { PublicScanProtocols } from "@/components/public-scan-protocols"
import {
  Activity,
  Map,
  Archive,
  Play,
  Zap,
  Scan,
  CheckCircle,
  AlertTriangle,
  Compass,
  Layers,
  Radio,
  Target,
} from "lucide-react"

interface ResonanceNode {
  id: string
  name: string
  status: "operational" | "warning" | "offline"
  resonanceLevel: number
  coordinates: { lat: number; lng: number }
  lastSync: string
}

export function GLHDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [resonanceNodes, setResonanceNodes] = useState<ResonanceNode[]>([
    {
      id: "node-alpha",
      name: "Alpha Nexus",
      status: "operational",
      resonanceLevel: 87,
      coordinates: { lat: 40.7128, lng: -74.006 },
      lastSync: "2025-01-21T10:30:00Z",
    },
    {
      id: "node-beta",
      name: "Beta Convergence",
      status: "operational",
      resonanceLevel: 92,
      coordinates: { lat: 34.0522, lng: -118.2437 },
      lastSync: "2025-01-21T10:29:45Z",
    },
    {
      id: "node-gamma",
      name: "Gamma Anchor",
      status: "warning",
      resonanceLevel: 64,
      coordinates: { lat: 51.5074, lng: -0.1278 },
      lastSync: "2025-01-21T10:28:12Z",
    },
  ])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-chart-3" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <CheckCircle className="h-4 w-4 text-muted" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-chart-1"
      case "warning":
        return "bg-chart-3"
      case "offline":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">GLH Resonance Engine</h1>
            <p className="text-muted-foreground text-lg">Mythic Cartography & Ley Line Infrastructure Dashboard</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-foreground">{currentTime.toLocaleTimeString()}</div>
            <div className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground resonance-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {resonanceNodes.filter((n) => n.status === "operational").length}
            </div>
            <p className="text-xs text-muted-foreground">of {resonanceNodes.length} total nodes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resonance Level</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(resonanceNodes.reduce((acc, n) => acc + n.resonanceLevel, 0) / resonanceNodes.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all nodes</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Artifacts
            </CardTitle>
            <CardDescription>Catalogued items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-xs text-muted-foreground">Catalogued items</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Ley Lines
            </CardTitle>
            <CardDescription>Mapped connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">47</div>
            <p className="text-xs text-muted-foreground">Mapped connections</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="engine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="engine" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Engine
          </TabsTrigger>
          <TabsTrigger value="cartography" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Cartography
          </TabsTrigger>
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
          <TabsTrigger value="artifacts" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Artifacts
          </TabsTrigger>
          <TabsTrigger value="glyphs" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Glyphs
          </TabsTrigger>
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Scan
          </TabsTrigger>
          <TabsTrigger value="validation" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Validation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engine" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-secondary resonance-pulse" />
                  Resonance Nodes Status
                </CardTitle>
                <CardDescription>Real-time monitoring of all GLH nodes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {resonanceNodes.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(node.status)}
                      <div>
                        <div className="font-medium text-foreground">{node.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {node.coordinates.lat.toFixed(4)}, {node.coordinates.lng.toFixed(4)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">{node.resonanceLevel}%</div>
                      <Badge variant="outline" className={`${getStatusColor(node.status)} text-white`}>
                        {node.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Engine Performance
                </CardTitle>
                <CardDescription>Current operational metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Resonance Stability</span>
                    <span className="text-foreground font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Ley Line Coherence</span>
                    <span className="text-foreground font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Mythic Alignment</span>
                    <span className="text-foreground font-medium">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Temporal Sync</span>
                    <span className="text-foreground font-medium">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-secondary" />
                System Controls
              </CardTitle>
              <CardDescription>Core engine management and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-16 flex flex-col gap-2 bg-transparent" variant="outline">
                  <Radio className="h-6 w-6" />
                  <span className="text-sm">Calibrate Nodes</span>
                </Button>
                <Button className="h-16 flex flex-col gap-2 bg-transparent" variant="outline">
                  <Activity className="h-6 w-6" />
                  <span className="text-sm">Sync Resonance</span>
                </Button>
                <Button className="h-16 flex flex-col gap-2 bg-transparent" variant="outline">
                  <Compass className="h-6 w-6" />
                  <span className="text-sm">Align Ley Lines</span>
                </Button>
                <Button className="h-16 flex flex-col gap-2 bg-transparent" variant="outline">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-sm">Validate System</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cartography">
          <MythicCartography />
        </TabsContent>

        <TabsContent value="archives">
          <ArchiveProofCapsules />
        </TabsContent>

        <TabsContent value="artifacts">
          <ArtifactSuitePlayback />
        </TabsContent>

        <TabsContent value="glyphs">
          <GlyphDeployment />
        </TabsContent>

        <TabsContent value="scan">
          <PublicScanProtocols />
        </TabsContent>

        <TabsContent value="validation">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                Scientific Validation
              </CardTitle>
              <CardDescription>Verify and validate all system operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Validation System</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Scientific validation interface will be implemented here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
