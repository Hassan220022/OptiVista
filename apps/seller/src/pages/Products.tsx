import { useState } from "react"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Package, Loader2, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useSellerProducts, useUpdateSellerProduct } from "@/hooks/useSupabaseData"

export function Products() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: products = [], isLoading } = useSellerProducts()
  const updateProduct = useUpdateSellerProduct()

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brand ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Header title="Products" description="Manage your product listings" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const activeCount = products.filter((product) => product.is_active).length
  const outOfStockCount = products.filter((product) => product.stock_quantity <= 0).length

  return (
    <div className="flex flex-col">
      <Header title="Products" description="Manage your product listings" />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Total Products</span></div><p className="text-2xl font-bold mt-1">{products.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /><span className="text-sm text-muted-foreground">Active</span></div><p className="text-2xl font-bold mt-1">{activeCount}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /><span className="text-sm text-muted-foreground">Out of Stock</span></div><p className="text-2xl font-bold mt-1">{outOfStockCount}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Eye className="h-4 w-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Total Views</span></div><p className="text-lg font-bold mt-1">Not tracked yet</p></CardContent></Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
          </div>
          <Button disabled title="Product creation requires catalog form support">
            <Edit className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No products found</TableCell></TableRow>
              ) : filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {product.thumbnail_url ? <img src={product.thumbnail_url} alt="" className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                      </div>
                      <div><span className="font-medium">{product.name}</span><p className="text-xs text-muted-foreground">{product.brand ?? "No brand"}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{product.slug}</TableCell>
                  <TableCell>{formatCurrency(product.price, product.currency)}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell><Badge variant={product.is_active ? "success" : "secondary"}>{product.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>Not tracked</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={updateProduct.isPending}
                      onClick={() => updateProduct.mutate({ id: product.id, updates: { is_active: !product.is_active } })}
                    >
                      {product.is_active ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
                      {product.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
