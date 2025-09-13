import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { generateInvoiceHTML } from '@/utils/invoicePdfGenerator'

export async function POST(request: NextRequest) {
  try {
    const { ids } = await request.json()
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No invoice ids provided' }, { status: 400 })
    }

    // Fetch shop profile (map to generator shape)
    const business = await prisma.businessProfile.findFirst({ include: { state: true } })
    const shopProfile = business
      ? {
        shopName: business.business_name,
        gstin: business.gstin,
        address: business.address,
        city: business.city,
        state: business.state?.state_name || '',
        stateCode: business.state
          ? `${business.state.state_code} (${business.state.state_name.slice(0, 2).toUpperCase()})`
          : '',
        vatTin: business.vat_tin || '',
        panNumber: business.pan_number || '',
        bankName: business.bank_name || '',
        accountNumber: business.account_number || '',
        branchIfsc: business.branch_ifsc || '',
      }
      : {
        shopName: 'Business',
        gstin: '',
        address: '',
        city: '',
        state: '',
        stateCode: '',
      }

    const zip = new JSZip()

    // Fetch each invoice with line items
    for (const id of ids as number[]) {
      try {
        const inv = await prisma.invoice.findUnique({
          where: { id: Number(id) },
          include: {
            line_items: true as any,
          },
        }) as any
        if (!inv) continue

        // Build HTML for this invoice
        const html = generateInvoiceHTML({
          invoiceData: inv,
          lineItems: (inv.line_items || []).map((li: any) => ({
            hsn_sac_code: li.hsn_sac_code,
            description: li.description,
            quantity: Number(li.quantity),
            unit: li.unit,
            rate: Number(li.rate),
            taxableValue: Number(li.taxable_value),
          })),
          cgstRate: 1.5,
          sgstRate: 1.5,
          globalRoundoff: inv.roundoff ? Number(inv.roundoff) : 0,
          copies: ['ORIGINAL FOR RECIPIENT', 'DUPLICATE FOR TRANSPORTER', 'TRIPLICATE FOR SUPPLIER'],
          shopProfile,
        } as any)

        // Inline logo as data URI so it renders in headless browser
        let htmlWithAssets = html
        try {
          const logoPath = path.join(process.cwd(), 'public', 'jw_logo.png')
          const file = fs.readFileSync(logoPath)
          const b64 = file.toString('base64')
          htmlWithAssets = html.replace(/src="\/jw_logo\.png"/g, `src="data:image/png;base64,${b64}"`)
        } catch { }

        // Render real PDF using puppeteer
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.setContent(htmlWithAssets, { waitUntil: 'networkidle0' })
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true })
        await browser.close()

        const name = `Invoice_${inv.invoice_number || id}.pdf`
        zip.file(name, pdfBuffer)
      } catch {
        // Skip on error
      }
    }

    const content = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="invoices.zip"',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to build export' }, { status: 500 })
  }
}


