import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { adminDB, isAdminConfigured } from '@/lib/instantdb-admin';

export async function POST(request: NextRequest) {
  try {
    // Check if admin token is configured
    if (!isAdminConfigured()) {
      return NextResponse.json({ 
        error: 'Admin token not configured. Please add INSTANTDB_ADMIN_TOKEN to your .env file. See GET_ADMIN_TOKEN.md for instructions.' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, password, companyName, industry, country } = body;

    if (!name || !email || !password || !companyName || !industry || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await adminDB.query({ users: { $: { where: { email } } } });
    if (existingUsers.users && existingUsers.users.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create company
    const companyId = uuidv4();
    await adminDB.transact([
      adminDB.tx.companies[companyId].update({
        name: companyName,
        industry,
        country,
        defaultLanguage: 'en',
        createdAt: Date.now(),
      }),
    ]);

    // Create user
    const userId = uuidv4();
    await adminDB.transact([
      adminDB.tx.users[userId].update({
        email,
        passwordHash,
        name,
        role: 'admin',
        companyId,
        createdAt: Date.now(),
      }),
    ]);

    return NextResponse.json({
      message: 'User registered successfully',
      userId,
      companyId,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
  }
}

