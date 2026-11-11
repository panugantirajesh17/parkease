const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Slot = require('../models/Slot');
const Facility = require('../models/Facility');
const Reservation = require('../models/Reservation');
const mockStore = require('../services/mockStore');

/**
 * Recalculates and persists slot counts for a given facility.
 */
const updateFacilitySlotCounts = async (facilityId) => {
  if (!facilityId) return;
  try {
    if (mongoose.connection.readyState !== 1) {
      mockStore.updateMockFacilityCounts(facilityId._id ? facilityId._id.toString() : facilityId.toString());
      return;
    }
    const idStr = facilityId._id ? facilityId._id.toString() : facilityId.toString();
    if (!mongoose.Types.ObjectId.isValid(idStr)) {
      mockStore.updateMockFacilityCounts(idStr);
      return;
    }
    const objId = new mongoose.Types.ObjectId(idStr);

    const counts = await Slot.aggregate([
      { $match: { facility: objId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const update = { availableSlots: 0, occupiedSlots: 0, reservedSlots: 0, outOfServiceSlots: 0 };
    let total = 0;
    counts.forEach(c => {
      total += c.count;
      if (c._id === 'available')      update.availableSlots = c.count;
      if (c._id === 'occupied')       update.occupiedSlots = c.count;
      if (c._id === 'reserved')       update.reservedSlots = c.count;
      if (c._id === 'out_of_service') update.outOfServiceSlots = c.count;
    });

    if (total > 0) {
      update.totalSlots = total;
    }
    await Facility.findByIdAndUpdate(objId, update);
  } catch (err) {
    console.warn('[ParkEase] Note on facility slot counts:', err.message);
  }
};

// @desc    Get all slots for a facility
// @route   GET /api/slots/facility/:facilityId
exports.getSlotsByFacility = asyncHandler(async (req, res) => {
  const { facilityId } = req.params;

  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, slots: mockStore.getMockSlots(facilityId) });
  }

  try {
    let slots = await Slot.find({ facility: facilityId }).sort({ section: 1, slotNumber: 1 });
    if (!slots || slots.length === 0) {
      return res.json({ success: true, slots: mockStore.getMockSlots(facilityId) });
    }
    res.json({ success: true, slots });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] getSlotsByFacility:', err.message);
    res.json({ success: true, slots: mockStore.getMockSlots(facilityId) });
  }
});

// @desc    Get single slot
// @route   GET /api/slots/:id
exports.getSlot = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const slot = mockStore.getMockSlot(req.params.id);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
    return res.json({ success: true, slot });
  }

  try {
    const slot = await Slot.findById(req.params.id).populate('currentReservation');
    if (!slot) {
      const mock = mockStore.getMockSlot(req.params.id);
      if (mock) return res.json({ success: true, slot: mock });
      return res.status(404).json({ success: false, message: 'Slot not found' });
    }
    res.json({ success: true, slot });
  } catch (err) {
    const mock = mockStore.getMockSlot(req.params.id);
    if (mock) return res.json({ success: true, slot: mock });
    res.status(404).json({ success: false, message: 'Slot not found' });
  }
});

