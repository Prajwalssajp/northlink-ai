import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const status = searchParams.get('status') || undefined;

    const incidents = fallbackDb.getIncidents({ type, severity, status });
    return NextResponse.json({ success: true, count: incidents.length, incidents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, incidentType, severity, latitude, longitude, locationName, districtId, reportedBy } = body;

    if (!title || !incidentType || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required incident fields' }, { status: 400 });
    }

    const created = fallbackDb.createIncident({
      title,
      description: description || '',
      incidentType,
      severity: severity || 'MEDIUM',
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      locationName,
      districtId,
      reportedBy: reportedBy || 'Field Officer',
      status: 'ACTIVE',
    });

    return NextResponse.json({ success: true, incident: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
