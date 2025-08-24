"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp } from "lucide-react"

interface ProductReviewsProps {
  productId: string
}

// Mock data - in real app, this would come from Supabase
const mockReviews = [
  {
    id: "1",
    user: { name: "Priya Sharma", avatar: null },
    rating: 5,
    title: "Absolutely Beautiful!",
    body: "The craftsmanship is exceptional. The colors are vibrant and the fabric feels premium. Worth every penny!",
    created_at: "2024-01-15",
    helpful_count: 12,
  },
  {
    id: "2",
    user: { name: "Rajesh Kumar", avatar: null },
    rating: 4,
    title: "Great quality, fast delivery",
    body: "Beautiful mekhela chador with intricate work. The artisan's skill is evident in every thread. Highly recommended!",
    created_at: "2024-01-10",
    helpful_count: 8,
  },
]

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews] = useState(mockReviews)

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => reviews.filter((review) => review.rating === rating).length)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Customer Reviews</h2>
        <p className="text-muted-foreground">See what our customers say about this authentic piece</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">{renderStars(Math.round(averageRating))}</div>
              <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating, index) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${reviews.length > 0 ? (ratingCounts[index] / reviews.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{ratingCounts[index]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-6">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{review.user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Verified Purchase
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                  <span className="font-medium">{review.title}</span>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">{review.body}</p>

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful_count})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="text-center">
            <Button variant="outline" className="bg-transparent">
              Load More Reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
