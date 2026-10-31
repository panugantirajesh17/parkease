import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analyticsApi, reservationApi, facilityApi, slotApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Building2,
  ParkingSquare,
  QrCode,
  Search,
  CheckCircle2,
  Clock,
  Car,
  AlertTriangle,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  ArrowRight,
  LogOut,
  Layers
} from 'lucide-react';

export default function OperatorDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Gate lookup input
  const [lookupQuery, setLookupQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, facRes, resRes] = await Promise.allSettled([
        analyticsApi.getOperatorStats(),
        facilityApi.getMyFacilities(),
        reservationApi.getAll({ limit: 8 })
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.stats);
      }

      if (facRes.status === 'fulfilled' && facRes.value.data.success) {
        setFacilities(facRes.value.data.facilities || []);
      }

      if (resRes.status === 'fulfilled' && resRes.value.data.success) {
        setReservations(resRes.value.data.reservations || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load operator metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGateLookup = (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) return;
    navigate(`/operator/gate?q=${encodeURIComponent(lookupQuery.trim())}`);
  };

  const handleDirectCheckIn = async (id) => {
    try {
      const res = await reservationApi.checkIn(id);
      if (res.data.success) {
        addToast('Vehicle checked in! Slot marked occupied.', 'success');
        loadData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Check-in failed', 'error');
    }
  };

  const handleDirectCheckOut = async (id) => {
    try {
      const res = await reservationApi.checkOut(id);
      if (res.data.success) {
        addToast('Vehicle checked out! Slot freed.', 'success');
        loadData();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Checkout failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs">Aggregating facility telemetry & slot occupancy...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
              Operator Hub
            </span>
            <span className="text-xs text-slate-400">• Facility Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Parking Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time lot occupancy, gate entry/exit processing, and slot status management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/operator/gate"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Open Gate Terminal</span>
          </Link>
          <Link
            to="/operator/facilities"
            className="px-4 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-navy-700 text-slate-200 font-bold text-xs transition"
          >
            Manage Facilities
          </Link>
        </div>
      </div>

      {/* Quick Gate Lookup Bar */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-4 shadow-xl">
        <form onSubmit={handleGateLookup} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search reservation by reference (e.g. PK...) or vehicle license plate..."
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-850 border border-navy-700 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify & Process Gate</span>
          </button>
        </form>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Facilities', value: stats?.totalFacilities || facilities.length, color: 'text-blue-400', icon: Building2 },
          { label: 'Total Spaces', value: stats?.totalSlots || 0, color: 'text-white', icon: Layers },
          { label: 'Available Slots', value: stats?.availableSlots || 0, color: 'text-emerald-400', icon: CheckCircle2 },
          { label: 'Occupied Spaces', value: stats?.occupiedSlots || 0, color: 'text-rose-400', icon: Car },
          { label: 'Reserved Pending', value: stats?.reservedSlots || 0, color: 'text-amber-400', icon: Clock },
          { label: 'Under Maintenance', value: stats?.outOfServiceSlots || 0, color: 'text-slate-400', icon: AlertTriangle },
          { label: "Today's Bookings", value: stats?.todayReservations || 0, color: 'text-cyan-400', icon: Sparkles },
          { label: 'Active Sessions', value: stats?.activeSessions || 0, color: 'text-emerald-400', icon: CheckCircle2 },
          { label: 'Completed Visits', value: stats?.completedSessions || 0, color: 'text-purple-400', icon: CheckCircle2 },
          { label: 'Est. Demo Value', value: `₹${stats?.estimatedDemoValue || 0}`, color: 'text-emerald-400', icon: TrendingUp },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-navy-900 border border-navy-800 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className={`text-xl sm:text-2xl font-black font-mono ${item.color}`}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Managed Facilities Grid */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <div>
            <h3 className="text-base font-bold text-white">Your Managed Facilities</h3>
            <p className="text-xs text-slate-400">Live capacity status by lot</p>
          </div>
          <Link
            to="/operator/facilities"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Edit Lots</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((fac) => {
            const availRatio = (fac.availableSlots / (fac.totalSlots || 1)) * 100;
            return (
              <div key={fac._id} className="p-4 rounded-xl bg-navy-850 border border-navy-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm line-clamp-1">{fac.name}</h4>
                    <p className="text-xs text-slate-400">{fac.address?.city}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-navy-900 border border-navy-700 text-slate-300">
                    {fac.facilityType}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 font-sans">Availability:</span>
                    <span className="text-emerald-400 font-bold">{fac.availableSlots} / {fac.totalSlots}</span>
                  </div>
                  <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${availRatio}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-navy-800 text-xs">
                  <Link
                    to={`/operator/slots?facilityId=${fac._id}`}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    View Slot Inventory
                  </Link>
                  <Link
                    to={`/facilities/${fac._id}`}
                    className="text-slate-400 hover:text-white"
                  >
                    Public Page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Gate Activity & Action Table */}
      <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800">
          <div>
            <h3 className="text-base font-bold text-white">Recent Gate Arrivals & Departures</h3>
            <p className="text-xs text-slate-400">Perform direct check-in and checkout confirmations</p>
          </div>
          <Link
            to="/operator/gate"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>Open Gate Terminal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">
              <tr>
                <th className="py-2.5">Pass Ref</th>
                <th className="py-2.5">Driver</th>
                <th className="py-2.5">Facility</th>
                <th className="py-2.5">Space</th>
                <th className="py-2.5">Plate</th>
                <th className="py-2.5">Scheduled</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60 font-mono">
              {reservations.map((r) => (
                <tr key={r._id} className="hover:bg-navy-850/40 transition">
                  <td className="py-3 font-bold text-white">{r.reservationRef}</td>
                  <td className="py-3 font-sans text-slate-300">{r.user?.name || 'Driver'}</td>
                  <td className="py-3 font-sans text-slate-400 truncate max-w-[120px]">{r.facility?.name}</td>
                  <td className="py-3 font-bold text-emerald-400">{r.slot?.slotNumber || 'A01'}</td>
                  <td className="py-3 text-white font-bold">{r.vehicleSnapshot?.registrationNumber}</td>
                  <td className="py-3 text-slate-400 font-sans">
                    {new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-navy-800 text-slate-300 border border-navy-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {r.status === 'confirmed' && (
                      <button
                        onClick={() => handleDirectCheckIn(r._id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                      >
                        Check In
                      </button>
                    )}
                    {r.status === 'checked_in' && (
                      <button
                        onClick={() => handleDirectCheckOut(r._id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Check Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
