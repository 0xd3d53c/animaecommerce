import { Suspense } from "react"
import { OrderSuccessContent } from "@/components/order/order-success-content"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
