import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Clock, MapPin, Package } from "lucide-react"

export default function ShippingPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Shipping Policy</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn about our shipping options, delivery times, and policies
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Standard Shipping</h3>
                    <p className="text-sm text-muted-foreground mb-2">3-5 business days</p>
                    <p className="text-sm">₹99 (Free on orders above ₹2,000)</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Express Shipping</h3>
                    <p className="text-sm text-muted-foreground mb-2">1-2 business days</p>
                    <p className="text-sm">₹199</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">We currently deliver to all major cities and towns across India including:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>All metro cities (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad)</li>
                  <li>Tier 2 cities and major towns</li>
                  <li>Rural areas (delivery may take additional 1-2 days)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Order processing times:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>In-stock items: 1-2 business days</li>
                  <li>Pre-order items: 7-14 business days</li>
                  <li>Custom orders: 14-21 business days</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Packaging & Handling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">We take special care in packaging your orders:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Eco-friendly packaging materials</li>
                  <li>Secure packaging to prevent damage during transit</li>
                  <li>Special handling for delicate items</li>
                  <li>Tracking information provided for all shipments</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Important Notes:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>
                    Delivery times are estimates and may vary during peak seasons or due to unforeseen circumstances
                  </li>
                  <li>We will notify you via email and SMS once your order is shipped</li>
                  <li>Please ensure someone is available to receive the package at the delivery address</li>
                  <li>For any shipping queries, please contact our customer support team</li>
                </ul>
              </CardContent>
            </Card>

            <div className="text-center pt-6">
              <p className="text-sm text-muted-foreground">
                For detailed shipping terms and conditions, please visit:{" "}
                <a
                  href="https://merchant.razorpay.com/policy/R9EDE7Kc1hMeh8/shipping"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Shipping Terms & Conditions
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
