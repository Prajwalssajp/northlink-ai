import { NextRequest, NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { latitude, longitude, speed, status } = body;

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ success: false, error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const updated = fallbackDb.updateVehicleLocation(
      params.id,
      parseFloat(latitude),
      parseFloat(longitude),
      speed !== undefined ? parseFloat(speed) : undefined,
      status
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
