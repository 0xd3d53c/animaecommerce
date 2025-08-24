import { createClient } from "@/lib/supabase/client"

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  variant?: {
    id: string
    attributes: Record<string, string>
  }
}

export interface CustomerInfo {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
}

export interface CreateOrderData {
  items: OrderItem[]
  customerInfo: CustomerInfo
  total: number
  shippingMethod: string
  paymentMethod: string
}

export async function createOrder(data: CreateOrderData) {
  const supabase = createClient()

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      email: data.customerInfo.email,
      first_name: data.customerInfo.firstName,
      last_name: data.customerInfo.lastName,
      phone: data.customerInfo.phone,
      address: data.customerInfo.address,
      city: data.customerInfo.city,
      state: data.customerInfo.state,
      postal_code: data.customerInfo.postalCode,
      total: data.total,
      shipping_method: data.shippingMethod,
      payment_method: data.paymentMethod,
      status: "pending",
    })
    .select()
    .single()

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`)
  }

  // Create order items
  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    variant_id: item.variant?.id,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`)
  }

  return order
}

export async function processPayment({
  orderId,
  amount,
  customerInfo,
}: {
  orderId: string
  amount: number
  customerInfo: CustomerInfo
}) {
  try {
    // Step 1: Create Razorpay order on server
    const orderResponse = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        orderId,
      }),
    })

    const orderData = await orderResponse.json()

    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to create payment order")
    }

    // Step 2: Load Razorpay script
    const { loadRazorpayScript, initializeRazorpay } = await import("@/lib/razorpay")
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      throw new Error("Failed to load payment gateway")
    }

    // Step 3: Initialize Razorpay checkout
    return new Promise((resolve) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo", // Demo key
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Anima Store",
        description: "Order Payment",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          try {
            // Step 4: Verify payment on server
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                orderId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              resolve({ success: true })
            } else {
              resolve({ success: false, error: verifyData.error })
            }
          } catch (error) {
            resolve({
              success: false,
              error: error instanceof Error ? error.message : "Payment verification failed",
            })
          }
        },
        prefill: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#8B5A3C", // Primary color
        },
        modal: {
          ondismiss: () => {
            resolve({ success: false, error: "Payment cancelled by user" })
          },
        },
      }

      initializeRazorpay(options)
    })
  } catch (error) {
    console.error("Payment processing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Payment failed",
    }
  }
}
