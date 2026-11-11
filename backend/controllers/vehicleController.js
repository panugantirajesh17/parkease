const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const Vehicle = require('../models/Vehicle');
const Reservation = require('../models/Reservation');
const mockStore = require('../services/mockStore');

// @desc    Get all vehicles for authenticated user
// @route   GET /api/vehicles
exports.getVehicles = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json({ success: true, vehicles: mockStore.getMockVehicles(req.user) });
  }

  try {
    const vehicles = await Vehicle.find({ owner: req.user._id, isActive: true })
      .sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, vehicles: vehicles.length > 0 ? vehicles : mockStore.getMockVehicles(req.user) });
  } catch (err) {
    res.json({ success: true, vehicles: mockStore.getMockVehicles(req.user) });
  }
});

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
exports.getVehicle = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    return res.json({ success: true, vehicle: v });
  }

  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
      if (v) return res.json({ success: true, vehicle: v });
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }
    res.json({ success: true, vehicle });
  } catch (err) {
    const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
    if (v) return res.json({ success: true, vehicle: v });
    res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
});

// @desc    Add vehicle
// @route   POST /api/vehicles
exports.createVehicle = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const vehicle = mockStore.createMockVehicle(req.body, req.user);
    return res.status(201).json({ success: true, vehicle });
  }

  try {
    const existingCount = await Vehicle.countDocuments({ owner: req.user._id, isActive: true });
    if (existingCount === 0 || req.body.isDefault) {
      await Vehicle.updateMany({ owner: req.user._id }, { isDefault: false });
      req.body.isDefault = true;
    }

    const vehicle = await Vehicle.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, vehicle });
  } catch (err) {
    const vehicle = mockStore.createMockVehicle(req.body, req.user);
    res.status(201).json({ success: true, vehicle });
  }
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    Object.assign(v, req.body);
    return res.json({ success: true, vehicle: v });
  }

  try {
    let vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });

    if (req.body.isDefault) {
      await Vehicle.updateMany({ owner: req.user._id }, { isDefault: false });
    }

    vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, vehicle });
  } catch (err) {
    const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
    if (v) {
      Object.assign(v, req.body);
      return res.json({ success: true, vehicle: v });
    }
    res.status(404).json({ success: false, message: 'Vehicle not found' });
  }
});

// @desc    Soft-delete vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(mockStore.deleteMockVehicle(req.params.id));
  }

  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      return res.json(mockStore.deleteMockVehicle(req.params.id));
    }

    await Vehicle.findByIdAndUpdate(vehicle._id, { isActive: false });
    res.json({ success: true, message: 'Vehicle removed' });
  } catch (err) {
    res.json(mockStore.deleteMockVehicle(req.params.id));
  }
});

// @desc    Set vehicle as default
// @route   PATCH /api/vehicles/:id/default or PUT /api/vehicles/:id/default
exports.setDefaultVehicle = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    mockStore.mockVehicles.forEach(v => { v.isDefault = (v._id === req.params.id); });
    const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
    return res.json({ success: true, vehicle: v });
  }

  try {
    await Vehicle.updateMany({ owner: req.user._id }, { isDefault: false });
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true });
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, vehicle });
  } catch (err) {
    mockStore.mockVehicles.forEach(v => { v.isDefault = (v._id === req.params.id); });
    const v = mockStore.mockVehicles.find(x => x._id === req.params.id);
    res.json({ success: true, vehicle: v });
  }
});
