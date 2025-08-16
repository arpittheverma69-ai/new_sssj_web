import { PrismaClient } from '@/lib/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

// GET - Fetch shop profile
export async function GET() {
    try {
        const shopProfile = await prisma.businessProfile.findFirst({
            include: { state: true }
        })

        if (!shopProfile) {
            return NextResponse.json(
                { error: 'Shop profile not found' },
                { status: 404 }
            )
        }

        // Transform response for frontend
        return NextResponse.json({
            shopName: shopProfile.business_name,
            gstin: shopProfile.gstin,
            address: shopProfile.address,
            city: shopProfile.city,
            state: shopProfile.state ? shopProfile.state.state_name : '',
            stateCode: shopProfile.state
                ? `${shopProfile.state.state_code} (${shopProfile.state.state_name.slice(0, 2).toUpperCase()})`
                : '',
            vatTin: shopProfile.vat_tin || '',
            panNumber: shopProfile.pan_number || '',
            bankName: shopProfile.bank_name || '',
            branchIfsc: shopProfile.branch_ifsc || ''
        })
    } catch (error) {
        console.error('Error fetching shop profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch shop profile' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// POST - Create or update shop profile
export async function POST(request: Request) {
    try {
        const data = await request.json()

        if (!data.shopName || !data.gstin || !data.address || !data.city || !data.state) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Extract state_code (e.g., "09 (UP)" → "09")
        const stateCodeMatch = data.stateCode.match(/^(\w+)/)
        const stateCode = stateCodeMatch ? stateCodeMatch[1] : ''

        // Find matching state
        const state = await prisma.states.findFirst({
            where: {
                OR: [
                    { state_code: stateCode },
                    { state_name: { contains: data.state } }
                ]
            }
        })

        if (!state) {
            return NextResponse.json(
                { error: 'Invalid state selected' },
                { status: 400 }
            )
        }

        // Check if profile exists
        const existingProfile = await prisma.businessProfile.findFirst()

        let shopProfile
        if (existingProfile) {
            shopProfile = await prisma.businessProfile.update({
                where: { id: existingProfile.id },
                data: {
                    business_name: data.shopName,
                    gstin: data.gstin,
                    address: data.address,
                    city: data.city,
                    state_id: state.state_numeric_code,
                    vat_tin: data.vatTin || null,
                    pan_number: data.panNumber || null,
                    bank_name: data.bankName || null,
                    branch_ifsc: data.branchIfsc || null
                },
                include: { state: true }
            })
        } else {
            shopProfile = await prisma.businessProfile.create({
                data: {
                    business_name: data.shopName,
                    gstin: data.gstin,
                    address: data.address,
                    city: data.city,
                    state_id: state.state_numeric_code,
                    vat_tin: data.vatTin || null,
                    pan_number: data.panNumber || null,
                    bank_name: data.bankName || null,
                    branch_ifsc: data.branchIfsc || null
                },
                include: { state: true }
            })
        }

        return NextResponse.json({
            success: true,
            data: {
                shopName: shopProfile.business_name,
                gstin: shopProfile.gstin,
                address: shopProfile.address,
                city: shopProfile.city,
                state: shopProfile.state ? shopProfile.state.state_name : '',
                stateCode: shopProfile.state
                    ? `${shopProfile.state.state_code} (${shopProfile.state.state_name.slice(0, 2).toUpperCase()})`
                    : '',
                vatTin: shopProfile.vat_tin || '',
                panNumber: shopProfile.pan_number || '',
                bankName: shopProfile.bank_name || '',
                branchIfsc: shopProfile.branch_ifsc || ''
            }
        })
    } catch (error) {
        console.error('Error saving shop profile:', error)
        return NextResponse.json(
            { error: 'Failed to save shop profile' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
