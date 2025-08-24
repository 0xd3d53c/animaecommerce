"use client"

import { cn } from "@/lib/utils"
import { User, Package, MapPin, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    name: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    name: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      <h2 className="text-lg font-semibold text-primary mb-4">My Account</h2>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-primary hover:bg-primary/10",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
