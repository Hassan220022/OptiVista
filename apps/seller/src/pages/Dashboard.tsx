import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, DollarSign, TrendingUp, Loader2, Eye } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { formatCurrency } from "@/lib/utils"
import { useSellerStats } from "@/hooks/useSupabaseData"

function getStatusColor(status: string) {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800"
    case "paid": return "bg-blue-100 text-blue-800"
    case "shipped": return "bg-purple-100 text-purple-800"
    case "delivered": return "bg-green-100 text-green-800"
    case "cancelled": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export function Dashboard() {
  const { storeName, isLoading: authLoading } = useAuth()
  const { data: stats, isLoading } = useSellerStats()

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Dashboard" description={`Welcome to ${storeName ?? "your store"}`} />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description={`Welcome back! Here's how ${storeName ?? "your store"} is performing.`}
      />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue ?? 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Paid, shipped, and delivered orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats?.pendingOrders ?? 0} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats?.activeProducts ?? 0} active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Store Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Not tracked yet</div>
              <p className="text-xs text-muted-foreground mt-1">No views table in Supabase schema</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <a href="/orders" className="text-sm font-normal text-primary hover:underline">View all</a>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentOrders.length ? stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.order_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.seller_total, order.currency)}</p>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No seller orders yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <a href="/products" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Manage Products</p>
                  <p className="text-sm text-muted-foreground">Review live listings and inventory</p>
                </div>
              </a>
              <a href="/orders" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Process Orders</p>
                  <p className="text-sm text-muted-foreground">{stats?.pendingOrders ?? 0} orders need attention</p>
                </div>
              </a>
              <a href="/analytics" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">View Analytics</p>
                  <p className="text-sm text-muted-foreground">See real store performance</p>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
