import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Settings,
  LogOut,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Payouts", href: "/payouts", icon: Wallet },
  { name: "Store Settings", href: "/settings", icon: Settings },
]

function getInitials(name: string | null | undefined): string {
  if (!name) return "SE"
  return name.slice(0, 2).toUpperCase()
}

export function Sidebar() {
  const { user, signOut, storeName } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Store className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold">Seller Portal</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {getInitials(storeName)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{storeName ?? "My Store"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ?? "seller@optivista.com"}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}
