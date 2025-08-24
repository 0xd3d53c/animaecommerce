import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Terms & Conditions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of
                  this agreement.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Use License</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily download one copy of the materials on Anima's website for
                  personal, non-commercial transitory viewing only.
                </p>
                <p className="text-muted-foreground">
                  This is the grant of a license, not a transfer of title, and under this license you may not modify or
                  copy the materials.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We strive to provide accurate product information, but we do not warrant that product descriptions or
                  other content is accurate, complete, reliable, current, or error-free.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Pricing and Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All prices are listed in Indian Rupees (INR)</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment must be received before order processing</li>
                  <li>We accept various payment methods as displayed at checkout</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Order Acceptance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to refuse or cancel any order for any reason at any time. We may require
                  additional verification or information before accepting any order.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                  information when you use our service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  In no event shall Anima or its suppliers be liable for any damages (including, without limitation,
                  damages for loss of data or profit, or due to business interruption) arising out of the use or
                  inability to use the materials on Anima's website.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms & Conditions, please contact us at support@anima.com
                </p>
              </CardContent>
            </Card>

            <div className="text-center pt-6">
              <p className="text-sm text-muted-foreground">
                For complete terms and conditions, please visit:{" "}
                <a
                  href="https://merchant.razorpay.com/policy/R9EDE7Kc1hMeh8/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Full Terms & Conditions
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
