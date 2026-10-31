import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { facilityApi, slotApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Layers,
  Plus,
  Zap,
  Accessibility,
  Wrench,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Car,
  Filter,
  Check
} from 'lucide-react';

export default function SlotManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(searchParams.get('facilityId') || '');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bulk add modal
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkSection, setBulkSection] = useState('E');
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkStartNum, setBulkStartNum] = useState(1);
  const [bulkType, setBulkType] = useState('standard');
  const [bulkEV, setBulkEV] = useState(false);
  const [bulkCreating, setBulkCreating] = useState(false);

  // Load facilities first
  useEffect(() => {
    facilityApi.getMyFacilities().then((res) => {
      if (res.data.success) {
        const facs = res.data.facilities || [];
        setFacilities(facs);
        if (facs.length > 0 && !selectedFacilityId) {
          setSelectedFacilityId(facs[0]._id);
        }
      }
    });
  }, []);

  // Load slots for selected facility
  const fetchSlots = async () => {
    if (!selectedFacilityId) return;
    try {
      setLoading(true);
      const res = await slotApi.getByFacility(selectedFacilityId);
      if (res.data.success) {
        setSlots(res.data.slots || []);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedFacilityId]);

  const handleFacilityChange = (id) => {
    setSelectedFacilityId(id);
    setSearchParams({ facilityId: id });
  };

  const handleStatusChange = async (slotId, newStatus) => {
    try {
      const res = await slotApi.updateStatus(slotId, newStatus);
      if (res.data.success) {
        addToast(`Slot status updated to ${newStatus.toUpperCase()}`, 'success');
        setSlots((prev) =>
          prev.map((s) => (s._id === slotId ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Status update failed', 'error');
    }
  };

  const handleDeleteSlot = async (slotId, slotNum) => {
    if (!window.confirm(`Permanently delete slot ${slotNum}?`)) return;
    try {
      const res = await slotApi.delete(slotId);
      if (res.data.success) {
        addToast(`Slot ${slotNum} deleted`, 'info');
        setSlots((prev) => prev.filter((s) => s._id !== slotId));
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Cannot delete slot', 'error');
    }
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    if (!selectedFacilityId) return;
    try {
      setBulkCreating(true);
      const res = await slotApi.createBulk(selectedFacilityId, {
        section: bulkSection.trim().toUpperCase(),
        count: parseInt(bulkCount),
        startNumber: parseInt(bulkStartNum),
        slotType: bulkType,
        hasEvCharging: bulkEV,
      });

      if (res.data.success) {
        addToast(`${res.data.count} parking spaces generated successfully!`, 'success');
        setBulkModalOpen(false);
        fetchSlots();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Bulk creation failed', 'error');
    } finally {
      setBulkCreating(false);
    }
  };

  const selectedFacility = facilities.find((f) => f._id === selectedFacilityId);

  // Status counters
  const availCount = slots.filter((s) => s.status === 'available').length;
  const occCount = slots.filter((s) => s.status === 'occupied').length;
  const resCount = slots.filter((s) => s.status === 'reserved').length;
  const oosCount = slots.filter((s) => s.status === 'out_of_service').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-blue-400" />
            <span>Slot Inventory & Status Control</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Individually control space availability, take slots out of service for maintenance, and bulk add bays
          </p>
        </div>

        <button
          onClick={() => setBulkModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Bulk Create Slots</span>
        </button>
      </div>

      {/* Facility Selector & Live Counts Banner */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Select Facility
          </label>
          <select
            value={selectedFacilityId}
            onChange={(e) => handleFacilityChange(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-navy-850 border border-navy-700 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            {facilities.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.address?.city})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-navy-850 border border-navy-800 text-center">
            <span className="text-slate-400 text-[10px] block font-sans">Total</span>
            <span className="font-bold text-white text-sm">{slots.length}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center">
            <span className="text-emerald-400 text-[10px] block font-sans">Available</span>
            <span className="font-bold text-emerald-400 text-sm">{availCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-center">
            <span className="text-rose-400 text-[10px] block font-sans">Occupied</span>
            <span className="font-bold text-rose-400 text-sm">{occCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-center">
            <span className="text-amber-400 text-[10px] block font-sans">Reserved</span>
            <span className="font-bold text-amber-400 text-sm">{resCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <span className="text-slate-400 text-[10px] block font-sans">Maintenance</span>
            <span className="font-bold text-slate-300 text-sm">{oosCount}</span>
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-slate-400">Loading slot records...</div>
      ) : slots.length === 0 ? (
        <div className="p-16 rounded-3xl bg-navy-900 border border-navy-800 text-center max-w-md mx-auto space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Slots Generated Yet</h3>
          <p className="text-xs text-slate-400">
            Generate your parking bays using the bulk slot creator.
          </p>
          <button
            onClick={() => setBulkModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            Bulk Create Slots
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {slots.map((slot) => {
            const statusStyles = {
              available: 'bg-navy-900 border-emerald-500/40 text-emerald-400',
              occupied: 'bg-rose-950/20 border-rose-500/40 text-rose-400',
              reserved: 'bg-amber-950/20 border-amber-500/40 text-amber-400',
              out_of_service: 'bg-slate-900/60 border-slate-700 text-slate-500 opacity-60',
            };

            return (
              <div
                key={slot._id}
                className={`p-3 rounded-2xl border flex flex-col justify-between transition-all space-y-2 ${statusStyles[slot.status] || ''}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-black tracking-wider text-white">
                      {slot.slotNumber}
                    </span>
                    <div className="flex items-center gap-1">
                      {slot.hasEvCharging && (
                        <Zap className="w-3 h-3 text-emerald-400" title="EV" />
                      )}
                      {slot.isAccessible && (
                        <Accessibility className="w-3 h-3 text-blue-400" title="Accessible" />
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                    Sec {slot.section} • {slot.slotType}
                  </div>
                </div>

                {/* Status Toggle Selector */}
                <div className="space-y-1.5 pt-2 border-t border-navy-800">
                  <select
                    value={slot.status}
                    onChange={(e) => handleStatusChange(slot._id, e.target.value)}
                    className="w-full bg-navy-850 border border-navy-700 text-[10px] rounded px-1.5 py-1 text-slate-200 focus:outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="reserved">Reserved</option>
                    <option value="out_of_service">Maintenance</option>
                  </select>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteSlot(slot._id, slot.slotNumber)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-navy-850"
                      title="Delete slot"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk Add Slots Modal */}
      {bulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-white">Bulk Add Parking Spaces</h3>

            <form onSubmit={handleBulkCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Section Code (e.g. A, B, C)
                  </label>
                  <input
                    type="text"
                    maxLength="2"
                    value={bulkSection}
                    onChange={(e) => setBulkSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-navy-700 text-white font-mono font-bold uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Number of Spaces
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={bulkCount}
                    onChange={(e) => setBulkCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-navy-700 text-white font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Start Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bulkStartNum}
                    onChange={(e) => setBulkStartNum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-navy-700 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Slot Type
                  </label>
                  <select
                    value={bulkType}
                    onChange={(e) => setBulkType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-navy-850 border border-navy-700 text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="compact">Compact</option>
                    <option value="large">Large / SUV</option>
                    <option value="accessible">Accessible</option>
                    <option value="ev">EV Bay</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={bulkEV}
                    onChange={(e) => setBulkEV(e.target.checked)}
                    className="rounded bg-navy-850 border-navy-700 text-emerald-500"
                  />
                  <span>Install EV Fast Charger on these slots</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBulkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bulkCreating}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
                >
                  {bulkCreating ? 'Generating...' : 'Create Bays'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
