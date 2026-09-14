import { NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET() {
  try {
    const incidents = fallbackDb.getIncidents().slice(0, 5);
    return NextResponse.json({ success: true, incidents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
