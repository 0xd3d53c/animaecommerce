"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface FilterOptions {
  categories: Array<{ name: string; slug: string }>
}

export function ProductFilters({ categories }: FilterOptions) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get("min_price") || "0", 10),
    parseInt(searchParams.get("max_price") || "50000", 10),
  ])

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    const params = new URLSearchParams(searchParams.toString())
    params.set("min_price", value[0].toString())
    params.set("max_price", value[1].toString())
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium mb-3">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.slug} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={searchParams.get("category") === category.slug}
                    onCheckedChange={(checked) => handleFilterChange("category", checked ? category.slug : null)}
                  />
                  <Label htmlFor={category.slug} className="text-sm">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium mb-3">Price Range</h4>
            <Slider
              defaultValue={[0, 50000]}
              max={50000}
              step={100}
              value={priceRange}
              onValueChange={handlePriceChange}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>

          {/* Ratings */}
          <div>
            <h4 className="font-medium mb-3">Ratings</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={searchParams.get("rating") === rating.toString()}
                    onCheckedChange={(checked) => handleFilterChange("rating", checked ? rating.toString() : null)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm">
                    {rating} stars & up
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}