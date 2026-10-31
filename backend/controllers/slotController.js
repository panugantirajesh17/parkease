const asyncHandler = require('../middleware/asyncHandler');
const Slot = require('../models/Slot');
const Facility = require('../models/Facility');

/**
 * Recalculates and persists slot counts for a given facility.
 */
const updateFacilitySlotCounts = async (facilityId) => {
  const counts = await Slot.aggregate([
    { $match: { facility: facilityId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const update = { availableSlots: 0, occupiedSlots: 0, reservedSlots: 0, outOfServiceSlots: 0 };
  counts.forEach(c => {
    if (c._id === 'available')     update.availableSlots = c.count;
    if (c._id === 'occupied')      update.occupiedSlots = c.count;
    if (c._id === 'reserved')      update.reservedSlots = c.count;
    if (c._id === 'out_of_service') update.outOfServiceSlots = c.count;
  });
  await Facility.findByIdAndUpdate(facilityId, update);
};

// @desc    Get all slots for a facility
// @route   GET /api/slots/facility/:facilityId
exports.getSlotsByFacility = asyncHandler(async (req, res) => {
  const slots = await Slot.find({ facility: req.params.facilityId })
    .sort({ section: 1, slotNumber: 1 });
  res.json({ success: true, slots });
});

// @desc    Get single slot
// @route   GET /api/slots/:id
exports.getSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id).populate('currentReservation');
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  res.json({ success: true, slot });
});

// @desc    Create single slot
// @route   POST /api/slots/facility/:facilityId
exports.createSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.create({ ...req.body, facility: req.params.facilityId });
  await updateFacilitySlotCounts(slot.facility);
  res.status(201).json({ success: true, slot });
});

// @desc    Create bulk slots for a facility section
// @route   POST /api/slots/facility/:facilityId/bulk
exports.createBulkSlots = asyncHandler(async (req, res) => {
  const { facilityId } = req.params;
  const { section, count, startNumber, slotType, supportedVehicleTypes, hasEvCharging } = req.body;

  if (!section || !count || !startNumber) {
    return res.status(400).json({ success: false, message: 'section, count, and startNumber are required' });
  }

  const slots = [];
  for (let i = 0; i < parseInt(count); i++) {
    slots.push({
      facility: facilityId,
      slotNumber: `${section}${String(parseInt(startNumber) + i).padStart(2, '0')}`,
      section,
      slotType: slotType || 'standard',
      supportedVehicleTypes: supportedVehicleTypes || ['car', 'suv'],
      hasEvCharging: hasEvCharging || false,
      status: 'available'
    });
  }

  const created = await Slot.insertMany(slots);
  await updateFacilitySlotCounts(facilityId);
  res.status(201).json({ success: true, slots: created, count: created.length });
});

// @desc    Update slot details
// @route   PUT /api/slots/:id
exports.updateSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findByIdAndUpdate(
    req.params.id,
    { ...req.body, lastUpdated: new Date() },
    { new: true, runValidators: true }
  );
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  await updateFacilitySlotCounts(slot.facility);
  res.json({ success: true, slot });
});

// @desc    Update slot status only
// @route   PATCH /api/slots/:id/status
exports.updateSlotStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['available', 'occupied', 'reserved', 'out_of_service'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid slot status' });
  }
  const slot = await Slot.findByIdAndUpdate(
    req.params.id,
    { status, lastUpdated: new Date() },
    { new: true }
  );
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  await updateFacilitySlotCounts(slot.facility);
  res.json({ success: true, slot });
});

// @desc    Delete slot
// @route   DELETE /api/slots/:id
exports.deleteSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });
  if (['occupied', 'reserved'].includes(slot.status)) {
    return res.status(400).json({ success: false, message: 'Cannot delete an occupied or reserved slot' });
  }
  await Slot.findByIdAndDelete(req.params.id);
  await updateFacilitySlotCounts(slot.facility);
  res.json({ success: true, message: 'Slot deleted' });
});

exports.updateFacilitySlotCounts = updateFacilitySlotCounts;
