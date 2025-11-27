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
import { Search, Eye, MessageSquare, Bug, HelpCircle, Lightbulb, CheckCircle } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface FeedbackItem {
  id: string
  userId: string | null
  userName: string | null
  userEmail: string
  type: "bug" | "feature" | "support" | "general"
  subject: string
  message: string
  status: "new" | "in_progress" | "resolved" | "closed"
  createdAt: string
}

const mockFeedback: FeedbackItem[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    type: "bug",
    subject: "AR try-on not loading on iPhone",
    message: "When I try to use the AR feature on my iPhone 12, the camera opens but the glasses don't appear on screen.",
    status: "in_progress",
    createdAt: "2024-01-19T10:30:00",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    type: "feature",
    subject: "Add wishlist sharing feature",
    message: "It would be great if I could share my wishlist with friends and family for gift ideas.",
    status: "new",
    createdAt: "2024-01-18T15:45:00",
  },
  {
    id: "3",
    userId: null,
    userName: null,
    userEmail: "guest@example.com",
    type: "support",
    subject: "How to return my order?",
    message: "I received the wrong size glasses. How can I initiate a return?",
    status: "resolved",
    createdAt: "2024-01-17T09:15:00",
  },
  {
    id: "4",
    userId: "user4",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    type: "general",
    subject: "Great app experience!",
    message: "Just wanted to say that I love the app! The AR feature helped me find the perfect frames.",
    status: "closed",
    createdAt: "2024-01-16T14:20:00",
  },
  {
    id: "5",
    userId: "user5",
    userName: "Chris Brown",
    userEmail: "chris@example.com",
    type: "bug",
    subject: "Payment failed but order went through",
    message: "I received an error during payment but I got charged and received an order confirmation. Please check.",
    status: "new",
    createdAt: "2024-01-15T11:30:00",
  },
]

const typeConfig = {
  bug: { label: "Bug Report", icon: Bug, color: "bg-red-100 text-red-800" },
  feature: { label: "Feature Request", icon: Lightbulb, color: "bg-purple-100 text-purple-800" },
  support: { label: "Support", icon: HelpCircle, color: "bg-blue-100 text-blue-800" },
  general: { label: "General", icon: MessageSquare, color: "bg-gray-100 text-gray-800" },
}

const statusConfig = {
  new: { label: "New", variant: "default" as const },
  in_progress: { label: "In Progress", variant: "warning" as const },
  resolved: { label: "Resolved", variant: "success" as const },
  closed: { label: "Closed", variant: "secondary" as const },
}

export function Feedback() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredFeedback = mockFeedback.filter((item) => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const feedbackStats = {
    total: mockFeedback.length,
    new: mockFeedback.filter((f) => f.status === "new").length,
    inProgress: mockFeedback.filter((f) => f.status === "in_progress").length,
    resolved: mockFeedback.filter((f) => f.status === "resolved").length,
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
              {filteredFeedback.map((item) => {
                const type = typeConfig[item.type]
                const TypeIcon = type.icon
                const status = statusConfig[item.status]

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
                        <p className="text-sm font-medium">{item.userName || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">{item.userEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(item.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFeedback.length} of {mockFeedback.length} items
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
