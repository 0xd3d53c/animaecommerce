"use client"

import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { CartButton } from "@/components/cart/cart-button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-primary/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* START: MODIFIED LOGO SECTION */}
        <Link href="/" className="flex items-center">
          <Image
            src="/_logo.png"
            alt="Anima The Ethic Store Logo"
            width={120}
            height={40}
            className="object-contain"
            priority
          />
        </Link>
        {/* END: MODIFIED LOGO SECTION */}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/deals" className="text-foreground hover:text-primary transition-colors">
            Deals
          </Link>
          <Link href="/new-arrivals" className="text-foreground hover:text-primary transition-colors">
            New Arrivals
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <CartButton />
          <UserNav />
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-primary/10 bg-white/95 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/products"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Deals
            </Link>
            <Link
              href="/new-arrivals"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
              <CartButton />
              <UserNav />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}