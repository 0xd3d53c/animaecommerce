import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users } from "lucide-react"

async function getAnalyticsData() {
  const supabase = await createClient()

  // Get monthly sales data
  const { data: monthlySales } = await supabase
    .from("orders")
    .select("total_amount, created_at")
    .eq("status", "delivered")
    .gte("created_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

  // Get category performance
  const { data: categoryData } = await supabase.from("order_items").select(`
      quantity,
      unit_price,
      products(categories(name))
    `)

  // Get customer analytics
  const { data: customerData } = await supabase
    .from("profiles")
    .select(`
      id,
      created_at,
      orders(total_amount, status)
    `)
    .eq("role", "customer")

  // Process monthly sales
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - (11 - i))
    const monthName = month.toLocaleDateString("en-US", { month: "short" })

    const monthRevenue =
      monthlySales
        ?.filter((sale) => {
          const saleMonth = new Date(sale.created_at).getMonth()
          const targetMonth = month.getMonth()
          return saleMonth === targetMonth
        })
        .reduce((sum, sale) => sum + sale.total_amount, 0) || 0

    return { month: monthName, revenue: monthRevenue }
  })

  // Process category data
  const categoryRevenue =
    categoryData?.reduce((acc: any, item: any) => {
      const categoryName = item.products?.categories?.name || "Uncategorized"
      const revenue = item.quantity * item.unit_price
      acc[categoryName] = (acc[categoryName] || 0) + revenue
      return acc
    }, {}) || {}

  const categoryChartData = Object.entries(categoryRevenue).map(([name, revenue]) => ({
    name,
    value: revenue as number,
  }))

  // Calculate growth metrics
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0
  const revenueGrowth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0

  return {
    monthlyRevenue,
    categoryChartData,
    revenueGrowth,
    totalCustomers: customerData?.length || 0,
    totalRevenue: monthlySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
  }
}

export default async function AnalyticsPage() {
  await requireAdmin()
  const analytics = await getAnalyticsData()

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            {analytics.revenueGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analytics.revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {analytics.revenueGrowth >= 0 ? "+" : ""}
              {analytics.revenueGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs previous month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹
              {analytics.totalCustomers > 0
                ? Math.round(analytics.totalRevenue / analytics.totalCustomers).toLocaleString()
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer LTV</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ₹
              {analytics.totalCustomers > 0
                ? Math.round((analytics.totalRevenue / analytics.totalCustomers) * 1.5).toLocaleString()
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Estimated lifetime value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-revenue)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Revenue",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
