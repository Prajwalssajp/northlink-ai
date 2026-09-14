import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const commodity = searchParams.get('commodity') || undefined;
    const status = searchParams.get('status') || undefined;

    const shipments = fallbackDb.getShipments({ commodity, status });
    return NextResponse.json({ success: true, count: shipments.length, shipments });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
