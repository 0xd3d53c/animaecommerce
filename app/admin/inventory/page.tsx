import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Package, TrendingDown, TrendingUp, Search, Filter } from "lucide-react"

async function getInventoryData() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      title,
      sku,
      stock_quantity,
      price,
      status,
      categories(name),
      created_at
    `)
    .order("stock_quantity", { ascending: true })

  // Calculate inventory metrics
  const totalProducts = products?.length || 0
  const lowStockProducts = products?.filter((p) => p.stock_quantity < 5).length || 0
  const outOfStockProducts = products?.filter((p) => p.stock_quantity === 0).length || 0
  const totalInventoryValue = products?.reduce((sum, p) => sum + p.stock_quantity * p.price, 0) || 0

  return {
    products: products || [],
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    totalInventoryValue,
  }
}

export default async function InventoryPage() {
  await requireAdmin()
  const inventory = await getInventoryData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor stock levels and manage inventory</p>
        </div>
        <Button>
          <Package className="mr-2 h-4 w-4" />
          Bulk Update Stock
        </Button>
      </div>

      {/* Inventory Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{inventory.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventory.lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Products below 5 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventory.outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Products with 0 stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{inventory.totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total stock value</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Inventory</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                  <TableCell>{product.categories?.name || "Uncategorized"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          product.stock_quantity === 0
                            ? "text-red-600"
                            : product.stock_quantity < 5
                              ? "text-yellow-600"
                              : "text-green-600"
                        }
                      >
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity === 0 && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>₹{product.price.toLocaleString()}</TableCell>
                  <TableCell>₹{(product.stock_quantity * product.price).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.stock_quantity === 0
                          ? "destructive"
                          : product.stock_quantity < 5
                            ? "secondary"
                            : "default"
                      }
                    >
                      {product.stock_quantity === 0
                        ? "Out of Stock"
                        : product.stock_quantity < 5
                          ? "Low Stock"
                          : "In Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Update Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
