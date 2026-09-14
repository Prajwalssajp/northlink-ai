import { NextResponse } from 'next/server';
import { fallbackDb } from '@/lib/db-fallback';
import { assessRouteRisk } from '@/lib/ai-risk-engine';

export async function GET() {
  try {
    const routes = fallbackDb.getRoutes();
    const incidents = fallbackDb.getIncidents();

    const assessedRoutes = routes.map((route) => {
      const assessment = assessRouteRisk(route, incidents);
      return {
        ...route,
        assessment,
      };
    }).sort((a, b) => b.assessment.riskScore - a.assessment.riskScore);

    return NextResponse.json({ success: true, routes: assessedRoutes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
