import { requireAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { OrdersList } from "@/components/account/orders-list"

async function getUserOrders(userId: string) {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        quantity,
        unit_price,
        total_price,
        products(title, slug, product_media(storage_path, alt_text, is_primary))
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return orders || []
}

export default async function OrdersPage() {
  const user = await requireAuth()
  const orders = await getUserOrders(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <OrdersList orders={orders} />
    </div>
  )
}
