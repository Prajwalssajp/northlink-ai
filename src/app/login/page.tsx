'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mountain,
  Crown,
  Building2,
  Building,
  HardHat,
  Truck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  ChevronDown,
  Check,
  CheckCircle2,
  MapPin,
  Users,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { Role } from '@/lib/types';
import Link from 'next/link';

interface RoleCard {
  id: string;
  role: Role;
  title: string;
  badge: string;
  desc: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  defaultEmail: string;
  targetRedirect: string;
}

const ROLES: RoleCard[] = [
  {
    id: 'admin',
    role: 'ADMIN',
    title: 'Admin',
    badge: 'Super Admin',
    desc: 'Manage entire platform and system settings',
    icon: Crown,
    iconColor: 'text-[#8b5cf6]',
    iconBg: 'bg-purple-100',
    defaultEmail: 'admin@northlink.gov.in',
    targetRedirect: '/',
  },
  {
    id: 'gov',
    role: 'LOGISTICS_MANAGER',
    title: 'Government Officer',
    badge: 'State / Central',
    desc: 'Monitor, plan and manage logistics operations',
    icon: Building2,
    iconColor: 'text-[#0f172a]',
    iconBg: 'bg-slate-100',
    defaultEmail: 'logistics@northlink.gov.in',
    targetRedirect: '/',
  },
  {
    id: 'district',
    role: 'LOGISTICS_MANAGER',
    title: 'District Officer',
    badge: 'District Level',
    desc: 'Oversee district operations and incidents',
    icon: Building,
    iconColor: 'text-[#10b981]',
    iconBg: 'bg-emerald-100',
    defaultEmail: 'logistics@northlink.gov.in',
    targetRedirect: '/logistics',
  },
  {
    id: 'field',
    role: 'FIELD_OFFICER',
    title: 'Field Officer',
    badge: 'Field Staff',
    desc: 'Report from field and update on-ground data',
    icon: HardHat,
    iconColor: 'text-[#f59e0b]',
    iconBg: 'bg-amber-100',
    defaultEmail: 'field.officer@northlink.gov.in',
    targetRedirect: '/field-reports',
  },
  {
    id: 'driver',
    role: 'DRIVER',
    title: 'Driver',
    badge: 'Logistics Partner',
    desc: 'Access trips, navigation and delivery updates',
    icon: Truck,
    iconColor: 'text-[#0066ff]',
    iconBg: 'bg-blue-100',
    defaultEmail: 'driver@northlink.gov.in',
    targetRedirect: '/driver',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useDemo();

  const [redirectParam, setRedirectParam] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRedirectParam(params.get('redirect'));
    }
  }, []);

  // Default selected role to Driver as shown in the mockup image
  const [selectedRole, setSelectedRole] = useState<RoleCard>(ROLES[4]);
  const [identifier, setIdentifier] = useState(ROLES[4].defaultEmail);
  const [password, setPassword] = useState('northlink2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (r: RoleCard) => {
    setSelectedRole(r);
    setIdentifier(r.defaultEmail);
    setPassword('northlink2026');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Driver ID, Mobile, or Email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Support mobile/ID or email
      const emailToSubmit = identifier.includes('@')
        ? identifier.trim()
        : selectedRole.defaultEmail;

      const res = await login(emailToSubmit, password);
      if (res.success) {
        setSuccess(true);
        const destination = redirectParam || selectedRole.targetRedirect;
        setTimeout(() => {
          router.push(destination);
        }, 500);
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#0a192f] text-slate-100 overflow-hidden font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────
          LEFT HERO SECTION (Scenic North East Hills, Map Outline & Motto)
      ───────────────────────────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[42%] xl:w-[40%] flex-col justify-between p-8 xl:p-10 overflow-hidden">
        {/* Scenic Background Gradient & Highway Hills Landscape */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08182b]/90 via-[#0a233d]/85 to-[#061424]/95 z-0" />

        {/* Mountain Landscape Silhouette & River Valley Graphic */}
        <div className="absolute inset-0 z-[1] opacity-35 pointer-events-none">
          <svg className="w-full h-full object-cover" viewBox="0 0 500 800" fill="none">
            {/* Mountain layers */}
            <path d="M0 250 L120 180 L250 280 L380 160 L500 240 L500 800 L0 800 Z" fill="#082b4c" />
            <path d="M0 380 L180 300 L320 410 L500 320 L500 800 L0 800 Z" fill="#051f38" />
            {/* Winding Highway Curve */}
            <path
              d="M0 650 Q200 580 320 660 T500 750"
              stroke="#cbd5e1"
              strokeWidth="26"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M0 650 Q200 580 320 660 T500 750"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="8 6"
              fill="none"
            />
          </svg>
        </div>

        {/* Top Branding & 8 NER States Glowing Map */}
        <div className="relative z-10 space-y-6">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-900/50">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L1 21h22L12 2zm0 4.5l6.5 11.5h-13L12 6.5z" />
                <path d="M12 11l3 5H9l3-5z" opacity="0.6" />
              </svg>
            </div>
            <div>
              <div className="text-xl font-black tracking-wider text-white">
                NorthLink AI
              </div>
              <div className="text-[10px] text-slate-300 font-medium leading-tight">
                Connected North East<br />Stronger Tomorrow
              </div>
            </div>
          </Link>

          {/* Glowing Outline of the 8 NER States */}
          <div className="relative w-64 h-52 mx-auto my-2">
            <svg className="w-full h-full" viewBox="0 0 300 250" fill="none">
              {/* Outer boundary glow */}
              <path
                d="M45 75 Q90 35 150 40 T270 30 L280 80 Q240 100 230 160 T180 220 L150 240 Q130 180 90 180 T30 150 Z"
                fill="#0066ff"
                fillOpacity="0.15"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="animate-pulse"
              />

              {/* State Labels & Pins */}
              <circle cx="55" cy="78" r="3" fill="#38bdf8" />
              <text x="63" y="82" fill="#e2e8f0" fontSize="10" fontWeight="bold">Sikkim</text>

              <circle cx="190" cy="45" r="3" fill="#38bdf8" />
              <text x="198" y="45" fill="#e2e8f0" fontSize="10" fontWeight="bold">Arunachal</text>
              <text x="198" y="56" fill="#94a3b8" fontSize="8">Pradesh</text>

              <circle cx="135" cy="115" r="3" fill="#38bdf8" />
              <text x="143" y="119" fill="#e2e8f0" fontSize="11" fontWeight="bold">Assam</text>

              <circle cx="215" cy="115" r="3" fill="#38bdf8" />
              <text x="223" y="119" fill="#e2e8f0" fontSize="10" fontWeight="bold">Nagaland</text>

              <circle cx="110" cy="155" r="3" fill="#38bdf8" />
              <text x="118" y="159" fill="#e2e8f0" fontSize="10" fontWeight="bold">Meghalaya</text>

              <circle cx="210" cy="165" r="3" fill="#38bdf8" />
              <text x="218" y="169" fill="#e2e8f0" fontSize="10" fontWeight="bold">Manipur</text>

              <circle cx="125" cy="205" r="3" fill="#38bdf8" />
              <text x="133" y="209" fill="#e2e8f0" fontSize="10" fontWeight="bold">Tripura</text>

              <circle cx="170" cy="215" r="3" fill="#38bdf8" />
              <text x="178" y="219" fill="#e2e8f0" fontSize="10" fontWeight="bold">Mizoram</text>
            </svg>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-2xl xl:text-3xl font-black text-white leading-tight">
              Smarter Logistics<br />for a Stronger{' '}
              <span className="text-[#38bdf8]">North East</span>
            </h2>
          </div>

          {/* 4 Feature Pills */}
          <div className="space-y-2.5 pt-1">
            {[
              { label: 'Safer Roads', icon: MapPin },
              { label: 'Efficient Deliveries', icon: Truck },
              { label: 'Connected Communities', icon: Users },
              { label: 'Data Driven Decisions', icon: BarChart3 },
            ].map((pill) => {
              const Icon = pill.icon;
              return (
                <div
                  key={pill.label}
                  className="inline-flex items-center space-x-2.5 rounded-full bg-slate-900/70 border border-slate-700/80 px-4 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur shadow-sm mr-2 mb-1"
                >
                  <Icon className="h-3.5 w-3.5 text-[#38bdf8]" />
                  <span>{pill.label}</span>
                </div>
              );
            })}
          </div>

          {/* Cursive Motto */}
          <div className="pt-2">
            <p className="font-serif italic text-lg xl:text-xl text-slate-200 tracking-wide">
              Eight States, One Stronger Tomorrow
            </p>
          </div>
        </div>

        {/* Bottom Left Government of India Emblem */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/40 bg-amber-950/20 text-xl">
            🏛️
          </div>
          <div className="text-[11px] leading-snug">
            <div className="font-bold text-slate-200 uppercase tracking-wider">
              Government of India
            </div>
            <div className="text-slate-400 font-medium">
              Ministry of Development of North Eastern Region
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT LOGIN CARD (Exact match to media_1789630240162.jpg)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between bg-gradient-to-br from-slate-100 to-slate-200 p-4 sm:p-8 lg:p-10 relative overflow-y-auto">
        {/* Top Header Controls: Language Selector */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:border-slate-400 cursor-pointer">
            <Globe className="h-4 w-4 text-slate-500" />
            <span>English</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* White Rounded Main Floating Card */}
        <div className="mx-auto w-full max-w-3xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200/80 space-y-6">
          {/* Card Title & Instructions */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Login to NorthLink AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Select your role to continue
            </p>
          </div>

          {/* 5 Role Selection Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {ROLES.map((r) => {
              const isSelected = selectedRole.id === r.id;
              const Icon = r.icon;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r)}
                  className={`relative flex flex-col items-center text-center rounded-2xl p-3 transition-all border-2 active:scale-95 ${
                    isSelected
                      ? 'border-[#0066ff] bg-blue-50/70 shadow-md shadow-blue-500/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {/* Top-Right Blue Checkmark if selected */}
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0066ff] text-white text-[10px] font-black">
                      ✓
                    </span>
                  )}

                  {/* Icon */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.iconBg} ${r.iconColor} mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Role Name */}
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {r.title}
                  </div>

                  {/* Role Badge */}
                  <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                    {r.badge}
                  </div>

                  {/* Subtitle description */}
                  <div className="hidden sm:block text-[9px] text-slate-400 mt-1 leading-tight line-clamp-2">
                    {r.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Role Form + Benefits Card (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Form Column (7 Cols) */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {selectedRole.title} Login
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Enter your credentials to access {selectedRole.title} Mode
                </p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Authenticated! Redirecting to {selectedRole.title} workspace...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Identifier Input */}
                <div className="space-y-1">
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={selectedRole.id === 'driver' ? 'Driver ID / Mobile Number' : 'Official Email / Username'}
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password / PIN"
                      className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066ff] focus:ring-1 focus:ring-[#0066ff] transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center space-x-2 cursor-pointer font-medium text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-[#0066ff] focus:ring-[#0066ff]"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to registered email.')}
                    className="font-bold text-[#0066ff] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Big Blue Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-[#0066ff] hover:bg-[#0052cc] py-3.5 px-6 text-sm font-black text-white shadow-lg shadow-blue-500/20 active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
                >
                  <span>{loading ? 'Authenticating...' : 'Login'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Benefits Box Column (5 Cols) */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-2xl bg-[#f0f6ff] border border-[#d6e5ff] p-5 relative overflow-hidden shadow-sm">
              <div className="space-y-3.5 relative z-10">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0066ff] text-white shadow">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-[#0052cc]">
                      Drive Safe
                    </div>
                    <div className="text-xs font-black text-[#0052cc]">
                      Deliver Hope
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-bold text-slate-700 pt-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0066ff] shrink-0" />
                    <span>Get optimized routes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0066ff] shrink-0" />
                    <span>Voice navigation in NER languages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0066ff] shrink-0" />
                    <span>Real-time alerts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-[#0066ff] shrink-0" />
                    <span>Stay connected with control room</span>
                  </div>
                </div>
              </div>

              {/* Mountain Outline Graphic in background of benefits card */}
              <div className="absolute bottom-0 right-0 left-0 h-20 opacity-20 pointer-events-none">
                <svg className="w-full h-full object-cover" viewBox="0 0 200 80" fill="none">
                  <path d="M0 80 L50 30 L90 60 L140 20 L200 80 Z" fill="#0066ff" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Ribbon */}
        <div className="mx-auto w-full max-w-3xl pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium gap-2">
          <div className="flex items-center space-x-4">
            <span>People</span>
            <span>|</span>
            <span>Connectivity</span>
            <span>|</span>
            <span>Prosperity</span>
          </div>

          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <span>A Brighter North East</span>
            {/* Indian Tricolor Ribbon Swirl */}
            <div className="flex h-3 w-8 rounded overflow-hidden shadow-sm">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#138808]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
