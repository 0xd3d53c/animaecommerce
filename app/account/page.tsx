import { requireAuth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AccountPage() {
  await requireAuth()
  redirect("/account/orders")
}
