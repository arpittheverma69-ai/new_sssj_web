import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET - Fetch shop profile
export async function GET() {
    try {
        let shopProfile = await prisma.businessProfile.findFirst({
            include: { state: true }
        })

        if (!shopProfile) {
            // Ensure a default state exists (prefer Maharashtra code 27)
            const defaultState = await prisma.states.findFirst({
                where: {
                    OR: [
                        { state_numeric_code: 27 },
                        { state_code: 'MH' },
                        { state_name: 'Maharashtra' },
                    ],
                },
            })

            shopProfile = await prisma.businessProfile.create({
                data: {
                    business_name: 'J.V. Jewellers',
                    gstin: '27ABCDE1234F1Z5',
                    address: '123 Jewellery Street, Commercial Area',
                    city: 'Mumbai',
                    state_id: defaultState ? defaultState.id : null,
                    vat_tin: null,
                    pan_number: null,
                    bank_name: null,
                    account_number: null,
                    branch_ifsc: null,
                },
                include: { state: true },
            })
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
            accountNumber: shopProfile.account_number || '',
            branchIfsc: shopProfile.branch_ifsc || ''
        })
    } catch (error) {
        console.error('Error fetching shop profile:', error)
        return NextResponse.json(
            { error: 'Failed to fetch shop profile' },
            { status: 500 }
        )
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

        // Find matching state by name (primary) or state_code
        const state = await prisma.states.findFirst({
            where: {
                OR: [
                    { state_name: data.state },
                    { state_code: stateCode }
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
                    state_id: state.id,
                    vat_tin: data.vatTin || null,
                    pan_number: data.panNumber || null,
                    bank_name: data.bankName || null,
                    account_number: data.accountNumber || null,
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
                    state_id: state.id,
                    vat_tin: data.vatTin || null,
                    pan_number: data.panNumber || null,
                    bank_name: data.bankName || null,
                    account_number: data.accountNumber || null,
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
                accountNumber: shopProfile.account_number || '',
                branchIfsc: shopProfile.branch_ifsc || ''
            }
        })
    } catch (error) {
        console.error('Error saving shop profile:', error)
        return NextResponse.json(
            { error: 'Failed to save shop profile' },
            { status: 500 }
        )
    }
}
