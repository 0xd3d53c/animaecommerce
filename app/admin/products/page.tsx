import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

async function getProducts() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      artisans(name)
    `)
    .order("created_at", { ascending: false })

  return products || []
}

export default async function AdminProductsPage() {
  await requireAdmin()
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
