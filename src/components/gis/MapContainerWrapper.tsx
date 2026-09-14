'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Loader2 } from 'lucide-react';

const DynamicGisMap = dynamic(() => import('./GisMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[450px] w-full flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#060911] text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      <span className="mt-2 text-xs font-medium">Initializing NER GIS Spatial Canvas...</span>
    </div>
  ),
});

export default function MapContainerWrapper(props: any) {
  return <DynamicGisMap {...props} />;
}
