import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Filter, ImageIcon, File, Trash2, Eye, Download } from "lucide-react"

// Mock media data - in production this would come from Supabase storage
const mockMedia = [
  {
    id: "1",
    name: "product-hero-1.jpg",
    type: "image",
    size: "2.4 MB",
    url: "/product-hero.png",
    uploadedAt: "2024-01-15",
    dimensions: "1920x1080",
  },
  {
    id: "2",
    name: "category-banner.png",
    type: "image",
    size: "1.8 MB",
    url: "/category-banner.png",
    uploadedAt: "2024-01-14",
    dimensions: "1200x600",
  },
  {
    id: "3",
    name: "product-catalog.pdf",
    type: "document",
    size: "5.2 MB",
    url: "#",
    uploadedAt: "2024-01-13",
    dimensions: null,
  },
  {
    id: "4",
    name: "logo-variations.svg",
    type: "image",
    size: "156 KB",
    url: "/logo-variations.png",
    uploadedAt: "2024-01-12",
    dimensions: "500x500",
  },
]

export default async function AdminMediaPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Media Library</h1>
          <p className="text-muted-foreground">Manage your store's images, documents, and media files</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Media Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mockMedia.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockMedia.filter((item) => item.type === "image").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {mockMedia.filter((item) => item.type === "document").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">9.6 MB</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Media Files</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search media..." className="pl-8 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockMedia.map((media) => (
              <Card key={media.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {media.type === "image" ? (
                    <img
                      src={media.url || "/placeholder.svg"}
                      alt={media.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <File className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm truncate">{media.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {media.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Size: {media.size}</p>
                      {media.dimensions && <p>Dimensions: {media.dimensions}</p>}
                      <p>Uploaded: {media.uploadedAt}</p>
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
