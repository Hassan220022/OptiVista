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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Product {
  id: string
  name: string
  brand: string
  sku: string
  price: number
  stock: number
  status: "active" | "inactive" | "draft"
  category: string
  hasAR: boolean
  imageUrl: string
  createdAt: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Ray-Ban Aviator Classic",
    brand: "Ray-Ban",
    sku: "RB3025-001",
    price: 159.99,
    stock: 45,
    status: "active",
    category: "Sunglasses",
    hasAR: true,
    imageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=RB",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Oakley Holbrook XL",
    brand: "Oakley",
    sku: "OO9417-01",
    price: 189.99,
    stock: 32,
    status: "active",
    category: "Sunglasses",
    hasAR: true,
    imageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=OK",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    name: "Gucci GG0061S",
    brand: "Gucci",
    sku: "GG0061S-001",
    price: 349.99,
    stock: 12,
    status: "active",
    category: "Sunglasses",
    hasAR: false,
    imageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=GC",
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Tom Ford FT5178",
    brand: "Tom Ford",
    sku: "TF5178-001",
    price: 279.99,
    stock: 8,
    status: "active",
    category: "Eyeglasses",
    hasAR: true,
    imageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=TF",
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    name: "Persol PO3092V",
    brand: "Persol",
    sku: "PO3092V-9015",
    price: 229.99,
    stock: 0,
    status: "inactive",
    category: "Eyeglasses",
    hasAR: false,
    imageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=PS",
    createdAt: "2024-01-05",
  },
  {
    id: "6",
    name: "Prada PR 17WS",
    brand: "Prada",
    sku: "PR17WS-1AB5S0",
    price: 419.99,
    stock: 15,
    status: "draft",
    category: "Sunglasses",
    hasAR: false,
    imageUrl: "https://placehold.co/80x80/e2e8f0/475569?text=PR",
    createdAt: "2024-01-02",
  },
]

function getStatusVariant(status: string) {
  switch (status) {
    case "active":
      return "success"
    case "inactive":
      return "destructive"
    case "draft":
      return "secondary"
    default:
      return "outline"
  }
}

function getStockStatus(stock: number) {
  if (stock === 0) return { label: "Out of stock", class: "text-red-600" }
  if (stock < 10) return { label: "Low stock", class: "text-yellow-600" }
  return { label: "In stock", class: "text-green-600" }
}

export function Products() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col">
      <Header title="Products" description="Manage your product catalog" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Products</span>
              </div>
              <p className="text-2xl font-bold mt-1">{mockProducts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {mockProducts.filter((p) => p.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="text-sm text-muted-foreground">Low Stock</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {mockProducts.filter((p) => p.stock > 0 && p.stock < 10).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">Out of Stock</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {mockProducts.filter((p) => p.stock === 0).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          <Button onClick={() => console.log("Add product")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Products Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AR</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.stock}</p>
                        <p className={`text-xs ${stockStatus.class}`}>{stockStatus.label}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(product.status) as "default" | "secondary" | "destructive" | "outline" | "success" | "warning"}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.hasAR ? (
                        <Badge variant="default" className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                          AR Ready
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
            Showing {filteredProducts.length} of {mockProducts.length} products
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
