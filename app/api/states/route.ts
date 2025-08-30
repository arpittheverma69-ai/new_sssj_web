import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const states = await prisma.states.findMany({
            orderBy: { state_name: 'asc' }
        })

        return NextResponse.json(states)
    } catch (error) {
        console.error('Error fetching states:', error)
        return NextResponse.json(
            { error: 'Failed to fetch states' },
            { status: 500 }
        )
    }
}
