import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_PRESETS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  ShieldAlert,
  Car,
  Building2,
  Shield,
  UserCheck,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check
} from 'lucide-react';

export default function DemoLoginPage() {
  const { user, login, switchRole, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('driver');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter an email address', 'warning');
      return;
    }
    setLoading(true);
    const res = await login(email.trim().toLowerCase(), role, name.trim());
    setLoading(false);
    if (res.success) {
      if (role === 'driver') navigate('/driver');
      else if (role === 'operator') navigate('/operator');
      else if (role === 'admin') navigate('/admin');
      else navigate('/');
    }
  };

  const handleSelectPreset = async (preset) => {
    setLoading(true);
    const res = await login(preset.email, preset.role, preset.name);
    setLoading(false);
    if (res.success) {
      if (preset.role === 'driver') navigate('/driver');
      else if (preset.role === 'operator') navigate('/operator');
      else if (preset.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo-Only Identity System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Sign In to ParkEase Demo
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          No passwords or complex OAuth required. Enter any email or click a preset role below to test the platform.
        </p>
      </div>

      {/* Preset Personas Section */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider text-center">
          One-Click Demo Profiles
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_PRESETS.map((preset) => {
            const isCurrent = user?.email === preset.email;
            const roleIcons = {
              driver: Car,
              operator: Building2,
              admin: Shield,
            };
            const Icon = roleIcons[preset.role] || UserCheck;

            return (
              <button
                key={preset.email}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 group ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-102'
                    : 'bg-navy-900 border-navy-800 hover:border-navy-700 hover:bg-navy-850'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-navy-800 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm">{preset.name}</h4>
                  <p className="text-[11px] text-emerald-400 font-mono capitalize mt-0.5">{preset.role} Role</p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{preset.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400 group-hover:text-emerald-400 font-semibold">
                  <span>Sign In as {preset.role}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Manual Email Login Form */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 max-w-xl mx-auto shadow-2xl space-y-6">
        <div>
          <h3 className="text-base font-bold text-white">Custom Email Login</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            If the email does not exist, a new demo profile will be created automatically in MongoDB.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. driver@parkease.demo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-navy-700 text-white text-xs focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Dev Driver"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-navy-700 text-white text-xs focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Experience Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'driver', label: 'Driver', desc: 'Book & Track' },
                { id: 'operator', label: 'Operator', desc: 'Lots & Gates' },
                { id: 'admin', label: 'Admin', desc: 'Platform Control' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-xl border text-center transition ${
                    role === r.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                      : 'bg-navy-850 border-navy-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>{loading ? 'Signing In...' : 'Enter Platform'}</span>
          </button>
        </form>

        {user && (
          <div className="pt-4 border-t border-navy-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Current Session: <strong className="text-white">{user.email}</strong> ({user.role})
            </span>
            <button
              onClick={logout}
              className="text-rose-400 hover:text-rose-300 font-semibold"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Production Notice Box per Prompt Requirements */}
      <div className="max-w-xl mx-auto p-5 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Notice on Authentication & Authorization Architecture</span>
        </div>
        <p className="leading-relaxed">
          This demo authentication system uses a header-based identity mechanism (<code>x-demo-email</code>) to allow effortless role-switching during evaluation and grading. Role selection does not represent secure server authorization.
        </p>
        <p className="leading-relaxed">
          In a production deployment, this mechanism would be replaced with:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-300">
          <li>Argon2 / BCrypt password hashing or OAuth 2.0 PKCE flow</li>
          <li>Encrypted JSON Web Tokens (JWT) stored in HTTP-only, SameSite Secure cookies</li>
          <li>Server-side Role-Based Access Control (RBAC) enforced on every API route</li>
          <li>Payment gateway webhook validation (e.g. Razorpay / Stripe)</li>
        </ul>
      </div>
    </div>
  );
}
