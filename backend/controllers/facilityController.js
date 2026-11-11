const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Facility = require('../models/Facility');
const Slot = require('../models/Slot');
const Review = require('../models/Review');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const mockStore = require('../services/mockStore');

exports.getFacilities = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockStore.getMockFacilities(req.query));
  }

  try {
    const {
      city, name, vehicleType, covered, evCharging, accessible, security,
      minPrice, maxPrice, facilityType, available, sortBy, page = 1, limit = 12
    } = req.query;

    let query = { isActive: true };
    if (city) query['address.city'] = { $regex: city, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    if (facilityType) query.facilityType = facilityType;
    if (vehicleType) query.supportedVehicleTypes = vehicleType;
    if (covered === 'true') query['amenities.covered'] = true;
    if (evCharging === 'true') query['amenities.evCharging'] = true;
    if (accessible === 'true') query['amenities.accessible'] = true;
    if (security === 'true') query['amenities.security'] = true;
    if (available === 'true') query.availableSlots = { $gt: 0 };
    if (minPrice || maxPrice) {
      const pf = {};
      if (minPrice) pf.$gte = parseFloat(minPrice);
      if (maxPrice) pf.$lte = parseFloat(maxPrice);
      query['pricingRules.baseRate'] = pf;
    }

    let sort = {};
    switch (sortBy) {
      case 'price_asc':    sort = { 'pricingRules.0.baseRate': 1 }; break;
      case 'price_desc':   sort = { 'pricingRules.0.baseRate': -1 }; break;
      case 'availability': sort = { availableSlots: -1 }; break;
      case 'rating':       sort = { rating: -1 }; break;
      case 'name':         sort = { name: 1 }; break;
      default:             sort = { rating: -1, createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Facility.countDocuments(query);
    const facilities = await Facility.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('operator', 'name email');

    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)), facilities });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] getFacilities:', err.message);
    res.json(mockStore.getMockFacilities(req.query));
  }
});

exports.getFacility = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockStore.getMockFacility(req.params.id));
  }

  try {
    const facility = await Facility.findById(req.params.id).populate('operator', 'name email phone');
    if (!facility) {
      return res.json(mockStore.getMockFacility(req.params.id));
    }

    const objId = new mongoose.Types.ObjectId(facility._id.toString());
    const slotSummary = await Slot.aggregate([
      { $match: { facility: objId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const reviews = await Review.find({ facility: facility._id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, facility, slotSummary, reviews });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] getFacility:', err.message);
    res.json(mockStore.getMockFacility(req.params.id));
  }
});

exports.createFacility = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const facility = mockStore.createMockFacility(req.body, req.user);
      return res.status(201).json({ success: true, facility });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  try {
    const facility = await Facility.create({ ...req.body, operator: req.user._id });
    if (req.body.generateSlots && facility.totalSlots > 0) {
      const sections = ['A', 'B', 'C', 'D'];
      const slots = [];
      let count = 0;
      for (const section of sections) {
        if (count >= facility.totalSlots) break;
        const n = Math.min(Math.ceil(facility.totalSlots / sections.length), facility.totalSlots - count);
        for (let i = 1; i <= n; i++) {
          slots.push({
            facility: facility._id,
            slotNumber: `${section}${String(i).padStart(2,'0')}`,
            section,
            supportedVehicleTypes: facility.supportedVehicleTypes || ['car'],
            status: 'available'
          });
          count++;
          if (count >= facility.totalSlots) break;
        }
      }
      await Slot.insertMany(slots);
      await Facility.findByIdAndUpdate(facility._id, { availableSlots: facility.totalSlots });
    }
    res.status(201).json({ success: true, facility });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] createFacility:', err.message);
    const facility = mockStore.createMockFacility(req.body, req.user);
    res.status(201).json({ success: true, facility });
  }
});

exports.updateFacility = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const facility = mockStore.updateMockFacility(req.params.id, req.body, req.user);
      return res.json({ success: true, facility });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  try {
    let facility = await Facility.findById(req.params.id);
    if (!facility) {
      const fac = mockStore.updateMockFacility(req.params.id, req.body, req.user);
      return res.json({ success: true, facility: fac });
    }

    if (req.user.role !== 'admin' && facility.operator?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this facility' });
    }

    facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, facility });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] updateFacility:', err.message);
    const facility = mockStore.updateMockFacility(req.params.id, req.body, req.user);
    res.json({ success: true, facility });
  }
});

