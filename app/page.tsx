import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HeroCarousel } from "@/components/home/hero-carousel";

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
  const { data: categories } = await supabase.from("categories").select("id, name, slug, description, image_url").eq("is_active", true).order("sort_order");

  return categories || [];
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([getFeaturedProducts(), getCategories()]);

  const categoryImageMap: { [key: string]: string } = {
    'mekhela-chador': '/elegant-saree-collection.png',
    'ethnic-wear': '/modern-kurta-designs.png',
    'gamusa': '/traditional-accessories.png',
    'buwa-magur': '/designer-palazzo-set.png',
  };

  const carouselSlides = [
    {
      src: "/quality-product.png",
      alt: "High-quality products",
      title: "Quality Products",
      subtitle: "Carefully curated high-quality items.",
      ctaText: "Shop Collection",
      ctaLink: "/products",
    },
    {
      src: "/shipping.png",
      alt: "Fast shipping",
      title: "Fast Shipping",
      subtitle: "Quick delivery with order tracking.",
      ctaText: "Learn More",
      ctaLink: "/shipping",
    },
    {
      src: "/secure_payment.png",
      alt: "Secure payments",
      title: "Secure Payments",
      subtitle: "Safe and secure payment processing.",
      ctaText: "Our Guarantee",
      ctaLink: "/terms",
    },
    {
      src: "/free_rs1999.png",
      alt: "Free delivery",
      title: "Free Delivery",
      subtitle: "On all orders above ₹1,999.",
      ctaText: "Start Shopping",
      ctaLink: "/products",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <HeroCarousel slides={carouselSlides} />

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection organized by category for easy shopping.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                {/* START: MODIFIED CATEGORY CARD */}
                <Card className="group h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={categoryImageMap[category.slug] || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">{category.description}</p>
                    <Button variant="outline" className="w-full mt-auto bg-transparent">
                      View Products
                    </Button>
                  </CardContent>
                </Card>
                {/* END: MODIFIED CATEGORY CARD */}
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
                // START: MODIFIED FEATURED PRODUCT CARD
                <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <Link href={`/products/${product.slug}`}>
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={primaryImage?.storage_path || "/placeholder.svg?height=400&width=400"}
                        alt={primaryImage?.alt_text || product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {product.badges?.map((badge: string) => (
                          <Badge key={badge} variant="secondary" className="bg-white/90 text-primary">
                            {badge.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 h-12 line-clamp-2">
                      <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                        {product.title}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
                        {product.compare_at_price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.compare_at_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                      <Link href={`/products/${product.slug}`}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Buy Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                // END: MODIFIED FEATURED PRODUCT CARD
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