import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Palette, Scissors } from "lucide-react"

interface Motif {
  name: string
  meaning: string
  description: string
  cultural_significance: string
}

interface CulturalStoryProps {
  story?: string
  motifs: Motif[]
  weaveTime?: number
  technique?: string
}

export function CulturalStory({ story, motifs, weaveTime, technique }: CulturalStoryProps) {
  if (!story && (!motifs || motifs.length === 0) && !weaveTime && !technique) {
    return null
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-primary mb-2">Cultural Heritage</h2>
        <p className="text-muted-foreground">
          Every thread tells a story of tradition, craftsmanship, and cultural significance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cultural Story */}
        {story && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                The Story Behind This Piece
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{story}</p>
            </CardContent>
          </Card>
        )}

        {/* Weaving Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              Craftsmanship Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technique && (
              <div>
                <h4 className="font-medium mb-1">Weaving Technique</h4>
                <p className="text-sm text-muted-foreground">{technique}</p>
              </div>
            )}
            {weaveTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  <strong>{weaveTime} days</strong> of dedicated weaving
                </span>
              </div>
            )}
            <div>
              <h4 className="font-medium mb-2">Traditional Elements</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Handwoven</Badge>
                <Badge variant="outline">Natural Dyes</Badge>
                <Badge variant="outline">Traditional Loom</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motifs */}
      {motifs && motifs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-primary mb-4">Sacred Motifs & Their Meanings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {motifs.map((motif, index) => (
              <Card key={index} className="border-primary/10">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-primary mb-2">{motif.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{motif.meaning}</p>
                  <p className="text-sm leading-relaxed">{motif.description}</p>
                  {motif.cultural_significance && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-md">
                      <p className="text-xs text-primary font-medium">Cultural Significance:</p>
                      <p className="text-xs text-muted-foreground mt-1">{motif.cultural_significance}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
