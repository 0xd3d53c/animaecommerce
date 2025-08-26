"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/contexts/cart-context"
import { createOrder, processPayment } from "@/lib/orders"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth/client";
import { AlertCircle, LogIn } from "lucide-react"
import Link from "next/link"

const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(6, "Postal code must be at least 6 digits"),
  shippingMethod: z.enum(["standard", "expedited", "pickup"]),
  paymentMethod: z.enum(["razorpay", "cod"]),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { cart, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: "standard",
      paymentMethod: "razorpay",
    },
  })

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          form.setValue("email", currentUser.email || "")
          form.setValue("firstName", currentUser.user_metadata?.first_name || "")
          form.setValue("lastName", currentUser.user_metadata?.last_name || "")
        }
      } catch (error) {
        console.error("Error checking user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [form])

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in to complete your purchase. Please sign in or create an account to continue.
          </AlertDescription>
        </Alert>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/login">
            <Button className="w-full sm:w-auto">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              Create Account
            </Button>
          </Link>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>Your cart items will be saved and available after you sign in.</p>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const { items, total } = cart

      // --- Start of Financial Calculations ---
      const subtotal = total;
      const shippingAmount = data.shippingMethod === 'standard' ? 99 : data.shippingMethod === 'expedited' ? 199 : 0;
      const taxAmount = Math.round(subtotal * 0.18); // 18% GST
      const finalTotal = subtotal + shippingAmount + taxAmount;
      // --- End of Financial Calculations ---

      const order = await createOrder({
        items: items.map(item => ({
            id: item.product_id,
            name: item.product.title,
            price: item.unit_price,
            quantity: item.quantity,
            image: item.product.product_media?.find(m => m.is_primary)?.storage_path,
            variant: item.variant_id ? { id: item.variant_id, attributes: {} } : undefined
        })),
        customerInfo: data,
        total: subtotal, // Pass the subtotal to createOrder
        shippingMethod: data.shippingMethod,
        paymentMethod: data.paymentMethod,
      })

      if (data.paymentMethod === "razorpay") {
        const paymentResult = await processPayment({
          orderId: order.id,
          amount: finalTotal, // CORRECT: Pass the final calculated total
          customerInfo: data,
        })

        if (paymentResult.success) {
          clearCart()
          router.push(`/order-success?orderId=${order.id}`)
        } else {
          throw new Error(paymentResult.error || "Payment failed")
        }
      } else {
        clearCart()
        router.push(`/order-success?orderId=${order.id}`)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Contact Information</h2>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" {...form.register("email")} className="mt-1" />
          {form.formState.errors.email && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Shipping Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Shipping Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" {...form.register("firstName")} className="mt-1" />
            {form.formState.errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" {...form.register("lastName")} className="mt-1" />
            {form.formState.errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" {...form.register("phone")} className="mt-1" />
          {form.formState.errors.phone && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...form.register("address")} className="mt-1" />
          {form.formState.errors.address && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register("city")} className="mt-1" />
            {form.formState.errors.city && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...form.register("state")} className="mt-1" />
            {form.formState.errors.state && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.state.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" {...form.register("postalCode")} className="mt-1" />
            {form.formState.errors.postalCode && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.postalCode.message}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Shipping Method */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Shipping Method</h2>
        <RadioGroup
          value={form.watch("shippingMethod")}
          onValueChange={(value) => form.setValue("shippingMethod", value as any)}
        >
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="flex-1 cursor-pointer">
              <div className="flex justify-between">
                <span>Standard Shipping (5-7 days)</span>
                <span className="font-medium">₹99</span>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="expedited" id="expedited" />
            <Label htmlFor="express" className="flex-1 cursor-pointer">
              <div className="flex justify-between">
                <span>Express Shipping (2-3 days)</span>
                <span className="font-medium">₹199</span>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="pickup" id="pickup" />
            <Label htmlFor="pickup" className="flex-1 cursor-pointer">
              <div className="flex justify-between">
                <span>Store Pickup (Available 10 AM - 8 PM)</span>
                <span className="font-medium">Free</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Payment Method */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Payment Method</h2>
        <RadioGroup
          value={form.watch("paymentMethod")}
          onValueChange={(value) => form.setValue("paymentMethod", value as any)}
        >
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="razorpay" id="razorpay" />
            <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
              <div>
                <span>Online Payment</span>
                <p className="text-sm text-muted-foreground">Pay securely with cards, UPI, or net banking</p>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex-1 cursor-pointer">
              <div>
                <span>Cash on Delivery</span>
                <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Complete Order"}
      </Button>
    </form>
  )
}