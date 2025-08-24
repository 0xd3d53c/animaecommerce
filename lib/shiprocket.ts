// Shiprocket API integration for order tracking
interface ShiprocketConfig {
  email: string
  password: string
  baseUrl: string
}

interface ShiprocketAuthResponse {
  token: string
}

interface ShiprocketTrackingResponse {
  tracking_data: {
    track_status: number
    shipment_status: string
    shipment_track: Array<{
      current_status: string
      delivered_date: string
      destination: string
      consignee_name: string
      origin: string
      courier_company_id: string
      courier_name: string
      edd: string
      pod_status: string
      track_url: string
      etd: string
      shipment_track_activities: Array<{
        date: string
        status: string
        activity: string
        location: string
        sr_status_label: string
      }>
    }>
  }
}

class ShiprocketService {
  private config: ShiprocketConfig
  private token: string | null = null
  private tokenExpiry = 0

  constructor() {
    this.config = {
      email: process.env.SHIPROCKET_EMAIL || "",
      password: process.env.SHIPROCKET_PASSWORD || "",
      baseUrl: "https://apiv2.shiprocket.in/v1/external",
    }
  }

  private async authenticate(): Promise<string> {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.config.email,
          password: this.config.password,
        }),
      })

      if (!response.ok) {
        throw new Error("Shiprocket authentication failed")
      }

      const data: ShiprocketAuthResponse = await response.json()
      this.token = data.token
      this.tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000 // 9 days

      return this.token
    } catch (error) {
      console.error("Shiprocket authentication error:", error)
      throw error
    }
  }

  async createOrder(orderData: {
    order_id: string
    order_date: string
    pickup_location: string
    billing_customer_name: string
    billing_last_name: string
    billing_address: string
    billing_city: string
    billing_pincode: string
    billing_state: string
    billing_country: string
    billing_email: string
    billing_phone: string
    shipping_is_billing: boolean
    order_items: Array<{
      name: string
      sku: string
      units: number
      selling_price: number
    }>
    payment_method: string
    sub_total: number
    length: number
    breadth: number
    height: number
    weight: number
  }) {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${this.config.baseUrl}/orders/create/adhoc`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error("Failed to create Shiprocket order")
      }

      return await response.json()
    } catch (error) {
      console.error("Shiprocket create order error:", error)
      throw error
    }
  }

  async trackOrder(awbCode: string): Promise<ShiprocketTrackingResponse> {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${this.config.baseUrl}/courier/track/awb/${awbCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to track Shiprocket order")
      }

      return await response.json()
    } catch (error) {
      console.error("Shiprocket tracking error:", error)
      throw error
    }
  }

  async getOrderDetails(orderId: string) {
    try {
      const token = await this.authenticate()

      const response = await fetch(`${this.config.baseUrl}/orders/show/${orderId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get Shiprocket order details")
      }

      return await response.json()
    } catch (error) {
      console.error("Shiprocket order details error:", error)
      throw error
    }
  }
}

export const shiprocketService = new ShiprocketService()
