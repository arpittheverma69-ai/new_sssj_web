import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Signup is disabled - redirect to admin user management
  return NextResponse.json(
    { error: 'Signup is disabled. Please contact an administrator to create an account.' },
    { status: 403 }
  );
}
