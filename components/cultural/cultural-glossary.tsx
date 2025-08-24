"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const glossaryTerms = [
  {
    term: "Paar",
    definition: "The decorative border of a mekhela chador, often featuring intricate patterns and motifs.",
    category: "Design Elements",
  },
  {
    term: "Jaapi",
    definition: "Traditional conical hat made from bamboo and palm leaves, symbol of Assamese culture.",
    category: "Accessories",
  },
  {
    term: "Eri Silk",
    definition: "Peace silk produced without harming silkworms, known for its thermal properties.",
    category: "Materials",
  },
  {
    term: "Buta",
    definition: "Traditional motifs woven into textiles, often representing flowers, animals, or geometric patterns.",
    category: "Design Elements",
  },
  {
    term: "Throw Shuttle Loom",
    definition: "Traditional handloom used by Assamese weavers to create textiles.",
    category: "Tools",
  },
  {
    term: "Riha",
    definition: "The upper garment of the mekhela chador, draped over the shoulder.",
    category: "Garments",
  },
  {
    term: "Mekhela",
    definition: "The lower garment of the traditional Assamese dress, worn like a sarong.",
    category: "Garments",
  },
  {
    term: "Xorai",
    definition: "Traditional bell-metal plate used in Assamese culture, often depicted in textile motifs.",
    category: "Cultural Symbols",
  },
]

export function CulturalGlossary() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTerms = glossaryTerms.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const categories = [...new Set(glossaryTerms.map((item) => item.category))]

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Cultural Glossary</h2>
            <p className="text-muted-foreground mb-8">
              Understanding the terminology and cultural significance behind Assamese textiles.
            </p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-6">
            {categories.map((category) => {
              const categoryTerms = filteredTerms.filter((item) => item.category === category)
              if (categoryTerms.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-primary mb-4">{category}</h3>
                  <div className="grid gap-4">
                    {categoryTerms.map((item) => (
                      <Card key={item.term}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <div className="sm:w-32 flex-shrink-0">
                              <h4 className="font-semibold text-primary">{item.term}</h4>
                            </div>
                            <div className="flex-1">
                              <p className="text-muted-foreground">{item.definition}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No terms found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
