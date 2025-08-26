import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Truck, Shield } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      `
      *,
      categories(name, slug),
      product_media(storage_path, alt_text, is_primary)
    `
    )
    .eq("status", "published")
    .eq("is_featured", true)
    .limit(6);

  return products || [];
}

async function getCategories() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");

  return categories || [];
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white my-8 rounded-lg overflow-hidden">
        <Image
          src="/TRENDLIS.png"
          alt="Premium products background"
          fill
          className="object-cover "
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Premium Quality
            <br />
            <span className="text-accent">Products</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our curated collection of high-quality products with fast shipping and secure payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
              <Link href="/products">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">Quick delivery with order tracking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Safe and secure payment processing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quality Products</h3>
              <p className="text-sm text-muted-foreground">Carefully curated high-quality items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection organized by category for easy shopping.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl font-bold text-primary">{category.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Check out our most popular and trending products.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const primaryImage =
                product.product_media?.find((media: any) => media.is_primary) || product.product_media?.[0];
              return (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-primary/10">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <Image
                        src={primaryImage?.storage_path || "/placeholder.svg?height=400&width=400"}
                        alt={primaryImage?.alt_text || product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {product.badges?.map((badge: string) => (
                          <Badge key={badge} variant="secondary" className="bg-white/90 text-primary">
                            {badge.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
                          {product.compare_at_price && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.compare_at_price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {product.categories?.name}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}