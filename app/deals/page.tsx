import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

interface DealProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  compare_at_price: number;
  product_media: {
    storage_path: string;
    alt_text: string;
    is_primary: boolean;
  }[];
  reviews: {
    rating: number;
  }[];
}

async function getDeals(): Promise<DealProduct[]> {
  const supabase = await createClient();
  
  // The query is now trivial: we just select everything from our new view.
  const { data: deals, error } = await supabase
    .from("deal_products")
    .select('*')
    .limit(10);

  if (error) {
    console.error("Error fetching deals from view:", error);
    return [];
  }

  // The data from the view needs a slight transformation because json_agg can 
  // return null if there are no rows, but our component expects an array.
  return (deals || []).map(deal => ({
      ...deal,
      reviews: deal.reviews || [], // Ensure reviews is always an array
  })) as DealProduct[];
}

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Special Deals</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Limited time offers on our best products. Don't miss out!
            </p>
          </div>

          {deals.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {deals.map((deal) => {
                const discount = Math.round(((deal.compare_at_price - deal.price) / deal.compare_at_price) * 100);
                const primaryImage = deal.product_media?.find((media) => media.is_primary) || deal.product_media?.[0];
                const totalReviews = deal.reviews.length;
                const averageRating = totalReviews > 0 ? (deal.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1) : "N/A";

                return (
                  <Card key={deal.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Image
                        src={primaryImage?.storage_path || "/placeholder.svg"}
                        alt={primaryImage?.alt_text || deal.title}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {discount > 0 && <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>}
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{deal.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{averageRating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
                      </div>
                      <div className="flex flex-col items-start gap-1 mb-4 md:flex-row md:items-center md:gap-2">
                        <span className="text-2xl font-bold text-primary">₹{deal.price.toLocaleString()}</span>
                        <span className="text-base text-muted-foreground line-through md:text-lg">
                          ₹{deal.compare_at_price.toLocaleString()}
                        </span>
                      </div>
                      <Link href={`/products/${deal.slug}`}>
                        <Button className="w-full">View Deal</Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No Deals Available Right Now</h2>
              <p className="text-muted-foreground mb-6">Check back soon for special offers!</p>
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}