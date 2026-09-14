import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updated = fallbackDb.updateAlertStatus(params.id, 'RESOLVED');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, alert: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
