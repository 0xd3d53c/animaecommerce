import { createClient } from "@/lib/supabase/server"

export interface CartItem {
  id: string
  product_id: string
  variant_id?: string
  quantity: number
  unit_price: number
  product: {
    title: string
    slug: string
    price: number
    stock_quantity: number
    product_media?: Array<{
      storage_path: string
      alt_text: string
      is_primary: boolean
    }>
  }
}

export interface Cart {
  id: string
  items: CartItem[]
  total: number
  item_count: number
}

// Server-side cart functions
export async function getServerCart(userId?: string): Promise<Cart | null> {
  const supabase = await createClient()

  if (!userId) return null

  const { data: carts } = await supabase
    .from("carts")
    .select(`
      id,
      cart_items(
        id,
        product_id,
        variant_id,
        quantity,
        unit_price,
        products(
          title,
          slug,
          price,
          stock_quantity,
          product_media(storage_path, alt_text, is_primary)
        )
      )
    `)
    .eq("user_id", userId)
    .single()

  if (!carts || !carts.cart_items) {
    return null
  }

  const items = carts.cart_items.map((item: any) => ({
    id: item.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    product: {
      title: item.products.title,
      slug: item.products.slug,
      price: item.products.price,
      stock_quantity: item.products.stock_quantity,
      product_media: item.products.product_media,
    },
  }))

  const total = items.reduce((sum: number, item: CartItem) => sum + item.unit_price * item.quantity, 0)
  const item_count = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

  return {
    id: carts.id,
    items,
    total,
    item_count,
  }
}