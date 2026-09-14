import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';
import { signToken } from '@/lib/auth';
import { User, Role } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = fallbackDb.getUsers();

    // Check if user exists in database
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);

    // If user doesn't exist, auto-provision for seamless demo or operational field login
    if (!user) {
      const nameFromEmail = cleanEmail
        .split('@')[0]
        .split('.')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');

      let role: Role = 'VIEWER';
      if (cleanEmail.includes('admin') || cleanEmail.includes('director')) role = 'ADMIN';
      else if (cleanEmail.includes('logistics') || cleanEmail.includes('dispatch')) role = 'LOGISTICS_MANAGER';
      else if (cleanEmail.includes('field') || cleanEmail.includes('survey')) role = 'FIELD_OFFICER';
      else if (cleanEmail.includes('driver') || cleanEmail.includes('convoy')) role = 'DRIVER';
      else role = 'LOGISTICS_MANAGER';

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: nameFromEmail || 'Disaster Relief Operator',
        email: cleanEmail,
        role,
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to database
      fallbackDb.getUsers().push(newUser);
      user = newUser;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user,
      token,
      message: `Welcome back, ${user.name}`,
    });

    response.cookies.set('northlink_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 86400,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
