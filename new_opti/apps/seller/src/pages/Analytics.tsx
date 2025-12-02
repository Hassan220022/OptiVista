import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Eye,
  Users,
  Package,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Mock data
const mockStats = {
  revenue: { value: 12450.00, change: 12.5, trend: "up" },
  orders: { value: 156, change: 8.2, trend: "up" },
  views: { value: 3420, change: -2.1, trend: "down" },
  conversion: { value: 4.5, change: 0.5, trend: "up" },
}

const mockTopProducts = [
  { name: "Classic Aviator", sales: 45, revenue: 6750.00 },
  { name: "Cat Eye Glamour", sales: 38, revenue: 6840.00 },
  { name: "Round Vintage", sales: 32, revenue: 4160.00 },
  { name: "Sport Shield", sales: 28, revenue: 5600.00 },
]

const mockRecentActivity = [
  { type: "order", message: "New order #ORD-2024-156", time: "2 minutes ago" },
  { type: "review", message: "New 5-star review on Classic Aviator", time: "15 minutes ago" },
  { type: "view", message: "Your store reached 100 views today", time: "1 hour ago" },
  { type: "order", message: "Order #ORD-2024-155 delivered", time: "3 hours ago" },
]

function StatCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  format = "number" 
}: { 
  title: string
  value: number
  change: number
  trend: "up" | "down"
  icon: typeof DollarSign
  format?: "number" | "currency" | "percent"
}) {
  const formattedValue = 
    format === "currency" ? formatCurrency(value) :
    format === "percent" ? `${value}%` :
    value.toLocaleString()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        <div className={`flex items-center text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {change > 0 ? "+" : ""}{change}% from last month
        </div>
      </CardContent>
    </Card>
  )
}

export function Analytics() {
  return (
    <div className="flex flex-col">
      <Header title="Analytics" description="Track your store performance" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Revenue"
            value={mockStats.revenue.value}
            change={mockStats.revenue.change}
            trend={mockStats.revenue.trend as "up" | "down"}
            icon={DollarSign}
            format="currency"
          />
          <StatCard
            title="Orders"
            value={mockStats.orders.value}
            change={mockStats.orders.change}
            trend={mockStats.orders.trend as "up" | "down"}
            icon={ShoppingCart}
          />
          <StatCard
            title="Store Views"
            value={mockStats.views.value}
            change={mockStats.views.change}
            trend={mockStats.views.trend as "up" | "down"}
            icon={Eye}
          />
          <StatCard
            title="Conversion Rate"
            value={mockStats.conversion.value}
            change={mockStats.conversion.change}
            trend={mockStats.conversion.trend as "up" | "down"}
            icon={Users}
            format="percent"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.type === "order" ? "bg-green-100" :
                      activity.type === "review" ? "bg-yellow-100" :
                      "bg-blue-100"
                    }`}>
                      {activity.type === "order" ? <ShoppingCart className="h-4 w-4 text-green-600" /> :
                       activity.type === "review" ? <Package className="h-4 w-4 text-yellow-600" /> :
                       <Eye className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Detailed charts and graphs coming soon</p>
              <p className="text-sm mt-2">Track trends, compare periods, and analyze growth</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
