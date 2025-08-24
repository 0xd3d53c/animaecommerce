import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { OrdersTable } from "@/components/admin/orders-table"

async function getOrders() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(full_name, email),
      order_items(
        id,
        quantity,
        unit_price,
        products(title)
      )
    `)
    .order("created_at", { ascending: false })

  return orders || []
}

export default async function AdminOrdersPage() {
  await requireAdmin()
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
