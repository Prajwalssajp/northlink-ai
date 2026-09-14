import { NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET() {
  try {
    const vehicles = fallbackDb.getVehicles();
    return NextResponse.json({ success: true, count: vehicles.length, vehicles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
