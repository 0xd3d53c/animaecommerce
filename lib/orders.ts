import { createClient } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/auth/client";

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
  total: number // This is the subtotal from the cart
  shippingMethod: string
  paymentMethod: string
}

export async function createOrder(data: CreateOrderData) {
  const supabase = createClient()
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User must be logged in to create an order.")
  }

  // --- Start of Financial Calculations ---
  const subtotal = data.total;
  const shippingAmount = data.shippingMethod === 'standard' ? 99 : data.shippingMethod === 'expedited' ? 199 : 0;
  const taxAmount = Math.round(subtotal * 0.18); // 18% GST
  const totalAmount = subtotal + shippingAmount + taxAmount;
  // --- End of Financial Calculations ---

  const addressPayload = {
    line1: data.customerInfo.address,
    city: data.customerInfo.city,
    state: data.customerInfo.state,
    postal_code: data.customerInfo.postalCode,
    country: "IN",
    name: `${data.customerInfo.firstName} ${data.customerInfo.lastName}`,
    phone: data.customerInfo.phone,
  };

  const { error: profileUpdateError } = await supabase
    .from('profiles')
    .update({
      addresses: [addressPayload],
      phone: data.customerInfo.phone
    })
    .eq('id', user.id);

  if (profileUpdateError) {
    console.error("Failed to update user profile with address:", profileUpdateError);
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      guest_email: data.customerInfo.email,
      // --- Correctly providing all required financial columns ---
      subtotal: subtotal,
      shipping_amount: shippingAmount,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      // ---
      shipping_address: addressPayload,
      billing_address: addressPayload,
      shipping_method: data.shippingMethod,
      payment_method: data.paymentMethod,
      status: "pending",
    })
    .select()
    .single()

  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`)
  }

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
}): Promise<{ success: boolean; error?: string }> {
  try {
    const orderResponse = await fetch("/api/razorpay/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR", orderId }),
    })

    const orderData = await orderResponse.json()
    if (!orderData.success) {
      throw new Error(orderData.error || "Failed to create payment order")
    }

    const { loadRazorpayScript, initializeRazorpay } = await import("@/lib/razorpay")
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      throw new Error("Failed to load payment gateway")
    }

    return new Promise((resolve) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_demo",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Anima Store",
        description: "Order Payment",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, orderId }),
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
        theme: { color: "#8B5A3C" },
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