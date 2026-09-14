import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET() {
  try {
    const reports = fallbackDb.getFieldReports();
    return NextResponse.json({ success: true, count: reports.length, reports });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reporterName, incidentType, severity, description, latitude, longitude, locationName, imageAttachment } = body;

    if (!reporterName || !incidentType || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ success: false, error: 'Missing mandatory report fields' }, { status: 400 });
    }

    const created = fallbackDb.createFieldReport({
      reporterName,
      incidentType,
      severity: severity || 'HIGH',
      description: description || '',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      locationName,
      imageAttachment,
      syncStatus: 'SYNCED',
    });

    return NextResponse.json({ success: true, report: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
