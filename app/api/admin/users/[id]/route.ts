import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PUT - Update user
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        console.log('PUT /api/admin/users/[id] - Session:', session);

        if (!session || session.user.role !== 'admin') {
            console.log('PUT /api/admin/users/[id] - Unauthorized access attempt:', {
                hasSession: !!session,
                userRole: session?.user?.role
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { username, email, password, role } = await request.json();
        const resolvedParams = await params;
        const userId = parseInt(resolvedParams.id);

        if (!username || !email) {
            return NextResponse.json({ error: 'Username and email are required' }, { status: 400 });
        }

        // Check if another user has the same username or email
        const existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { id: { not: userId } },
                    {
                        OR: [
                            { name: username },
                            { email },
                        ],
                    },
                ],
            },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Another user with this name or email already exists' }, { status: 400 });
        }

        // Prepare update data
        const updateData: any = {
            name: username,
            email,
            role: role || 'user',
        };

        // Only update password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 12);
        }

        // Update user
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        console.log('DELETE /api/admin/users/[id] - Session:', session);

        if (!session || session.user.role !== 'admin') {
            console.log('DELETE /api/admin/users/[id] - Unauthorized access attempt:', {
                hasSession: !!session,
                userRole: session?.user?.role
            });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resolvedParams = await params;
        const userId = resolvedParams.id;

        // Prevent admin from deleting themselves
        if (session.user.id === userId) {
            return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
        }

        // Delete user
        await prisma.user.delete({
            where: { id: parseInt(userId) },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
