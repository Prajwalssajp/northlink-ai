import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const incident = fallbackDb.getIncidentById(params.id);
    if (!incident) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, incident });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status } = body;

    const updated = fallbackDb.updateIncidentStatus(params.id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, incident: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
