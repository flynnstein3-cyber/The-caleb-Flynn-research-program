"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Archive,
  Shield,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Search,
  Eye,
  Key,
  Database,
} from "lucide-react"

interface ProofCapsule {
  id: string
  name: string
  type: "resonance_data" | "ley_line_mapping" | "artifact_scan" | "temporal_reading" | "mythic_event"
  status: "sealed" | "verified" | "corrupted" | "pending"
  createdAt: string
  lastVerified: string
  dataSize: number
  integrityHash: string
  encryptionLevel: "basic" | "advanced" | "quantum"
  accessLevel: "public" | "restricted" | "classified"
  verificationScore: number
  metadata: {
    location?: string
    resonanceLevel?: number
    temporalStamp?: string
    contributor?: string
  }
}

interface VerificationLog {
  id: string
  capsuleId: string
  timestamp: string
  result: "passed" | "failed" | "warning"
  details: string
  verifier: string
}

export function ArchiveProofCapsules() {
  const [capsules, setCapsules] = useState<ProofCapsule[]>([
    {
      id: "cap-001",
      name: "Alpha Nexus Resonance Pattern",
      type: "resonance_data",
      status: "verified",
      createdAt: "2025-01-20T14:30:00Z",
      lastVerified: "2025-01-21T09:15:00Z",
      dataSize: 2.4,
      integrityHash: "sha256:a1b2c3d4e5f6...",
      encryptionLevel: "advanced",
      accessLevel: "restricted",
      verificationScore: 98.7,
      metadata: {
        location: "40.7128, -74.0060",
        resonanceLevel: 87,
        temporalStamp: "2025-01-20T14:30:00Z",
        contributor: "Node Alpha",
      },
    },
    {
      id: "cap-002",
      name: "Dragon's Spine Ley Line Survey",
      type: "ley_line_mapping",
      status: "sealed",
      createdAt: "2025-01-21T08:45:00Z",
      lastVerified: "2025-01-21T10:20:00Z",
      dataSize: 5.7,
      integrityHash: "sha256:f6e5d4c3b2a1...",
      encryptionLevel: "quantum",
      accessLevel: "classified",
      verificationScore: 99.2,
      metadata: {
        location: "Multiple coordinates",
        contributor: "Cartography System",
      },
    },
    {
      id: "cap-003",
      name: "Ancient Portal Artifact Reading",
      type: "artifact_scan",
      status: "pending",
      createdAt: "2025-01-21T11:00:00Z",
      lastVerified: "2025-01-21T11:00:00Z",
      dataSize: 1.8,
      integrityHash: "sha256:b2c3d4e5f6a1...",
      encryptionLevel: "basic",
      accessLevel: "public",
      verificationScore: 0,
      metadata: {
        location: "34.0522, -118.2437",
        resonanceLevel: 92,
        contributor: "Artifact Scanner",
      },
    },
    {
      id: "cap-004",
      name: "Temporal Anomaly Detection",
      type: "temporal_reading",
      status: "corrupted",
      createdAt: "2025-01-19T16:20:00Z",
      lastVerified: "2025-01-21T07:30:00Z",
      dataSize: 3.2,
      integrityHash: "sha256:corrupted_hash",
      encryptionLevel: "advanced",
      accessLevel: "restricted",
      verificationScore: 23.4,
      metadata: {
        temporalStamp: "2025-01-19T16:20:00Z",
        contributor: "Temporal Monitor",
      },
    },
  ])

  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([
    {
      id: "log-001",
      capsuleId: "cap-001",
      timestamp: "2025-01-21T09:15:00Z",
      result: "passed",
      details: "Integrity verification successful. All checksums match.",
      verifier: "Auto-Validator",
    },
    {
      id: "log-002",
      capsuleId: "cap-002",
      timestamp: "2025-01-21T10:20:00Z",
      result: "passed",
      details: "Quantum encryption verified. Data sealed successfully.",
      verifier: "Quantum Validator",
    },
    {
      id: "log-003",
      capsuleId: "cap-004",
      timestamp: "2025-01-21T07:30:00Z",
      result: "failed",
      details: "Hash mismatch detected. Possible data corruption.",
      verifier: "Integrity Checker",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedCapsule, setSelectedCapsule] = useState<ProofCapsule | null>(null)
  const [newCapsule, setNewCapsule] = useState({
    name: "",
    type: "resonance_data" as ProofCapsule["type"],
    data: "",
    accessLevel: "public" as ProofCapsule["accessLevel"],
  })

  const filteredCapsules = capsules.filter((capsule) => {
    const matchesSearch = capsule.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || capsule.status === filterStatus
    const matchesType = filterType === "all" || capsule.type === filterType
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: ProofCapsule["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-chart-1" />
      case "sealed":
        return <Lock className="h-4 w-4 text-secondary" />
      case "pending":
        return <Clock className="h-4 w-4 text-chart-3" />
      case "corrupted":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      default:
        return <Archive className="h-4 w-4 text-muted" />
    }
  }

  const getStatusColor = (status: ProofCapsule["status"]) => {
    switch (status) {
      case "verified":
        return "bg-chart-1 text-white"
      case "sealed":
        return "bg-secondary text-white"
      case "pending":
        return "bg-chart-3 text-white"
      case "corrupted":
        return "bg-destructive text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getEncryptionIcon = (level: ProofCapsule["encryptionLevel"]) => {
    switch (level) {
      case "quantum":
        return <Shield className="h-4 w-4 text-secondary" />
      case "advanced":
        return <Lock className="h-4 w-4 text-chart-1" />
      case "basic":
        return <Key className="h-4 w-4 text-chart-3" />
      default:
        return <Unlock className="h-4 w-4 text-muted" />
    }
  }

  const handleCreateCapsule = () => {
    const newId = `cap-${String(capsules.length + 1).padStart(3, "0")}`
    const capsule: ProofCapsule = {
      id: newId,
      name: newCapsule.name,
      type: newCapsule.type,
      status: "pending",
      createdAt: new Date().toISOString(),
      lastVerified: new Date().toISOString(),
      dataSize: Math.random() * 5 + 0.5,
      integrityHash: `sha256:${Math.random().toString(36).substring(2, 15)}...`,
      encryptionLevel: "advanced",
      accessLevel: newCapsule.accessLevel,
      verificationScore: 0,
      metadata: {
        contributor: "Manual Entry",
      },
    }

    setCapsules([...capsules, capsule])
    setNewCapsule({ name: "", type: "resonance_data", data: "", accessLevel: "public" })
  }

  const handleVerifyCapsule = (capsuleId: string) => {
    setCapsules(
      capsules.map((capsule) =>
        capsule.id === capsuleId
          ? {
              ...capsule,
              status: "verified" as const,
              lastVerified: new Date().toISOString(),
              verificationScore: Math.random() * 20 + 80,
            }
          : capsule,
      ),
    )

    const newLog: VerificationLog = {
      id: `log-${verificationLogs.length + 1}`,
      capsuleId,
      timestamp: new Date().toISOString(),
      result: "passed",
      details: "Manual verification completed successfully.",
      verifier: "User",
    }

    setVerificationLogs([newLog, ...verificationLogs])
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5 text-secondary" />
            Archive Proof Capsules
          </CardTitle>
          <CardDescription>Secure storage and verification of mystical data with cryptographic proof</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="capsules" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="capsules">Capsules</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="create">Create New</TabsTrigger>
            </TabsList>

            <TabsContent value="capsules" className="space-y-6">
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search capsules..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="sealed">Sealed</option>
                    <option value="pending">Pending</option>
                    <option value="corrupted">Corrupted</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="all">All Types</option>
                    <option value="resonance_data">Resonance Data</option>
                    <option value="ley_line_mapping">Ley Line Mapping</option>
                    <option value="artifact_scan">Artifact Scan</option>
                    <option value="temporal_reading">Temporal Reading</option>
                    <option value="mythic_event">Mythic Event</option>
                  </select>
                </div>
              </div>

              {/* Capsules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCapsules.map((capsule) => (
                  <Card key={capsule.id} className="border-border hover:border-secondary/50 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(capsule.status)}
                          <CardTitle className="text-sm font-medium truncate">{capsule.name}</CardTitle>
                        </div>
                        {getEncryptionIcon(capsule.encryptionLevel)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusColor(capsule.status)}>
                          {capsule.status}
                        </Badge>
                        <Badge variant="outline">{capsule.type.replace("_", " ")}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Size:</span>
                          <div className="font-medium">{capsule.dataSize.toFixed(1)} MB</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Score:</span>
                          <div className="font-medium">{capsule.verificationScore.toFixed(1)}%</div>
                        </div>
                      </div>

                      {capsule.verificationScore > 0 && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Integrity</span>
                            <span className="text-foreground">{capsule.verificationScore.toFixed(1)}%</span>
                          </div>
                          <Progress value={capsule.verificationScore} className="h-1" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => setSelectedCapsule(capsule)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getStatusIcon(capsule.status)}
                                {capsule.name}
                              </DialogTitle>
                              <DialogDescription>Capsule ID: {capsule.id}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Status</Label>
                                  <div className="mt-1">
                                    <Badge className={getStatusColor(capsule.status)}>{capsule.status}</Badge>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Type</Label>
                                  <div className="mt-1 text-sm">{capsule.type.replace("_", " ")}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Created</Label>
                                  <div className="mt-1 text-sm">{new Date(capsule.createdAt).toLocaleString()}</div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Last Verified</Label>
                                  <div className="mt-1 text-sm">{new Date(capsule.lastVerified).toLocaleString()}</div>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Integrity Hash</Label>
                                <div className="mt-1 text-xs font-mono bg-muted p-2 rounded">
                                  {capsule.integrityHash}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyCapsule(capsule.id)}
                                  disabled={capsule.status === "verified"}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Verify
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Export
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {capsule.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyCapsule(capsule.id)}
                            className="bg-chart-1 hover:bg-chart-1/80"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verify
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="verification" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-secondary" />
                    Verification Logs
                  </CardTitle>
                  <CardDescription>History of all capsule verification attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationLogs.map((log) => {
                      const capsule = capsules.find((c) => c.id === log.capsuleId)
                      return (
                        <div
                          key={log.id}
                          className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card"
                        >
                          <div className="flex-shrink-0">
                            {log.result === "passed" ? (
                              <CheckCircle className="h-5 w-5 text-chart-1" />
                            ) : log.result === "warning" ? (
                              <AlertTriangle className="h-5 w-5 text-chart-3" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{capsule?.name || "Unknown Capsule"}</span>
                              <Badge
                                variant="outline"
                                className={
                                  log.result === "passed"
                                    ? "bg-chart-1 text-white"
                                    : log.result === "warning"
                                      ? "bg-chart-3 text-white"
                                      : "bg-destructive text-white"
                                }
                              >
                                {log.result}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Verifier: {log.verifier}</span>
                              <span>Time: {new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-secondary" />
                    Create New Proof Capsule
                  </CardTitle>
                  <CardDescription>Securely store and verify new mystical data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="capsule-name">Capsule Name</Label>
                      <Input
                        id="capsule-name"
                        value={newCapsule.name}
                        onChange={(e) => setNewCapsule({ ...newCapsule, name: e.target.value })}
                        placeholder="Enter capsule name..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="capsule-type">Data Type</Label>
                      <select
                        id="capsule-type"
                        value={newCapsule.type}
                        onChange={(e) => setNewCapsule({ ...newCapsule, type: e.target.value as ProofCapsule["type"] })}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="resonance_data">Resonance Data</option>
                        <option value="ley_line_mapping">Ley Line Mapping</option>
                        <option value="artifact_scan">Artifact Scan</option>
                        <option value="temporal_reading">Temporal Reading</option>
                        <option value="mythic_event">Mythic Event</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="capsule-data">Data Content</Label>
                    <Textarea
                      id="capsule-data"
                      value={newCapsule.data}
                      onChange={(e) => setNewCapsule({ ...newCapsule, data: e.target.value })}
                      placeholder="Enter the mystical data to be archived..."
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="access-level">Access Level</Label>
                    <select
                      id="access-level"
                      value={newCapsule.accessLevel}
                      onChange={(e) =>
                        setNewCapsule({ ...newCapsule, accessLevel: e.target.value as ProofCapsule["accessLevel"] })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="public">Public</option>
                      <option value="restricted">Restricted</option>
                      <option value="classified">Classified</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleCreateCapsule}
                    disabled={!newCapsule.name || !newCapsule.data}
                    className="w-full"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Create Proof Capsule
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
            <CardTitle className="text-sm font-medium">Total Capsules</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{capsules.length}</div>
            <p className="text-xs text-muted-foreground">Archived data capsules</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {capsules.filter((c) => c.status === "verified").length}
            </div>
            <p className="text-xs text-muted-foreground">Integrity confirmed</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {capsules.reduce((acc, c) => acc + c.dataSize, 0).toFixed(1)} MB
            </div>
            <p className="text-xs text-muted-foreground">Total data archived</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Integrity</CardTitle>
            <Shield className="h-4 w-4 text-secondary resonance-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(
                capsules.filter((c) => c.verificationScore > 0).reduce((acc, c) => acc + c.verificationScore, 0) /
                capsules.filter((c) => c.verificationScore > 0).length
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Verification score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
