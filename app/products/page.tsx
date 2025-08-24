import { createClient } from "@/lib/supabase/server"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductSearch } from "@/components/products/product-search"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

interface SearchParams {
  category?: string
  search?: string
  sort?: string
  min_price?: string
  max_price?: string
  artisan?: string
  material?: string
}

async function getProducts(searchParams: SearchParams) {
  const supabase = await createClient()
  let query = supabase
    .from("products")
    .select(`
      *,
      categories(name, slug),
      artisans(name, village, region),
      product_media(storage_path, alt_text, is_primary)
    `)
    .eq("status", "published")

  // Apply filters
  if (searchParams.category) {
    query = query.eq("categories.slug", searchParams.category)
  }

  if (searchParams.search) {
    query = query.textSearch("title", searchParams.search)
  }

  if (searchParams.min_price) {
    query = query.gte("price", Number.parseFloat(searchParams.min_price))
  }

  if (searchParams.max_price) {
    query = query.lte("price", Number.parseFloat(searchParams.max_price))
  }

  if (searchParams.artisan) {
    query = query.eq("artisans.name", searchParams.artisan)
  }

  // Apply sorting
  switch (searchParams.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  const { data: products } = await query

  return products || []
}

async function getFilterOptions() {
  const supabase = await createClient()

  const [categoriesResult, artisansResult] = await Promise.all([
    supabase.from("categories").select("name, slug").eq("is_active", true),
    supabase.from("artisans").select("name").eq("is_active", true),
  ])

  return {
    categories: categoriesResult.data || [],
    artisans: artisansResult.data || [],
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [products, filterOptions] = await Promise.all([getProducts(params), getFilterOptions()])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Our Collection</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover authentic Assamese textiles, each piece handwoven with traditional techniques and cultural
            significance.
          </p>
        </div>

        <ProductSearch />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters
              categories={filterOptions.categories}
              artisans={filterOptions.artisans}
              currentFilters={params}
            />
          </aside>

          <main className="flex-1">
            <ProductGrid products={products} />
          </main>
        </div>
      </div>

      {/* Footer */}
      <SiteFooter />
    </div>
  )
}
