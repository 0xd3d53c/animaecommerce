import { createClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"

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

// Client-side cart functions
export async function getCart(): Promise<Cart | null> {
  const supabase = createClient()

  // Try to get user's cart first
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let cartQuery = supabase.from("carts").select(`
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

  if (user) {
    cartQuery = cartQuery.eq("user_id", user.id)
  } else {
    // For anonymous users, use session-based cart
    const sessionId = getSessionId()
    cartQuery = cartQuery.eq("session_id", sessionId)
  }

  const { data: carts } = await cartQuery.single()

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

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const item_count = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    id: carts.id,
    items,
    total,
    item_count,
  }
}

export async function addToCart(productId: string, quantity = 1, variantId?: string): Promise<void> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get or create cart
  const cartId = await getOrCreateCartId()

  // Get product price
  const { data: product } = await supabase.from("products").select("price").eq("id", productId).single()

  if (!product) throw new Error("Product not found")

  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .eq("variant_id", variantId || null)
    .single()

  if (existingItem) {
    // Update quantity
    await supabase
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id)
  } else {
    // Add new item
    await supabase.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      unit_price: product.price,
    })
  }
}

export async function updateCartItem(itemId: string, quantity: number): Promise<void> {
  const supabase = createClient()

  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", itemId)
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", itemId)
  }
}

export async function removeFromCart(itemId: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("cart_items").delete().eq("id", itemId)
}

export async function clearCart(): Promise<void> {
  const cartId = await getOrCreateCartId()
  const supabase = createClient()
  await supabase.from("cart_items").delete().eq("cart_id", cartId)
}

async function getOrCreateCartId(): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let cartQuery = supabase.from("carts").select("id")

  if (user) {
    cartQuery = cartQuery.eq("user_id", user.id)
  } else {
    const sessionId = getSessionId()
    cartQuery = cartQuery.eq("session_id", sessionId)
  }

  const { data: existingCart } = await cartQuery.single()

  if (existingCart) {
    return existingCart.id
  }

  // Create new cart
  const cartData = user ? { user_id: user.id } : { session_id: getSessionId() }

  const { data: newCart } = await supabase.from("carts").insert(cartData).select("id").single()

  return newCart!.id
}

function getSessionId(): string {
  let sessionId = localStorage.getItem("cart_session_id")
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem("cart_session_id", sessionId)
  }
  return sessionId
}

// Server-side cart functions
export async function getServerCart(userId?: string): Promise<Cart | null> {
  const supabase = await createServerClient()

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

  const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
  const item_count = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    id: carts.id,
    items,
    total,
    item_count,
  }
}
