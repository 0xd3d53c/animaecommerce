import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { CustomersTable } from "@/components/admin/customers-table"

async function getCustomers() {
  const supabase = await createClient()
  const { data: customers } = await supabase
    .from("profiles")
    .select(`
      *,
      orders(id, total_amount, status, created_at)
    `)
    .eq("role", "customer")
    .order("created_at", { ascending: false })

  return customers || []
}

export default async function AdminCustomersPage() {
  await requireAdmin()
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Customers</h1>
        <p className="text-muted-foreground">Manage customer accounts and information</p>
      </div>

      <CustomersTable customers={customers} />
    </div>
  )
}
