import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const customerId = Number(id)
    if (!customerId) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const invoices = await prisma.invoice.findMany({
      where: { buyer_id: customerId },
      orderBy: { created_at: 'desc' },
      include: { line_items: true },
    })

    return NextResponse.json({ invoices })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}



