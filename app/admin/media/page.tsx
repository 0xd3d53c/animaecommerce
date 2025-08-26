import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, Filter, ImageIcon, File, Trash2, Eye, Download } from "lucide-react"

async function getMedia() {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from("product_media").list()

  if (error) {
    console.error("Error fetching media:", error)
    return []
  }

  return data.map((file) => ({
    id: file.id,
    name: file.name,
    type: file.metadata.mimetype.startsWith("image") ? "image" : "document",
    size: `${(file.metadata.size / 1024 / 1024).toFixed(2)} MB`,
    url: supabase.storage.from("product_media").getPublicUrl(file.name).data.publicUrl,
    uploadedAt: new Date(file.created_at).toLocaleDateString(),
    dimensions: null, // You would need a more advanced solution to get image dimensions
  }))
}

export default async function AdminMediaPage() {
  await requireAdmin()
  const media = await getMedia()

  const imageCount = media.filter((item) => item.type === "image").length
  const documentCount = media.filter((item) => item.type === "document").length
  const totalSize = media.reduce((acc, item) => acc + parseFloat(item.size), 0).toFixed(2)

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
            <div className="text-2xl font-bold text-primary">{media.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{imageCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{documentCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSize} MB</div>
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
            {media.map((media) => (
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