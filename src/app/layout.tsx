import type { Metadata } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { DemoProvider } from '@/lib/demo-context';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'NORTHLINK AI — Smart Logistics & Accessibility Intelligence Platform',
  description: 'AI-Based Smart Logistics and Accessibility Intelligence Platform for the North Eastern Region of India (NER).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="h-screen overflow-hidden bg-[#080c14] font-sans text-slate-100 antialiased">
        <DemoProvider>
          <AppShell>{children}</AppShell>
        </DemoProvider>
      </body>
    </html>
  );
}
