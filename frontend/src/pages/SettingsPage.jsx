import React, { useState, useEffect } from 'react';
import { userApi, seedApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Save,
  CheckCircle2,
  Trash2
} from 'lucide-react';

export default function SettingsPage() {
  const { user, switchRole, refreshProfile } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [emailNotif, setEmailNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      if (user.notificationPrefs) {
        setEmailNotif(!!user.notificationPrefs.email);
        setReminderNotif(!!user.notificationPrefs.reservationReminders);
        setPromoNotif(!!user.notificationPrefs.promotions);
      }
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await userApi.updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        notificationPrefs: {
          email: emailNotif,
          reservationReminders: reminderNotif,
          promotions: promoNotif,
        },
      });

      if (res.data.success) {
        addToast('Profile preferences saved successfully', 'success');
        refreshProfile();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSessions = async () => {
    if (!window.confirm('Reset all demo parking sessions and free all reserved spaces?')) return;
    try {
      setResetting(true);
      const res = await seedApi.resetSessions();
      if (res.data.success) {
        addToast('All sessions cleared and parking slots freed!', 'success');
      }
    } catch (err) {
      addToast('Reset failed', 'error');
    } finally {
      setResetting(false);
    }
  };

  const handleFullReseed = async () => {
    if (!window.confirm('Wipe and completely re-seed all sample facilities, slots, vehicles, and accounts?')) return;
    try {
      setResetting(true);
      const res = await seedApi.run();
      if (res.data.success) {
        addToast('Full database re-seed completed successfully!', 'success');
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      addToast('Re-seed failed', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-emerald-400" />
            <span>Platform & Profile Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your demo identity profile, notification channels, and database reset controls
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column (Profile & Notifications) */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-navy-900 border border-navy-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-navy-800">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Personal Details</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Demo Email (Identity Key)
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-800 text-slate-400 font-mono cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Demo identities are stored by email in localStorage and MongoDB.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Full Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-navy-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91-9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-850 border border-navy-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pt-4 border-t border-navy-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Notification Preferences</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-navy-850 border border-navy-800 cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Email Booking Confirmations</div>
                    <div className="text-[10px] text-slate-400">Receive digital pass confirmations via email</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    className="rounded bg-navy-900 border-navy-700 text-emerald-500 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-navy-850 border border-navy-800 cursor-pointer">
                  <div>
                    <div className="font-semibold text-white">Session Expiry Reminders</div>
                    <div className="text-[10px] text-slate-400">Receive alert 15 minutes before parking end time</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminderNotif}
                    onChange={(e) => setReminderNotif(e.target.checked)}
                    className="rounded bg-navy-900 border-navy-700 text-emerald-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Settings'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Database Maintenance & Demo Switcher */}
        <div className="space-y-6">
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-navy-800">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Database Reset Controls</span>
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Use these buttons during demonstrations to wipe simulated test runs and return to initial seed states.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleResetSessions}
                disabled={resetting}
                className="w-full p-3 rounded-xl bg-navy-850 hover:bg-amber-950/30 border border-navy-700 hover:border-amber-500/40 text-left text-xs transition space-y-0.5 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-amber-300">
                  Reset Reservations Only
                </div>
                <div className="text-[10px] text-slate-400">
                  Frees all slots back to available and clears booking sessions.
                </div>
              </button>

              <button
                onClick={handleFullReseed}
                disabled={resetting}
                className="w-full p-3 rounded-xl bg-navy-850 hover:bg-emerald-950/30 border border-navy-700 hover:border-emerald-500/40 text-left text-xs transition space-y-0.5 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-emerald-300">
                  Full Database Re-Seed
                </div>
                <div className="text-[10px] text-slate-400">
                  Completely wipes and regenerates 6 facilities, 500+ slots, sample vehicles, and demo users.
                </div>
              </button>
            </div>
          </div>

          {/* Academic Architecture Notice */}
          <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-2 text-xs text-slate-400">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Environment Status</span>
            </div>
            <p className="leading-relaxed">
              MongoDB Memory / Local Database: <strong>Connected</strong><br />
              API Server Port: <strong>5001</strong><br />
              Client: <strong>Vite + React (Port 5173)</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
