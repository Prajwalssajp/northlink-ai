import { NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET() {
  try {
    const summary = fallbackDb.getDashboardSummary();
    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
