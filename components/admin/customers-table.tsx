"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Mail, Ban, CheckCircle, Search } from "lucide-react"

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  newsletter_subscribed: boolean
  created_at: string
  orders: Array<{
    id: string
    total_amount: number
    status: string
    created_at: string
  }>
}

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [subscriptionFilter, setSubscriptionFilter] = useState("all")

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSubscription =
      subscriptionFilter === "all" ||
      (subscriptionFilter === "subscribed" && customer.newsletter_subscribed) ||
      (subscriptionFilter === "unsubscribed" && !customer.newsletter_subscribed)

    return matchesSearch && matchesSubscription
  })

  const getCustomerStats = (orders: Customer["orders"]) => {
    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0)
    const lastOrderDate =
      orders.length > 0 ? new Date(Math.max(...orders.map((o) => new Date(o.created_at).getTime()))) : null

    return { totalOrders, totalSpent, lastOrderDate }
  }

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={subscriptionFilter}
            onChange={(e) => setSubscriptionFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Customers</option>
            <option value="subscribed">Newsletter Subscribers</option>
            <option value="unsubscribed">Non-subscribers</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Newsletter</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => {
              const stats = getCustomerStats(customer.orders)
              return (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={customer.full_name} />
                        <AvatarFallback>{getInitials(customer.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{customer.full_name || "No name"}</p>
                        <p className="text-sm text-muted-foreground">ID: {customer.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{customer.email}</p>
                      <p className="text-sm text-muted-foreground">{customer.phone || "No phone"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{stats.totalOrders}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">₹{stats.totalSpent.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {stats.lastOrderDate ? stats.lastOrderDate.toLocaleDateString() : "Never"}
                    </p>
                  </TableCell>
                  <TableCell>
                    {customer.newsletter_subscribed ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Subscribed
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Not subscribed</Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No customers found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
