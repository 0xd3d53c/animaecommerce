import { Suspense } from "react"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Suspense fallback={<div>Loading...</div>}>
                <CheckoutForm />
              </Suspense>
            </div>

            <div className="lg:sticky lg:top-8">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}
