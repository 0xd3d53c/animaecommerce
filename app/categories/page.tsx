import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

async function getCategories() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true)
  return categories || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Shop by Category</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of products across different categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={`/products?category=${category.slug}`}>
                <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={category.image_url || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      {/* You can add a count of products in each category here */}
                    </div>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}