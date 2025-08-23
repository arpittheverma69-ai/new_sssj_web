import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalInvoices,
      totalCustomers,
      totalRevenue,
      recentInvoices,
      monthlyStats,
    ] = await Promise.all([
      prisma.invoice.count(),
      prisma.customer.count(),
      prisma.invoice.aggregate({
        _sum: { total_invoice_value: true },
      }),
      prisma.invoice.findMany({
        take: 5,
        orderBy: { created_at: "desc" },
        include: { customer: true },
      }),
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', invoice_date) as month,
          COUNT(*) as invoice_count,
          SUM(total_invoice_value) as revenue
        FROM "Invoice"
        WHERE invoice_date >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', invoice_date)
        ORDER BY month DESC
        LIMIT 12
      `,
    ]);

    return NextResponse.json({
      totalInvoices,
      totalCustomers,
      totalRevenue: totalRevenue._sum.total_invoice_value || 0,
      recentInvoices,
      monthlyStats,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
