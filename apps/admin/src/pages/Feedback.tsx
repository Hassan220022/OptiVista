import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Eye, MessageSquare, Bug, HelpCircle, Lightbulb, CheckCircle, Loader2 } from "lucide-react"
import { formatDateTime } from "@/lib/utils"
import { useAdminFeedback } from "@/hooks/useAdminApi"

const typeConfig: Record<string, { label: string; icon: typeof Bug; color: string }> = {
  bug: { label: "Bug Report", icon: Bug, color: "bg-red-100 text-red-800" },
  feature: { label: "Feature Request", icon: Lightbulb, color: "bg-purple-100 text-purple-800" },
  support: { label: "Support", icon: HelpCircle, color: "bg-blue-100 text-blue-800" },
  general: { label: "General", icon: MessageSquare, color: "bg-gray-100 text-gray-800" },
}

const statusConfig: Record<string, { label: string; variant: "default" | "warning" | "success" | "secondary" }> = {
  new: { label: "New", variant: "default" },
  in_progress: { label: "In Progress", variant: "warning" },
  resolved: { label: "Resolved", variant: "success" },
  closed: { label: "Closed", variant: "secondary" },
}

export function Feedback() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  const { data: feedback, isLoading, error } = useAdminFeedback()

  const filteredFeedback = (feedback ?? []).filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Feedback" description="View and manage user feedback and support requests" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Feedback" description="View and manage user feedback and support requests" />
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Error loading feedback: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const feedbackStats = {
    total: feedback?.length ?? 0,
    new: feedback?.filter((f) => f.status === "new").length ?? 0,
    inProgress: feedback?.filter((f) => f.status === "in_progress").length ?? 0,
    resolved: feedback?.filter((f) => f.status === "resolved").length ?? 0,
  }

  return (
    <div className="flex flex-col">
      <Header title="Feedback" description="View and manage user feedback and support requests" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Feedback</span>
              </div>
              <p className="text-2xl font-bold mt-1">{feedbackStats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">New</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-blue-600">{feedbackStats.new}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{feedbackStats.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Resolved</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-600">{feedbackStats.resolved}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-44"
          >
            <option value="all">All Types</option>
            <option value="bug">Bug Reports</option>
            <option value="feature">Feature Requests</option>
            <option value="support">Support</option>
            <option value="general">General</option>
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </Select>
        </div>

        {/* Feedback Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No feedback found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedback.map((item) => {
                  const type = typeConfig[item.type] ?? typeConfig.general
                  const TypeIcon = type.icon
                  const status = statusConfig[item.status] ?? statusConfig.new

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${type.color}`}>
                          <TypeIcon className="h-3 w-3" />
                          {type.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-sm">
                          <p className="font-medium">{item.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {item.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{item.profiles?.full_name || "Guest"}</p>
                          <p className="text-xs text-muted-foreground">{item.profiles?.email || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(item.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFeedback.length} of {feedbackStats.total} items
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
