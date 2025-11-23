import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { adminDB, isAdminConfigured } from '@/lib/instantdb-admin';

export async function POST(request: NextRequest) {
  try {
    // Check if admin token is configured
    if (!isAdminConfigured()) {
      return NextResponse.json({ 
        error: 'Admin token not configured. Please add INSTANTDB_ADMIN_TOKEN to your .env file.' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user by email
    const result = await adminDB.query({ users: { $: { where: { email } } } });
    
    if (!result.users || result.users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user data (excluding password hash)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 500 });
  }
}

