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
import { Search, Eye, UserCheck, Users as UsersIcon, ShieldCheck } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  phone: string | null
  role: "shopper" | "admin"
  ordersCount: number
  totalSpent: number
  createdAt: string
  lastActive: string | null
}

const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    fullName: "John Doe",
    avatarUrl: null,
    phone: "+1 234 567 8901",
    role: "shopper",
    ordersCount: 5,
    totalSpent: 1249.95,
    createdAt: "2023-06-15T10:30:00",
    lastActive: "2024-01-20T14:30:00",
  },
  {
    id: "2",
    email: "jane@example.com",
    fullName: "Jane Smith",
    avatarUrl: null,
    phone: "+1 234 567 8902",
    role: "shopper",
    ordersCount: 12,
    totalSpent: 3567.88,
    createdAt: "2023-03-22T09:15:00",
    lastActive: "2024-01-19T16:45:00",
  },
  {
    id: "3",
    email: "admin@optivista.com",
    fullName: "Admin User",
    avatarUrl: null,
    phone: null,
    role: "admin",
    ordersCount: 0,
    totalSpent: 0,
    createdAt: "2023-01-01T00:00:00",
    lastActive: "2024-01-20T18:00:00",
  },
  {
    id: "4",
    email: "mike@example.com",
    fullName: "Mike Johnson",
    avatarUrl: null,
    phone: "+1 234 567 8903",
    role: "shopper",
    ordersCount: 3,
    totalSpent: 879.97,
    createdAt: "2023-09-10T14:20:00",
    lastActive: "2024-01-18T11:30:00",
  },
  {
    id: "5",
    email: "sarah@example.com",
    fullName: "Sarah Wilson",
    avatarUrl: null,
    phone: "+1 234 567 8904",
    role: "shopper",
    ordersCount: 8,
    totalSpent: 2156.92,
    createdAt: "2023-07-28T16:45:00",
    lastActive: "2024-01-17T09:15:00",
  },
  {
    id: "6",
    email: "chris@example.com",
    fullName: null,
    avatarUrl: null,
    phone: null,
    role: "shopper",
    ordersCount: 0,
    totalSpent: 0,
    createdAt: "2024-01-15T08:00:00",
    lastActive: null,
  },
]

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0].toUpperCase()
}

export function Users() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const userStats = {
    total: mockUsers.length,
    shoppers: mockUsers.filter((u) => u.role === "shopper").length,
    admins: mockUsers.filter((u) => u.role === "admin").length,
    activeToday: mockUsers.filter((u) => {
      if (!u.lastActive) return false
      const today = new Date()
      const lastActive = new Date(u.lastActive)
      return lastActive.toDateString() === today.toDateString()
    }).length,
  }

  return (
    <div className="flex flex-col">
      <Header title="Users" description="Manage user accounts and profiles" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Users</span>
              </div>
              <p className="text-2xl font-bold mt-1">{userStats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Shoppers</span>
              </div>
              <p className="text-2xl font-bold mt-1">{userStats.shoppers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Admins</span>
              </div>
              <p className="text-2xl font-bold mt-1">{userStats.admins}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Active Today</span>
              </div>
              <p className="text-2xl font-bold mt-1">{userStats.activeToday}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Roles</option>
            <option value="shopper">Shoppers</option>
            <option value="admin">Admins</option>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {getInitials(user.fullName, user.email)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.fullName || "No name"}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.ordersCount}</TableCell>
                  <TableCell>
                    {user.totalSpent > 0 ? `$${user.totalSpent.toFixed(2)}` : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastActive ? formatDateTime(user.lastActive) : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {mockUsers.length} users
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
