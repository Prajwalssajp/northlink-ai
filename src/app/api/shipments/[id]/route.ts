import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shipment = fallbackDb.getShipmentById(params.id);
    if (!shipment) {
      return NextResponse.json({ success: false, error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, shipment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, delayMinutes } = body;

    const updated = fallbackDb.updateShipmentStatus(params.id, status, delayMinutes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Shipment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, shipment: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