// @desc    Create single slot
// @route   POST /api/slots OR POST /api/slots/facility/:facilityId
exports.createSlot = asyncHandler(async (req, res) => {
  const facilityId = req.params.facilityId || req.body.facility || req.body.facilityId;
  if (!facilityId) {
    return res.status(400).json({ success: false, message: 'Facility ID is required' });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      const slot = mockStore.createMockSlot({ ...req.body, facility: facilityId });
      return res.status(201).json({ success: true, slot });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  try {
    const {
      slotNumber,
      section = 'A',
      floor = 1,
      slotType = 'standard',
      supportedVehicleTypes = ['car', 'suv'],
      status = 'available',
      hasEvCharging = false,
      isAccessible = false,
      notes = ''
    } = req.body;

    const existing = await Slot.findOne({ facility: facilityId, slotNumber: slotNumber.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Slot ${slotNumber} already exists in this facility` });
    }

    const slot = await Slot.create({
      facility: facilityId,
      slotNumber: slotNumber.trim().toUpperCase(),
      section: section.trim().toUpperCase(),
      floor: parseInt(floor) || 1,
      slotType,
      supportedVehicleTypes,
      status,
      hasEvCharging: Boolean(hasEvCharging),
      isAccessible: Boolean(isAccessible),
      notes
    });

    await updateFacilitySlotCounts(facilityId);
    res.status(201).json({ success: true, slot });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] createSlot:', err.message);
    const slot = mockStore.createMockSlot({ ...req.body, facility: facilityId });
    res.status(201).json({ success: true, slot });
  }
});

// @desc    Create bulk slots for a facility section
// @route   POST /api/slots/facility/:facilityId/bulk
exports.createBulkSlots = asyncHandler(async (req, res) => {
  const { facilityId } = req.params;

  if (mongoose.connection.readyState !== 1) {
    try {
      const result = mockStore.createMockBulkSlots(facilityId, req.body);
      return res.status(201).json({ success: true, slots: result.slots, count: result.count });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  try {
    const { section, count, startNumber, slotType, supportedVehicleTypes, hasEvCharging, isAccessible } = req.body;

    if (!section || !count || !startNumber) {
      return res.status(400).json({ success: false, message: 'section, count, and startNumber are required' });
    }

    const existingSlots = await Slot.find({ facility: facilityId }, 'slotNumber');
    const existingSet = new Set(existingSlots.map(s => s.slotNumber));

    const slots = [];
    const sec = section.trim().toUpperCase();
    const start = parseInt(startNumber);
    const n = parseInt(count);

    for (let i = 0; i < n; i++) {
      const sNum = `${sec}${String(start + i).padStart(2, '0')}`;
      if (!existingSet.has(sNum)) {
        slots.push({
          facility: facilityId,
          slotNumber: sNum,
          section: sec,
          slotType: slotType || 'standard',
          supportedVehicleTypes: supportedVehicleTypes || ['car', 'suv'],
          hasEvCharging: Boolean(hasEvCharging),
          isAccessible: Boolean(isAccessible),
          status: 'available'
        });
      }
    }

    if (slots.length === 0) {
      return res.status(400).json({ success: false, message: 'All specified slots already exist' });
    }

    const created = await Slot.insertMany(slots);
    await updateFacilitySlotCounts(facilityId);
    res.status(201).json({ success: true, slots: created, count: created.length });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] createBulkSlots:', err.message);
    const result = mockStore.createMockBulkSlots(facilityId, req.body);
    res.status(201).json({ success: true, slots: result.slots, count: result.count });
  }
});

// @desc    Update slot details
// @route   PUT /api/slots/:id
exports.updateSlot = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const slot = mockStore.updateMockSlot(req.params.id, req.body);
      return res.json({ success: true, slot });
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
  }

  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      const updated = mockStore.updateMockSlot(req.params.id, req.body);
      return res.json({ success: true, slot: updated });
    }

    const updateData = { ...req.body, lastUpdated: new Date() };
    if (req.body.status === 'available') {
      updateData.currentReservation = null;
    }
    if (req.body.slotNumber) {
      updateData.slotNumber = req.body.slotNumber.trim().toUpperCase();
    }
    if (req.body.section) {
      updateData.section = req.body.section.trim().toUpperCase();
    }

    const updatedSlot = await Slot.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    await updateFacilitySlotCounts(updatedSlot.facility);
    res.json({ success: true, slot: updatedSlot });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] updateSlot:', err.message);
    const updated = mockStore.updateMockSlot(req.params.id, req.body);
    res.json({ success: true, slot: updated });
  }
});

// @desc    Update slot status only
// @route   PATCH /api/slots/:id/status or PUT /api/slots/:id/status
exports.updateSlotStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['available', 'occupied', 'reserved', 'out_of_service'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid slot status' });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      const slot = mockStore.updateMockSlotStatus(req.params.id, status);
      return res.json({ success: true, slot });
    } catch (err) {
      return res.status(404).json({ success: false, message: err.message });
    }
  }

  try {
    const update = { status, lastUpdated: new Date() };
    if (status === 'available') {
      update.currentReservation = null;
    }

    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!slot) {
      const updated = mockStore.updateMockSlotStatus(req.params.id, status);
      return res.json({ success: true, slot: updated });
    }
    await updateFacilitySlotCounts(slot.facility);
    res.json({ success: true, slot });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] updateSlotStatus:', err.message);
    const updated = mockStore.updateMockSlotStatus(req.params.id, status);
    res.json({ success: true, slot: updated });
  }
});

// @desc    Delete slot
// @route   DELETE /api/slots/:id
exports.deleteSlot = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const result = mockStore.deleteMockSlot(req.params.id, req.user);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) {
      const result = mockStore.deleteMockSlot(req.params.id, req.user);
      return res.json(result);
    }

    if (['occupied', 'reserved'].includes(slot.status)) {
      if (req.user && req.user.role === 'admin') {
        if (slot.currentReservation) {
          await Reservation.findByIdAndUpdate(slot.currentReservation, {
            status: 'cancelled',
            cancellationReason: 'Slot removed by administrator'
          });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Cannot delete an occupied or reserved slot without admin authorization' });
      }
    }

    await Slot.findByIdAndDelete(req.params.id);
    await updateFacilitySlotCounts(slot.facility);
    res.json({ success: true, message: `Slot ${slot.slotNumber} deleted successfully` });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] deleteSlot:', err.message);
    const result = mockStore.deleteMockSlot(req.params.id, req.user);
    res.json(result);
  }
});

exports.updateFacilitySlotCounts = updateFacilitySlotCounts;
