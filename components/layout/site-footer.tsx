import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            {/* START: MODIFIED LOGO SECTION */}
            <div className="mb-4">
              <Image
                src="/_logo.png"
                alt="Anima The Ethic Store "
                width={150}
                height={50}
                className="h-auto object-contain"
                priority
              />
            </div>
            <p className="text-sm opacity-80">Your trusted online shopping destination for quality products.</p>
            {/* END: MODIFIED LOGO SECTION */}
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/products" className="hover:opacity-100">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:opacity-100">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:opacity-100">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="hover:opacity-100">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/shipping" className="hover:opacity-100">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-100">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:opacity-100">
                  Cancellation & Refund
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:opacity-100">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Phone: +91 80112 55880</li>
              <li>Hours: 10 AM - 8 PM Daily</li>
              <li>
                <Link href="/contact" className="hover:opacity-100">
                  Contact Form
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:opacity-100">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-80">
          <p>&copy; {currentYear} Anima. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}