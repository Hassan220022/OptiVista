import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, Eye, Loader2, Star } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/utils"
import { useSellerStats } from "@/hooks/useSupabaseData"

function StatCard({ title, value, note, icon: Icon }: { title: string; value: string; note: string; icon: typeof DollarSign }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{note}</p>
      </CardContent>
    </Card>
  )
}

export function Analytics() {
  const { data: stats, isLoading } = useSellerStats()

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Analytics" description="Track your store performance" />
        <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Analytics" description="Track your store performance" />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Revenue" value={formatCurrency(stats?.totalRevenue ?? 0)} note="From paid, shipped, delivered orders" icon={DollarSign} />
          <StatCard title="Orders" value={(stats?.totalOrders ?? 0).toLocaleString()} note={`${stats?.pendingOrders ?? 0} pending`} icon={ShoppingCart} />
          <StatCard title="Store Views" value="Not tracked yet" note="No views table in Supabase schema" icon={Eye} />
          <StatCard title="Average Rating" value={(stats?.averageRating ?? 0).toFixed(1)} note={`${stats?.totalReviews ?? 0} reviews`} icon={Star} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Top Products</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topProducts.length ? stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">{index + 1}</div>
                      <div><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">{product.sold} sold</p></div>
                    </div>
                    <p className="font-medium">{formatCurrency(product.revenue, product.currency)}</p>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No product sales yet.</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentOrders.length ? stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"><ShoppingCart className="h-4 w-4 text-green-600" /></div>
                    <div>
                      <p className="text-sm font-medium">Order {order.order_number} is {order.status}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">No recent order activity.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Performance Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <div className="rounded-lg border p-4"><p className="text-muted-foreground">Active Products</p><p className="text-2xl font-bold">{stats?.activeProducts ?? 0}</p></div>
              <div className="rounded-lg border p-4"><p className="text-muted-foreground">Pending Revenue</p><p className="text-2xl font-bold">{formatCurrency(stats?.pendingRevenue ?? 0)}</p></div>
              <div className="rounded-lg border p-4"><p className="text-muted-foreground">Conversion Rate</p><p className="text-2xl font-bold">Not tracked yet</p><p className="text-xs text-muted-foreground mt-1">Requires view/session analytics</p></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
