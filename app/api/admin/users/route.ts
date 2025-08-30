import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET - Fetch all users
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log('GET /api/admin/users - Session:', session);

        if (!session || session.user.role !== 'admin') {
            console.log('GET /api/admin/users - Unauthorized access attempt:', { 
                hasSession: !!session, 
                userRole: session?.user?.role 
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new user
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        console.log('POST /api/admin/users - Session:', session);

        if (!session || session.user.role !== 'admin') {
            console.log('POST /api/admin/users - Unauthorized access attempt:', { 
                hasSession: !!session, 
                userRole: session?.user?.role 
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { username, email, password, role } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: username },
                    { email },
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this name or email already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: username,
                email,
                password: hashedPassword,
                role: role || 'user',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
