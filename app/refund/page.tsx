import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Clock, CreditCard, AlertCircle } from "lucide-react"

export default function RefundPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Cancellation & Refund Policy</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about our cancellation and refund policies for your orders
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Order Cancellation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Before Shipment</h3>
                  <p className="text-muted-foreground">
                    You can cancel your order within 24 hours of placing it, provided it hasn't been shipped.
                    Cancellation requests can be made through your account or by contacting customer support.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">After Shipment</h3>
                  <p className="text-muted-foreground">
                    Once an order is shipped, it cannot be cancelled. However, you can return the item within 7 days of
                    delivery as per our return policy.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Refund Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Eligible Returns</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Items returned within 7 days of delivery</li>
                    <li>Products in original condition with tags attached</li>
                    <li>Unused and unwashed items</li>
                    <li>Original packaging and accessories included</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Non-Refundable Items</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Customized or personalized products</li>
                    <li>Intimate apparel and undergarments</li>
                    <li>Items damaged by misuse</li>
                    <li>Products without original tags</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Refund Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Return Request</h4>
                      <p className="text-sm text-muted-foreground">Submit return request within 7 days</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Quality Check</h4>
                      <p className="text-sm text-muted-foreground">2-3 business days after we receive the item</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Refund Processing</h4>
                      <p className="text-sm text-muted-foreground">5-7 business days to original payment method</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Refunds will be processed to the original payment method used for the purchase</li>
                  <li>Shipping charges are non-refundable unless the return is due to our error</li>
                  <li>Customer is responsible for return shipping costs unless item is defective</li>
                  <li>Refund amount may be adjusted for any damage or missing items</li>
                  <li>Bank processing times may vary for credit/debit card refunds</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Request a Return</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Log into your account and go to "My Orders"</li>
                  <li>Find the order you want to return and click "Return Item"</li>
                  <li>Select the reason for return and provide any additional details</li>
                  <li>We'll send you a return shipping label via email</li>
                  <li>Pack the item securely and ship it back to us</li>
                </ol>
              </CardContent>
            </Card>

            <div className="text-center pt-6">
              <p className="text-sm text-muted-foreground">
                For detailed cancellation and refund terms, please visit:{" "}
                <a
                  href="https://merchant.razorpay.com/policy/R9EDE7Kc1hMeh8/refund"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Complete Refund Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
