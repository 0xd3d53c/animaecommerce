"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  rating: number
  title: string | null
  body: string | null
  created_at: string
  helpful_count: number
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
}

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
}

export function ProductReviews({ productId, reviews: initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const { toast } = useToast()
  const supabase = createClient()

  const handleHelpfulClick = async (reviewId: string, currentHelpfulCount: number) => {
    const { data, error } = await supabase
      .from("reviews")
      .update({ helpful_count: currentHelpfulCount + 1 })
      .eq("id", reviewId)
      .select()
      .single()

    if (error) {
      toast({
        title: "Error",
        description: "Could not register your vote. Please try again.",
        variant: "destructive",
      })
    } else if (data) {
      setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, helpful_count: data.helpful_count } : r)))
      toast({
        title: "Thank you!",
        description: "Your feedback is appreciated.",
      })
    }
  }

  if (!initialReviews || initialReviews.length === 0) {
    return (
      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">No reviews yet for this product.</p>
            <Button variant="outline" className="bg-transparent">
              Be the first to write a review
            </Button>
          </CardContent>
        </Card>
      </section>
    )
  }

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
            <Button variant="outline" className="w-full bg-transparent mt-4">
              Write a Review
            </Button>
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
                      <span className="text-sm font-medium text-primary">
                        {review.profiles?.full_name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.profiles?.full_name || "Anonymous"}</p>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => handleHelpfulClick(review.id, review.helpful_count)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful ({review.helpful_count})
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}