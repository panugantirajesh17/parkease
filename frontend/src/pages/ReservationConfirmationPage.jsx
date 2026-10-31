import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reservationApi } from '../services/api';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Car,
  MapPin,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Download,
  Share2,
  ParkingSquare
} from 'lucide-react';

export default function ReservationConfirmationPage() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRes = async () => {
      try {
        setLoading(true);
        const res = await reservationApi.getById(id);
        if (res.data.success) {
          setReservation(res.data.reservation);
        }
      } catch (err) {
        console.error('Failed to load reservation confirmation', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRes();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center space-y-3">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-xs">Generating your digital demo parking pass...</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-md mx-auto py-32 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Reservation Not Found</h2>
        <Link to="/find" className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
          Find Another Facility
        </Link>
      </div>
    );
  }

  const startDate = new Date(reservation.startTime);
  const endDate = new Date(reservation.expectedEndTime);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">
          Parking Space Confirmed!
        </h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Your reservation reference is active in the database. Present this digital pass at the barrier kiosk.
        </p>
      </div>

      {/* Digital Demo Parking Pass Card */}
      <div className="bg-navy-900 border-2 border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-lg">
              P
            </div>
            <div>
              <div className="text-[10px] tracking-wider uppercase font-semibold opacity-90">
                Official Digital Demo Pass
              </div>
              <div className="text-lg font-black tracking-tight">
                {reservation.facility?.name}
              </div>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] uppercase opacity-80">Reference</div>
            <div className="text-base font-black tracking-wider bg-black/30 px-3 py-1 rounded-lg">
              {reservation.reservationRef}
            </div>
          </div>
        </div>

        {/* Pass Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-navy-800 text-xs">
            <div>
              <div className="text-slate-500 uppercase text-[10px] font-bold">Assigned Space</div>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                {reservation.slot?.slotNumber || 'Auto-Allocated'}
              </div>
              <div className="text-[10px] text-slate-400">
                {reservation.slot?.section ? `Section ${reservation.slot.section}` : 'General Bay'}
              </div>
            </div>

            <div>
              <div className="text-slate-500 uppercase text-[10px] font-bold">Duration</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">
                {reservation.durationHours}h
              </div>
              <div className="text-[10px] text-slate-400">Scheduled</div>
            </div>

            <div>
              <div className="text-slate-500 uppercase text-[10px] font-bold">Vehicle Plate</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {reservation.vehicleSnapshot?.registrationNumber || 'KA-01-DEMO'}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {reservation.vehicleSnapshot?.vehicleType || 'Car'}
              </div>
            </div>

            <div>
              <div className="text-slate-500 uppercase text-[10px] font-bold">Status</div>
              <div className="mt-1">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase font-mono">
                  {reservation.status}
                </span>
              </div>
            </div>
          </div>

          {/* Time & Location Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-navy-850 border border-navy-800 space-y-2">
              <div className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Arrival & Departure Times</span>
              </div>
              <div className="space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Entry:</span>
                  <span className="text-white font-bold">{startDate.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Exit:</span>
                  <span className="text-white font-bold">{endDate.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-850 border border-navy-800 space-y-2">
              <div className="text-slate-400 flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Facility Address</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {reservation.facility?.address?.street ? `${reservation.facility.address.street}, ` : ''}
                {reservation.facility?.address?.city}, {reservation.facility?.address?.state}
              </p>
            </div>
          </div>

          {/* Simulated QR Code Pass Section */}
          <div className="p-6 rounded-2xl bg-navy-950 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* High quality CSS SVG QR Code simulation */}
              <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                <div className="w-full h-full border-4 border-slate-950 p-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-slate-950" />
                    <div className="w-4 h-4 bg-slate-950" />
                  </div>
                  <div className="text-[8px] font-mono font-black text-center text-slate-950 tracking-tighter">
                    PARKEASE
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 bg-slate-950" />
                    <div className="w-2 h-2 bg-slate-950 ml-auto" />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">Automated Gate QR Pass</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Hold this code up to the barrier reader upon arrival at Gate 1.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 mt-2 font-bold">
                  PASS CODE: {reservation.reservationRef}
                </div>
              </div>
            </div>

            {/* Price Total */}
            <div className="text-right shrink-0 border-t sm:border-t-0 sm:border-l border-navy-800 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Estimated Rate</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                ₹{reservation.pricing?.estimatedTotal?.toFixed(2) || '120.00'}
              </div>
              <div className="text-[10px] text-slate-500">Demo Simulation</div>
            </div>
          </div>

          {/* Disclaimer Alert per prompt instructions */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Demonstration Disclaimer:</strong> This reservation is a demonstration record stored in MongoDB and does not guarantee a real-world physical parking space. No live currency or credit card charge was incurred.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-navy-800">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700 text-xs font-semibold flex items-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              <span>Print Pass</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                to="/driver/reservations"
                className="px-4 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-700 text-xs font-semibold transition"
              >
                My Reservations
              </Link>

              <Link
                to="/driver/active-session"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <span>Go to Active Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
