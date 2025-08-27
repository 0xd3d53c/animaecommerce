import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/products/product-card"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { ProductFilters } from "@/components/products/product-filters"

interface SearchParams {
  [key: string]: string | string[] | undefined
  category?: string
  page?: string
  min_price?: string
  max_price?: string
  rating?: string
}

const PRODUCTS_PER_PAGE = 30

// The getProducts function itself is fine, the issue is how it's called.
async function getProducts(searchParams: SearchParams) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page as string || "1", 10)
  const rangeFrom = (page - 1) * PRODUCTS_PER_PAGE
  const rangeTo = rangeFrom + PRODUCTS_PER_PAGE - 1

  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories!inner(name, slug),
      reviews(rating),
      product_media(storage_path, alt_text, is_primary)
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .range(rangeFrom, rangeTo)

  if (searchParams.category) {
    query = query.eq("categories.slug", searchParams.category as string)
  }
  if (searchParams.min_price) {
    query = query.gte("price", parseFloat(searchParams.min_price as string))
  }
  if (searchParams.max_price) {
    query = query.lte("price", parseFloat(searchParams.max_price as string))
  }
  if (searchParams.rating) {
    query = query.gte("reviews.rating", parseInt(searchParams.rating as string, 10))
  }

  const { data: products, count } = await query

  return { products: products || [], count: count || 0 }
}

async function getCategories() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("name, slug").eq("is_active", true);
  return categories || [];
}


export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  // THE FIX: Create a new, "clean" object from searchParams.
  // This new object is not tracked by Next.js, avoiding the error.
  const cleanParams = {
    page: searchParams.page,
    category: searchParams.category,
    min_price: searchParams.min_price,
    max_price: searchParams.max_price,
    rating: searchParams.rating,
  };

  const { products, count } = await getProducts(cleanParams) // Pass the clean object
  const categories = await getCategories()
  
  // Use the properties from the clean object for all synchronous logic.
  const currentPage = parseInt(cleanParams.page as string || "1", 10)
  const totalPages = Math.ceil(count / PRODUCTS_PER_PAGE)

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>)
    params.set("page", pageNumber.toString())
    return `/products?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4 capitalize">
            {/* Use the clean object's property for rendering */}
            {cleanParams.category ? `${(cleanParams.category as string).replace("-", " ")} Products` : "All Products"}
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProductFilters categories={categories} />
          </aside>
          <main className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
                <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious href={createPageURL(currentPage - 1)} />
                      </PaginationItem>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={createPageURL(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext href={createPageURL(currentPage + 1)} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}