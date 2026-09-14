import { NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';
import { assessRouteRisk } from '@/lib/ai-risk-engine';

export async function GET() {
  try {
    const routes = fallbackDb.getRoutes();
    const incidents = fallbackDb.getIncidents();

    const result = routes.map((r) => {
      const assessment = assessRouteRisk(r, incidents);
      return {
        ...r,
        assessment,
      };
    });

    return NextResponse.json({ success: true, routes: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
