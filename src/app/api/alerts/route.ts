import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const severity = searchParams.get('severity') || undefined;
    const status = searchParams.get('status') || undefined;

    const alerts = fallbackDb.getAlerts({ severity, status });
    return NextResponse.json({ success: true, count: alerts.length, alerts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
