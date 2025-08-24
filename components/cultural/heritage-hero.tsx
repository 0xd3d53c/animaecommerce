import Image from "next/image"

export function HeritageHero() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Preserving Assamese Textile Heritage</h1>
              <p className="text-lg text-muted-foreground mb-8">
                For centuries, the skilled artisans of Assam have woven stories into silk and cotton, creating textiles
                that are not just clothing, but cultural treasures. Each thread carries the wisdom of generations, each
                pattern tells a tale of tradition.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-primary">Ancient Techniques</h3>
                    <p className="text-sm text-muted-foreground">
                      Traditional handloom weaving methods passed down through generations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-primary">Natural Materials</h3>
                    <p className="text-sm text-muted-foreground">
                      Organic cotton, silk, and natural dyes sourced from local plants
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                  <div>
                    <h3 className="font-semibold text-primary">Cultural Significance</h3>
                    <p className="text-sm text-muted-foreground">
                      Each motif and pattern holds deep cultural and spiritual meaning
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/assamese-weaver.png"
                alt="Traditional Assamese weaving"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
