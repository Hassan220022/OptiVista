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
import { useAdminSellers, useUpdateSellerApproval, type SellerStatus } from "@/hooks/useAdminApi"

const statusConfig: Record<
  SellerStatus,
  { label: string; variant: "default" | "success" | "warning" | "destructive" }
> = {
  approved: { label: "Approved", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  rejected: { label: "Rejected", variant: "destructive" },
}

export function Sellers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { data: sellers = [], isLoading, error } = useAdminSellers()
  const updateSellerApproval = useUpdateSellerApproval()

  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch =
      seller.store_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.identifier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || seller.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = async (id: string) => {
    await updateSellerApproval.mutateAsync({ sellerId: id, action: "approve" })
  }

  const handleReject = async (id: string) => {
    await updateSellerApproval.mutateAsync({ sellerId: id, action: "reject" })
  }

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

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Sellers" description="Manage seller accounts" />
        <div className="p-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">Error loading sellers: {error.message}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const sellerStats = {
    total: sellers.length,
    approved: sellers.filter((s) => s.status === "approved").length,
    pending: sellers.filter((s) => s.status === "pending").length,
    rejected: sellers.filter((s) => s.status === "rejected").length,
    totalRevenue: sellers.reduce((sum, s) => sum + s.revenue, 0),
  }

  return (
    <div className="flex flex-col">
      <Header title="Sellers" description="Manage seller accounts and approvals" />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
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
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">Rejected</span>
              </div>
              <p className="text-2xl font-bold mt-1 text-red-600">{sellerStats.rejected}</p>
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
          <Button disabled title="Seller invitations are not implemented yet">
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
                            <p className="font-medium">{seller.store_name || "Unnamed store"}</p>
                            <p className="text-sm text-muted-foreground">{seller.identifier}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>{seller.products_count}</TableCell>
                      <TableCell>{seller.orders_count}</TableCell>
                      <TableCell>{formatCurrency(seller.revenue)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(seller.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="Seller detail view is not implemented yet" disabled>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {seller.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Approve"
                                className="text-green-600"
                                onClick={() => handleApprove(seller.id)}
                                disabled={updateSellerApproval.isPending}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Reject"
                                className="text-red-600"
                                onClick={() => handleReject(seller.id)}
                                disabled={updateSellerApproval.isPending}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" title="More actions are not implemented yet" disabled>
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
