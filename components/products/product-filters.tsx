"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface FilterOptions {
  categories: Array<{ name: string; slug: string }>
  artisans: Array<{ name: string }>
}

interface ProductFiltersProps {
  categories: FilterOptions["categories"]
  artisans: FilterOptions["artisans"]
  currentFilters: any
}

export function ProductFilters({ categories, artisans, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState(currentFilters.min_price || "")
  const [maxPrice, setMaxPrice] = useState(currentFilters.max_price || "")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set("min_price", minPrice)
    else params.delete("min_price")
    if (maxPrice) params.set("max_price", maxPrice)
    else params.delete("max_price")
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
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
                    checked={currentFilters.category === category.slug}
                    onCheckedChange={(checked) => updateFilter("category", checked ? category.slug : null)}
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
            <div className="space-y-2">
              <Input
                placeholder="Min price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                placeholder="Max price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <Button onClick={handlePriceFilter} variant="outline" size="sm" className="w-full bg-transparent">
                Apply Price Filter
              </Button>
            </div>
          </div>

          {/* Artisans */}
          <div>
            <h4 className="font-medium mb-3">Artisans</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {artisans.map((artisan) => (
                <div key={artisan.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={artisan.name}
                    checked={currentFilters.artisan === artisan.name}
                    onCheckedChange={(checked) => updateFilter("artisan", checked ? artisan.name : null)}
                  />
                  <Label htmlFor={artisan.name} className="text-sm">
                    {artisan.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" className="w-full bg-transparent">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
