import type React from "react"
import { requireAuth } from "@/lib/auth"
import { SiteHeader } from "@/components/layout/site-header"
import { AccountSidebar } from "@/components/account/account-sidebar"
import { SiteFooter } from "@/components/layout/site-footer"

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AccountSidebar />
          </div>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
