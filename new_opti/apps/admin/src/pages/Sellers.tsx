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
import {
  Search,
  Eye,
  Store,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  UserPlus,
  MoreHorizontal,
} from "lucide-react"
import { formatDateTime, formatCurrency } from "@/lib/utils"

// Mock data - replace with real API
const mockSellers = [
  { 
    id: "1", 
    store_name: "Premium Eyewear Co", 
    email: "contact@premiumeyewear.com", 
    status: "approved", 
    products: 45, 
    orders: 234, 
    revenue: 24500.00,
    created_at: "2024-01-01T10:00:00Z" 
  },
  { 
    id: "2", 
    store_name: "Vision Plus", 
    email: "hello@visionplus.com", 
    status: "approved", 
    products: 32, 
    orders: 156, 
    revenue: 18200.00,
    created_at: "2024-01-05T10:00:00Z" 
  },
  { 
    id: "3", 
    store_name: "Stylish Frames", 
    email: "info@stylishframes.com", 
    status: "pending", 
    products: 0, 
    orders: 0, 
    revenue: 0,
    created_at: "2024-01-14T10:00:00Z" 
  },
  { 
    id: "4", 
    store_name: "Optical Express", 
    email: "sales@opticalexpress.com", 
    status: "rejected", 
    products: 0, 
    orders: 0, 
    revenue: 0,
    created_at: "2024-01-10T10:00:00Z" 
  },
]

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" }> = {
  approved: { label: "Approved", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  rejected: { label: "Rejected", variant: "destructive" },
}

export function Sellers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading] = useState(false)

  const filteredSellers = mockSellers.filter((seller) => {
    const matchesSearch =
      seller.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || seller.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Sellers" description="Manage seller accounts" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const sellerStats = {
    total: mockSellers.length,
    approved: mockSellers.filter(s => s.status === "approved").length,
    pending: mockSellers.filter(s => s.status === "pending").length,
    totalRevenue: mockSellers.reduce((sum, s) => sum + s.revenue, 0),
  }

  return (
    <div className="flex flex-col">
      <Header title="Sellers" description="Manage seller accounts and approvals" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Sellers</span>
              </div>
              <p className="text-2xl font-bold mt-1">{sellerStats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Approved</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-green-600">{sellerStats.approved}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">Pending Approval</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-yellow-600">{sellerStats.pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
              </div>
              <p className="text-2xl font-bold mt-1">{formatCurrency(sellerStats.totalRevenue)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Seller
          </Button>
        </div>

        {/* Sellers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No sellers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSellers.map((seller) => {
                  const status = statusConfig[seller.status]
                  return (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{seller.store_name}</p>
                            <p className="text-sm text-muted-foreground">{seller.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{seller.products}</TableCell>
                      <TableCell>{seller.orders}</TableCell>
                      <TableCell>{formatCurrency(seller.revenue)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(seller.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {seller.status === "pending" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Approve"
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                title="Reject"
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
