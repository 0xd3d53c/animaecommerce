import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const traditions = [
  {
    name: "Mekhela Chador",
    description: "The traditional two-piece garment of Assamese women, symbolizing grace and cultural identity.",
    image: "/assamese-woman-mekhela-chador.png",
    details: [
      "Worn during festivals and special occasions",
      "Features intricate border designs called 'paar'",
      "Made from silk or cotton with traditional motifs",
    ],
  },
  {
    name: "Gamusa",
    description: "A sacred cotton towel that holds deep cultural significance in Assamese society.",
    image: "/gamusa-towel.png",
    details: [
      "Symbol of respect and honor",
      "Used in religious ceremonies",
      "Features red borders with traditional patterns",
    ],
  },
  {
    name: "Pat Silk",
    description: "Golden silk fabric known for its lustrous texture and durability.",
    image: "/golden-assamese-silk.png",
    details: ["Made from indigenous silkworms", "Natural golden color", "Considered auspicious for weddings"],
  },
  {
    name: "Muga Silk",
    description: "The pride of Assam, this golden silk is unique to the region.",
    image: "/muga-silk-textile.png",
    details: ["Produced only in Assam", "Natural golden sheen", "Improves with age and washing"],
  },
]

export function TextileTraditions() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Traditional Textiles</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the rich heritage of Assamese textiles, each with its own story and cultural significance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {traditions.map((tradition) => (
            <Card key={tradition.name} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative h-64">
                <Image
                  src={tradition.image || "/placeholder.svg"}
                  alt={tradition.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-3">{tradition.name}</h3>
                <p className="text-muted-foreground mb-4">{tradition.description}</p>
                <ul className="space-y-2">
                  {tradition.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
