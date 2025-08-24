import { getUser } from "@/lib/auth"
import { getServerCart } from "@/lib/cart"
import { CartPageClient } from "@/components/cart/cart-page-client"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function CartPage() {
  const user = await getUser()
  const cart = user ? await getServerCart(user.id) : null

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <CartPageClient initialCart={cart} />
      </div>

      <SiteFooter />
    </div>
  )
}
