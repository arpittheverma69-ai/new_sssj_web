import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    }
}
