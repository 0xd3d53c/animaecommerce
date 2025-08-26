import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductGallery } from "@/components/products/product-gallery"
import { ProductInfo } from "@/components/products/product-info"
import { ProductReviews } from "@/components/products/product-reviews"
import { RelatedProducts } from "@/components/products/related-products"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import Link from "next/link"

async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data: product } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name, slug),
      product_media(storage_path, alt_text, media_type, sort_order, is_primary)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  return product
}

async function getProductReviews(productId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      title,
      body,
      created_at,
      helpful_count,
      profiles ( full_name, avatar_url )
    `
    )
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching product reviews:", error)
    return []
  }

  // FIX: The Supabase client may incorrectly type the 'profiles' join as an array.
  // We will map the result to ensure 'profiles' is a single object, matching the component's prop type.
  const reviews = data?.map((review) => ({
    ...review,
    profiles: Array.isArray(review.profiles) ? review.profiles[0] || null : review.profiles,
  }))

  return reviews || []
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name, slug),
      product_media(storage_path, alt_text, is_primary)
    `
    )
    .eq("category_id", categoryId)
    .neq("id", currentProductId)
    .eq("status", "published")
    .limit(4)

  return products || []
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.category_id, product.id),
    getProductReviews(product.id),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span>/</span>
          <Link href={`/categories/${product.categories?.slug}`} className="hover:text-primary">
            {product.categories?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery media={product.product_media} title={product.title} />
          <ProductInfo product={product} />
        </div>

        {/* Reviews */}
        <ProductReviews reviews={reviews} productId={product.id} />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>

      <SiteFooter />
    </div>
  )
}