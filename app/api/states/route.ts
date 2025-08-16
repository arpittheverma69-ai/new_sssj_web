import { PrismaClient } from '@/lib/generated/prisma'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const states = await prisma.states.findMany({
            orderBy: { state_name: 'asc' }
        })

        // Transform to frontend shape
        const response = states.map(s => ({
            state: s.state_name,
            statecode: s.state_code
        }))

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching states:', error)
        return NextResponse.json(
            { error: 'Failed to fetch states' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