exports.deleteFacility = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      const result = mockStore.deleteMockFacility(req.params.id, req.user);
      return res.json(result);
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) {
      const result = mockStore.deleteMockFacility(req.params.id, req.user);
      return res.json(result);
    }

    if (req.user.role !== 'admin' && facility.operator?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this facility' });
    }

    const { permanent } = req.query;
    if (permanent === 'true' || req.user.role === 'admin') {
      await Slot.deleteMany({ facility: facility._id });
      await Reservation.updateMany(
        { facility: facility._id, status: { $in: ['confirmed', 'checked_in'] } },
        { status: 'cancelled', cancellationReason: 'Facility permanently removed by administrator' }
      );
      await Facility.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: `Facility "${facility.name}" and all associated slots permanently deleted` });
    }

    await Facility.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Facility deactivated' });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] deleteFacility:', err.message);
    const result = mockStore.deleteMockFacility(req.params.id, req.user);
    res.json(result);
  }
});

exports.getMyFacilities = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const facs = mockStore.mockFacilities;
    if (req.user && req.user.role === 'operator') {
      return res.json({ success: true, facilities: facs.filter(f => f.operator?._id === req.user._id || f.operator === req.user._id) });
    }
    return res.json({ success: true, facilities: facs });
  }

  try {
    let query = {};
    if (req.user && req.user.role === 'operator') {
      query = { operator: req.user._id };
    }
    const facilities = await Facility.find(query).sort({ name: 1 });
    res.json({ success: true, facilities });
  } catch (err) {
    console.warn('[ParkEase DB Fallback] getMyFacilities:', err.message);
    res.json({ success: true, facilities: mockStore.mockFacilities });
  }
});

exports.toggleFavorite = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const user = mockStore.mockUsers.find(u => u._id === req.user?._id) || mockStore.mockUsers[2];
    user.favoritesFacilities = user.favoritesFacilities || [];
    const fid = req.params.id;
    const idx = user.favoritesFacilities.indexOf(fid);
    let isFavorite;
    if (idx === -1) { user.favoritesFacilities.push(fid); isFavorite = true; }
    else { user.favoritesFacilities.splice(idx, 1); isFavorite = false; }
    return res.json({ success: true, isFavorite, favorites: user.favoritesFacilities });
  }

  try {
    const user = await User.findById(req.user._id);
    const fid = req.params.id;
    const idx = user.favoritesFacilities.findIndex(id => id.toString() === fid);
    let isFavorite;
    if (idx === -1) { user.favoritesFacilities.push(fid); isFavorite = true; }
    else { user.favoritesFacilities.splice(idx, 1); isFavorite = false; }
    await user.save();
    res.json({ success: true, isFavorite, favorites: user.favoritesFacilities });
  } catch (err) {
    res.json({ success: true, isFavorite: true, favorites: [req.params.id] });
  }
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  const { vehicleType, city, duration = 2, covered, evCharging } = req.query;
  let facilities = mockStore.mockFacilities.filter(f => f.isActive !== false);

  if (city) facilities = facilities.filter(f => f.address.city.toLowerCase().includes(city.toLowerCase()));
  if (vehicleType) facilities = facilities.filter(f => f.supportedVehicleTypes?.includes(vehicleType));
  if (covered === 'true') facilities = facilities.filter(f => f.amenities?.covered);
  if (evCharging === 'true') facilities = facilities.filter(f => f.amenities?.evCharging);

  const scored = facilities.map(f => {
    let score = 0; const reasons = [];
    const r = f.availableSlots / (f.totalSlots || 1);
    if (r > 0.5) { score += 30; reasons.push('Good slot availability'); }
    else if (r > 0.2) { score += 15; reasons.push('Limited slots'); }
    const p = f.pricingRules?.find(x => !vehicleType || x.vehicleType === vehicleType) || f.pricingRules?.[0];
    if (p) { const est = p.baseRate * parseFloat(duration); score += Math.max(0, 50 - est * 0.5); reasons.push(`Est. ₹${est.toFixed(0)} for ${duration}h`); }
    if (f.amenities?.covered)    { score += 10; reasons.push('Covered parking'); }
    if (f.amenities?.evCharging) { score += 8;  reasons.push('EV charging available'); }
    if (f.amenities?.security)   { score += 8;  reasons.push('Security on-site'); }
    if (f.rating >= 4)  { score += 15; reasons.push(`Rated ${f.rating}/5`); }
    return { facility: f, score, reasons: reasons.slice(0, 3) };
  });
  scored.sort((a, b) => b.score - a.score);
  res.json({ success: true, recommendations: scored.slice(0, 6) });
});
