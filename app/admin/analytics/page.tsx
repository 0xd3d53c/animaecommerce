import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsClient } from "@/components/admin/analytics-client";

async function getAnalyticsData() {
  const supabase = await createClient();

  // Get monthly sales data
  const { data: monthlySales } = await supabase
    .from("orders")
    .select("total_amount, created_at")
    .eq("status", "delivered")
    .gte("created_at", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

  // Get category performance
  const { data: categoryData } = await supabase.from("order_items").select(`
      quantity,
      unit_price,
      products(categories(name))
    `);

  // Get customer analytics
  const { data: customerData } = await supabase
    .from("profiles")
    .select(`
      id,
      created_at,
      orders(total_amount, status)
    `)
    .eq("role", "customer");

  // Process monthly sales
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    const monthName = month.toLocaleDateString("en-US", { month: "short" });

    const monthRevenue =
      monthlySales
        ?.filter((sale) => {
          const saleMonth = new Date(sale.created_at).getMonth();
          const targetMonth = month.getMonth();
          return saleMonth === targetMonth;
        })
        .reduce((sum, sale) => sum + sale.total_amount, 0) || 0;

    return { month: monthName, revenue: monthRevenue };
  });

  // Process category data
  const categoryRevenue =
    categoryData?.reduce((acc: any, item: any) => {
      const categoryName = item.products?.categories?.name || "Uncategorized";
      const revenue = item.quantity * item.unit_price;
      acc[categoryName] = (acc[categoryName] || 0) + revenue;
      return acc;
    }, {}) || {};

  const categoryChartData = Object.entries(categoryRevenue).map(([name, revenue]) => ({
    name,
    value: revenue as number,
  }));

  // Calculate growth metrics
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0;
  const previousMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0;
  const revenueGrowth = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;

  return {
    monthlyRevenue,
    categoryChartData,
    revenueGrowth,
    totalCustomers: customerData?.length || 0,
    totalRevenue: monthlySales?.reduce((sum, sale) => sum + sale.total_amount, 0) || 0,
  };
}

export default async function AnalyticsPage() {
  await requireAdmin();
  const analytics = await getAnalyticsData();

  return <AnalyticsClient analytics={analytics} />;
}