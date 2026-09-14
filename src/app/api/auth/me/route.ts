import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromHeader, verifyToken } from '@/lib/auth';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('northlink_token')?.value;

    let user = null;
    if (cookieToken) {
      const decoded = verifyToken(cookieToken);
      if (decoded) {
        user = fallbackDb.getUsers().find(u => u.id === decoded.userId);
      }
    }

    if (!user) {
      user = getCurrentUserFromHeader(authHeader);
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
