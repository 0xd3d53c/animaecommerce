"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

interface Product {
  id: string
  title: string
  price: number
  compare_at_price?: number
  description: string
  stock_quantity: number
  badges?: string[]
  materials?: string[]
  care_instructions: string
  categories?: { name: string }
  artisans?: { name: string; village: string; region: string }
}

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.title} added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.title} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link has been copied to clipboard.",
      })
    }
  }

  const discountPercentage = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Product Title & Category */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{product.categories?.name}</Badge>
          {product.badges?.map((badge) => (
            <Badge key={badge} variant="secondary" className="bg-primary/10 text-primary">
              {badge.replace("_", " ")}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">{product.title}</h1>
        <p className="text-muted-foreground">Premium quality product</p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</span>
        {product.compare_at_price && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              ₹{product.compare_at_price.toLocaleString()}
            </span>
            <Badge variant="destructive">{discountPercentage}% OFF</Badge>
          </>
        )}
      </div>

      {/* Description */}
      <div>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>

      {/* Materials */}
      {product.materials && product.materials.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Materials</h3>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((material) => (
              <Badge key={material} variant="outline">
                {material.replace("_", " ")}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Stock Status */}
      <div>
        {product.stock_quantity > 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm">
              {product.stock_quantity > 10 ? "In Stock" : `Only ${product.stock_quantity} left`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            <span className="text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Quantity & Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label htmlFor="quantity" className="font-medium">
            Quantity:
          </label>
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
              disabled={quantity >= product.stock_quantity}
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="outline" size="icon" onClick={handleWishlist}>
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Shipping & Returns */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Free Shipping</p>
              <p className="text-sm text-muted-foreground">On orders above ₹2,000</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Quality Guaranteed</p>
              <p className="text-sm text-muted-foreground">Premium quality products</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <RotateCcw className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Easy Returns</p>
              <p className="text-sm text-muted-foreground">7-day return policy</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Care Instructions */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Care Instructions</h3>
          <p className="text-sm text-muted-foreground">{product.care_instructions}</p>
        </CardContent>
      </Card>
    </div>
  )
}
