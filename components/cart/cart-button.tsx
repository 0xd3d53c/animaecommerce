"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { CartDrawer } from "./cart-drawer"
import { useState } from "react"

export function CartButton() {
  const { cart, loading } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)} disabled={loading}>
        <ShoppingCart className="h-5 w-5" />
        {cart && cart.item_count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {cart.item_count}
          </Badge>
        )}
      </Button>
      <CartDrawer open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
