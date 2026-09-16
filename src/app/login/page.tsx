'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Mountain, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Truck,
  Compass,
  FileText,
  UserCheck,
  Building2
} from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { INITIAL_USERS } from '@/lib/ner-data';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const { login, isAuthenticated, currentUser } = useDemo();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('northlink2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // If already authenticated and not actively logging in, offer quick redirect
  useEffect(() => {
    if (isAuthenticated && currentUser && !loading && !successMsg) {
      // Allow user to still switch accounts or click Continue
    }
  }, [isAuthenticated, currentUser, loading, successMsg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your operational email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Authentication verified. Routing to Command Console...');
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword('northlink2026');
    try {
      setLoading(true);
      setError(null);
      const res = await login(userEmail, 'northlink2026');
      if (res.success) {
        setSuccessMsg(`Authenticated as ${userEmail}. Entering NorthLink...`);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 500);
      } else {
        setError(res.error || 'Quick login failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const roleProfiles = [
    {
      role: 'ADMIN',
      label: 'Director General',
      email: 'admin@northlink.gov.in',
      desc: 'Full command, corridor emergency closure, national grid dispatch',
      badge: 'All Permissions',
      icon: ShieldCheck,
      color: 'border-cyan-500/60 bg-cyan-950/30 text-cyan-300 hover:border-cyan-400',
    },
    {
      role: 'LOGISTICS_MANAGER',
      label: 'Logistics Manager',
      email: 'logistics@northlink.gov.in',
      desc: 'Fleet coordination, AI route bypass selection, shipment priority',
      badge: 'Fleet Command',
      icon: Truck,
      color: 'border-blue-500/60 bg-blue-950/30 text-blue-300 hover:border-blue-400',
    },
    {
      role: 'FIELD_OFFICER',
      label: 'Field Surveyor',
      email: 'field.officer@northlink.gov.in',
      desc: 'Ground damage surveys, offline sensor sync, landslide reports',
      badge: 'Field Survey',
      icon: FileText,
      color: 'border-amber-500/60 bg-amber-950/30 text-amber-300 hover:border-amber-400',
    },
    {
      role: 'DRIVER',
      label: 'Convoy Lead Driver',
      email: 'driver@northlink.gov.in',
      desc: 'Real-time GPS turn-by-turn alerts, SOS signal, mountain speed advisory',
      badge: 'On-Route',
      icon: Compass,
      color: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-300 hover:border-emerald-400',
    },
    {
      role: 'VIEWER',
      label: 'Public Disaster Monitor',
      email: 'viewer@northlink.gov.in',
      desc: 'Civil protection, public road closure bulletins, safe travel corridor feed',
      badge: 'Public Read-Only',
      icon: UserCheck,
      color: 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500',
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#070b13] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />

      {/* Main card container */}
      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {/* DigiLocker & UX4G Official Government Portal Identity */}
        <div className="text-center space-y-2.5">
          {/* Indian National Tricolor Ribbon */}
          <div className="mx-auto flex h-[3px] w-48 rounded-full overflow-hidden shadow">
            <div className="h-full w-1/3 bg-[#FF9933]" />
            <div className="h-full w-1/3 bg-[#FFFFFF]" />
            <div className="h-full w-1/3 bg-[#138808]" />
          </div>

          <div className="inline-flex items-center space-x-2 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
            <span>🏛️ Govt. of India · भारत सरकार</span>
            <span>|</span>
            <span className="text-slate-300">Ministry of Development of North Eastern Region</span>
          </div>

          <div>
            <div className="inline-flex items-center space-x-3 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-4 py-1.5 backdrop-blur shadow-lg shadow-cyan-950/50">
              <div className="relative flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow">
                <Mountain className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono text-xs font-black tracking-widest text-cyan-300">
                NORTHLINK AI · NATIONAL DISASTER LOGISTICS GATEWAY
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            North Eastern Region Command & Logistics Gateway
          </h1>

          {/* DigiLocker-Style Security Badges (matches media_1789579885373.png) */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Govt. Verified Identity</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center space-x-1.5 text-cyan-400 font-medium">
              <CheckCircle2 className="h-4 w-4" />
              <span>Digital India Service</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center space-x-1.5 text-amber-400 font-medium">
              <FileText className="h-4 w-4" />
              <span>NDMA Manifest Compliant</span>
            </span>
          </div>
        </div>

        {/* Auth Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left / Top: Email & Password Form */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#0a0f1d]/90 p-6 shadow-2xl backdrop-blur flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <KeyRound className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white">Operator Sign In</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">256-Bit TLS</span>
              </div>

              {/* Status messages */}
              {error && (
                <div className="mt-4 flex items-start space-x-2 rounded-lg border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mt-4 flex items-start space-x-2 rounded-lg border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300">
                    Official / Operational Email
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@northlink.gov.in"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300">
                      Security Passcode
                    </label>
                    <span className="text-[10px] text-cyan-400">Demo: any key</span>
                  </div>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Lock className="h-4 w-4 text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Passcode or key"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/80 py-2.5 pl-9 pr-9 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-xs font-bold text-slate-950 transition-all hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 shadow-lg shadow-cyan-950/80"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Enter Command Console</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
              <p className="text-[11px] text-slate-400">
                Want immediate public access without logging in?
              </p>
              <Link
                href="/"
                className="mt-1 inline-block text-xs font-semibold text-cyan-400 hover:underline"
              >
                Proceed as Public Observer →
              </Link>
            </div>
          </div>

          {/* Right / Bottom: One-Click Quick Role Selection for Hackathon Demos */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0a0f1d]/90 p-6 shadow-2xl backdrop-blur flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white">Instant One-Click Demo Personas</h2>
                </div>
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-400 border border-cyan-800/60">
                  Select to Auto-Login
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Click any operational role below to instantly simulate that user’s authorized view, dispatch permissions, and GIS telemetry.
              </p>

              <div className="mt-3 space-y-2.5">
                {roleProfiles.map((prof) => {
                  const Icon = prof.icon;
                  return (
                    <button
                      key={prof.email}
                      type="button"
                      onClick={() => handleQuickLogin(prof.email)}
                      disabled={loading}
                      className={`group w-full flex items-center justify-between rounded-xl border p-3 text-left transition-all hover:scale-[1.01] ${prof.color}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900/80 border border-slate-700/50 group-hover:border-current">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white">{prof.label}</span>
                            <span className="rounded bg-slate-900/90 px-1.5 py-0.2 font-mono text-[9px] text-slate-400">
                              {prof.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{prof.desc}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pl-2">
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                          {prof.email.split('@')[0]}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Active Database: Resilient SQLite / Fallback Seed with 21 NER districts</span>
              </span>
              <span className="font-mono text-cyan-400 text-[10px]">Session: JWT Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070b13] text-cyan-400 font-mono text-xs">
          Initialising Secure Command Portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
