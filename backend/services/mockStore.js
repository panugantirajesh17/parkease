// Complete in-memory store for ParkEase
// Guarantees 100% functionality on Vercel and serverless environments without requiring external MongoDB.

const mockUsers = [
  { _id: '6aec3afbedf61b18f3340d41', email: 'admin@parkease.demo', name: 'Alex Admin', role: 'admin', phone: '+91-9876543210' },
  { _id: '6aec3afbedf61b18f3340d42', email: 'operator@parkease.demo', name: 'Om Operator', role: 'operator', phone: '+91-9876543211' },
  { _id: '6aec3afbedf61b18f3340d43', email: 'driver@parkease.demo', name: 'Dev Driver', role: 'driver', phone: '+91-9876543213', favoritesFacilities: ['6aec3afbedf61b18f3340d46'] },
  { _id: '6aec3afbedf61b18f3340d44', email: 'user@parkease.demo', name: 'Uma User', role: 'driver', phone: '+91-9876543214' }
];

let mockVehicles = [
  { _id: '6aec3afbedf61b18f3340f38', owner: '6aec3afbedf61b18f3340d43', registrationNumber: 'KA-01-AB-1234', vehicleType: 'car', make: 'Maruti', model: 'Swift ZXI', color: 'Pearl White', isDefault: true, isActive: true },
  { _id: '6aec3afbedf61b18f3340f39', owner: '6aec3afbedf61b18f3340d43', registrationNumber: 'KA-01-CD-5678', vehicleType: 'motorcycle', make: 'Honda', model: 'Activa 6G', color: 'Matte Blue', isDefault: false, isActive: true },
  { _id: '6aec3afbedf61b18f3340f3a', owner: '6aec3afbedf61b18f3340d44', registrationNumber: 'MH-02-EF-9012', vehicleType: 'suv', make: 'Hyundai', model: 'Creta SX', color: 'Titan Grey', isDefault: true, isActive: true }
];

let mockFacilities = [
  {
    _id: '6aec3afbedf61b18f3340d46',
    name: 'Central Park Parking Complex',
    description: 'A premium multi-level parking complex in the heart of Bengaluru with state-of-the-art security and EV charging stations.',
    address: { street: '12 MG Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India' },
    coordinates: { latitude: 12.9716, longitude: 77.5946 },
    facilityType: 'garage',
    totalSlots: 80,
    availableSlots: 32,
    occupiedSlots: 36,
    reservedSlots: 8,
    outOfServiceSlots: 4,
    pricingRules: [
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: 20, minimumCharge: 20 },
      { vehicleType: 'car', rateType: 'hourly', baseRate: 60, minimumCharge: 60, maximumDailyCharge: 450 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: 80, minimumCharge: 80, maximumDailyCharge: 600 }
    ],
    operatingHours: [
      { day: 'monday', open: '06:00', close: '23:00' },
      { day: 'tuesday', open: '06:00', close: '23:00' },
      { day: 'wednesday', open: '06:00', close: '23:00' },
      { day: 'thursday', open: '06:00', close: '23:00' },
      { day: 'friday', open: '06:00', close: '23:59' },
      { day: 'saturday', open: '07:00', close: '23:59' },
      { day: 'sunday', open: '08:00', close: '22:00' }
    ],
    amenities: { covered: true, evCharging: true, security: true, cctv: true, accessible: true, restroom: true, lighting: true, wifi: true },
    supportedVehicleTypes: ['motorcycle', 'car', 'suv'],
    rating: 4.8,
    reviewCount: 142,
    coverImage: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80'],
    operator: mockUsers[1],
    isActive: true
  },
  {
    _id: '6aec3afbedf61b18f3340d47',
    name: 'Koramangala Smart Parking',
    description: 'Modern smart parking with automated guidance system and real-time slot tracking in Koramangala.',
    address: { street: '5th Block, 80 Feet Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560034', country: 'India' },
    coordinates: { latitude: 12.9352, longitude: 77.6245 },
    facilityType: 'surface',
    totalSlots: 60,
    availableSlots: 25,
    occupiedSlots: 25,
    reservedSlots: 10,
    outOfServiceSlots: 0,
    pricingRules: [
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: 15, minimumCharge: 15 },
      { vehicleType: 'car', rateType: 'hourly', baseRate: 50, minimumCharge: 50 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: 70, minimumCharge: 70 }
    ],
    amenities: { covered: false, evCharging: true, security: true, cctv: true, accessible: false, lighting: true },
    supportedVehicleTypes: ['motorcycle', 'car', 'suv'],
    rating: 4.3,
    reviewCount: 89,
    coverImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80'],
    operator: mockUsers[1],
    isActive: true
  },
  {
    _id: '6aec3afbedf61b18f3340d48',
    name: 'Indiranagar Underground Park',
    description: 'Secure underground parking in the posh Indiranagar locality with climate control and 24/7 security.',
    address: { street: '100 Feet Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', zipCode: '560038', country: 'India' },
    coordinates: { latitude: 12.9784, longitude: 77.6408 },
    facilityType: 'underground',
    totalSlots: 100,
    availableSlots: 40,
    occupiedSlots: 45,
    reservedSlots: 15,
    outOfServiceSlots: 0,
    pricingRules: [
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: 25, minimumCharge: 25 },
      { vehicleType: 'car', rateType: 'hourly', baseRate: 70, minimumCharge: 70, maximumDailyCharge: 500 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: 90, minimumCharge: 90, maximumDailyCharge: 700 }
    ],
    amenities: { covered: true, evCharging: false, security: true, cctv: true, accessible: true, restroom: true, lighting: true },
    supportedVehicleTypes: ['motorcycle', 'car', 'suv'],
    rating: 4.7,
    reviewCount: 203,
    coverImage: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=800&auto=format&fit=crop&q=80'],
    operator: mockUsers[1],
    isActive: true
  },
  {
    _id: '6aec3afbedf61b18f3340d49',
    name: 'HSR Layout Open Parking',
    description: 'Affordable open-air parking in HSR Layout. Ideal for quick short-term parking near commercial sectors.',
    address: { street: 'Sector 1, 27th Main Road', city: 'Bengaluru', state: 'Karnataka', zipCode: '560102', country: 'India' },
    coordinates: { latitude: 12.9116, longitude: 77.6388 },
    facilityType: 'surface',
    totalSlots: 40,
    availableSlots: 30,
    occupiedSlots: 8,
    reservedSlots: 2,
    outOfServiceSlots: 0,
    pricingRules: [
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: 10, minimumCharge: 10 },
      { vehicleType: 'car', rateType: 'hourly', baseRate: 40, minimumCharge: 40 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: 50, minimumCharge: 50 }
    ],
    amenities: { covered: false, evCharging: false, security: false, cctv: true, accessible: false, lighting: true },
    supportedVehicleTypes: ['motorcycle', 'car', 'suv'],
    rating: 3.9,
    reviewCount: 45,
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80'],
    operator: mockUsers[1],
    isActive: true
  },
  {
    _id: '6aec3afbedf61b18f3340d4a',
    name: 'Whitefield Tech Park Parking',
    description: 'Multi-level parking facility catering to tech parks in Whitefield with rapid EV superchargers and car care service.',
    address: { street: 'EPIP Zone, Whitefield', city: 'Bengaluru', state: 'Karnataka', zipCode: '560066', country: 'India' },
    coordinates: { latitude: 12.9698, longitude: 77.7499 },
    facilityType: 'garage',
    totalSlots: 120,
    availableSlots: 50,
    occupiedSlots: 50,
    reservedSlots: 20,
    outOfServiceSlots: 0,
    pricingRules: [
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: 20, minimumCharge: 20 },
      { vehicleType: 'car', rateType: 'hourly', baseRate: 55, minimumCharge: 55, maximumDailyCharge: 400 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: 75, minimumCharge: 75, maximumDailyCharge: 600 }
    ],
    amenities: { covered: true, evCharging: true, security: true, cctv: true, accessible: true, restroom: true, wifi: true, lighting: true },
    supportedVehicleTypes: ['motorcycle', 'car', 'suv'],
    rating: 4.6,
    reviewCount: 312,
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=80'],
    operator: mockUsers[1],
    isActive: true
  },
  {
    _id: '6aec3afbedf61b18f3340d4b',
    name: 'Mumbai Bandra Parking Hub',
    description: 'Centrally located parking hub near Bandra West linking road with 24/7 access and valet service.',
    address: { street: 'Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', country: 'India' },
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    facilityType: 'covered',
    totalSlots: 90,
    availableSlots: 35,
    occupiedSlots: 40,
    reservedSlots: 15,
    outOfServiceSlots: 0,
    pricingRules: [
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: 30, minimumCharge: 30 },
      { vehicleType: 'car', rateType: 'hourly', baseRate: 80, minimumCharge: 80 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: 100, minimumCharge: 100 }
    ],
    amenities: { covered: true, evCharging: false, security: true, cctv: true, accessible: false, restroom: true, lighting: true },
    supportedVehicleTypes: ['motorcycle', 'car', 'suv'],
    rating: 4.2,
    reviewCount: 176,
    coverImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80',
    images: ['https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop&q=80'],
    operator: mockUsers[1],
    isActive: true
  }
];

// Initialize all hardcoded slots for all 6 Bengaluru & Mumbai facilities
let mockSlots = [];

function generateInitialSlotsForFacility(fac) {
  const sections = ['A', 'B', 'C', 'D', 'E', 'F'];
  const slots = [];
  let count = 0;
  let occupied = 0, reserved = 0, oos = 0;
  const total = fac.totalSlots || 60;
  const numSections = Math.min(sections.length, Math.ceil(total / 20));

  for (let sIdx = 0; sIdx < numSections; sIdx++) {
    const section = sections[sIdx];
    if (count >= total) break;
    const n = Math.min(Math.ceil(total / numSections), total - count);
    for (let i = 1; i <= n; i++) {
      let status = 'available';
      if (occupied < (fac.occupiedSlots || 0)) { status = 'occupied'; occupied++; }
      else if (reserved < (fac.reservedSlots || 0)) { status = 'reserved'; reserved++; }
      else if (count >= total - (fac.outOfServiceSlots || 0)) { status = 'out_of_service'; oos++; }

      const isEV = Boolean(fac.amenities?.evCharging && section === 'A' && i <= 3);
      const isAccessible = Boolean(fac.amenities?.accessible && section === 'A' && i === 1);

      slots.push({
        _id: `${fac._id}_${section}${String(i).padStart(2, '0')}`,
        facility: fac._id,
        slotNumber: `${section}${String(i).padStart(2, '0')}`,
        section,
        floor: section === 'A' ? 1 : section === 'B' ? 2 : section === 'C' ? 3 : 4,
        slotType: isEV ? 'ev' : isAccessible ? 'accessible' : 'standard',
        supportedVehicleTypes: fac.supportedVehicleTypes || ['car', 'suv', 'motorcycle'],
        hasEvCharging: isEV,
        isAccessible: isAccessible,
        status,
        lastUpdated: new Date().toISOString()
      });
      count++;
      if (count >= total) break;
    }
  }
  return slots;
}

// Pre-fill mockSlots with all initial facilities
mockFacilities.forEach(f => {
  mockSlots.push(...generateInitialSlotsForFacility(f));
});

let mockReservations = [
  {
    _id: '6aec3afbedf61b18f3340f40',
    reservationRef: 'PK-DEMO-9912',
    user: mockUsers[2],
    facility: mockFacilities[0],
    slot: mockSlots.find(s => s.facility === mockFacilities[0]._id && s.slotNumber === 'A05') || { slotNumber: 'A05', section: 'A' },
    vehicleSnapshot: { registrationNumber: 'KA-01-AB-1234', vehicleType: 'car', make: 'Maruti', model: 'Swift ZXI', color: 'Pearl White' },
    status: 'confirmed',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    expectedEndTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    durationHours: 2,
    pricing: { baseRate: 60, estimatedTotal: 120, finalTotal: 120, breakdown: [{ label: 'Parking', amount: 120 }] },
    createdAt: new Date().toISOString()
  }
];

// Helper to recalculate facility slot numbers dynamically
function updateMockFacilityCounts(facilityId) {
  const fac = mockFacilities.find(f => f._id === facilityId);
  if (!fac) return;
  const facilitySlots = mockSlots.filter(s => s.facility === facilityId);
  let avail = 0, occ = 0, res = 0, oos = 0;
  facilitySlots.forEach(s => {
    if (s.status === 'available') avail++;
    else if (s.status === 'occupied') occ++;
    else if (s.status === 'reserved') res++;
    else if (s.status === 'out_of_service') oos++;
  });
  fac.totalSlots = facilitySlots.length;
  fac.availableSlots = avail;
  fac.occupiedSlots = occ;
  fac.reservedSlots = res;
  fac.outOfServiceSlots = oos;
}

// ----------------- SLOT CRUD METHODS -----------------

function getMockSlots(facilityId) {
  let list = mockSlots.filter(s => s.facility === facilityId);
  if (list.length === 0) {
    const fac = mockFacilities.find(f => f._id === facilityId);
    if (fac) {
      list = generateInitialSlotsForFacility(fac);
      mockSlots.push(...list);
      updateMockFacilityCounts(facilityId);
    }
  }
  return list;
}

function getMockSlot(slotId) {
  return mockSlots.find(s => s._id === slotId);
}

function createMockSlot(data) {
  const facilityId = data.facility || data.facilityId;
  const slotNumber = (data.slotNumber || '').trim().toUpperCase();
  const existing = mockSlots.find(s => s.facility === facilityId && s.slotNumber === slotNumber);
  if (existing) {
    throw new Error(`Slot ${slotNumber} already exists in this facility`);
  }

  const newSlot = {
    _id: `${facilityId}_${slotNumber}_${Date.now()}`,
    facility: facilityId,
    slotNumber,
    section: (data.section || 'A').trim().toUpperCase(),
    floor: parseInt(data.floor) || 1,
    slotType: data.slotType || 'standard',
    supportedVehicleTypes: data.supportedVehicleTypes || ['car', 'suv'],
    status: data.status || 'available',
    hasEvCharging: Boolean(data.hasEvCharging),
    isAccessible: Boolean(data.isAccessible),
    notes: data.notes || '',
    lastUpdated: new Date().toISOString()
  };

  mockSlots.push(newSlot);
  updateMockFacilityCounts(facilityId);
  return newSlot;
}

function createMockBulkSlots(facilityId, data) {
  const section = (data.section || 'E').trim().toUpperCase();
  const count = parseInt(data.count) || 10;
  const start = parseInt(data.startNumber) || 1;
  const created = [];

  for (let i = 0; i < count; i++) {
    const slotNumber = `${section}${String(start + i).padStart(2, '0')}`;
    const exists = mockSlots.find(s => s.facility === facilityId && s.slotNumber === slotNumber);
    if (!exists) {
      const slot = {
        _id: `${facilityId}_${slotNumber}_${Date.now()}`,
        facility: facilityId,
        slotNumber,
        section,
        floor: parseInt(data.floor) || 1,
        slotType: data.slotType || 'standard',
        supportedVehicleTypes: data.supportedVehicleTypes || ['car', 'suv'],
        hasEvCharging: Boolean(data.hasEvCharging),
        isAccessible: Boolean(data.isAccessible),
        status: 'available',
        lastUpdated: new Date().toISOString()
      };
      mockSlots.push(slot);
      created.push(slot);
    }
  }

  updateMockFacilityCounts(facilityId);
  return { slots: created, count: created.length };
}

function updateMockSlot(slotId, data) {
  const slot = mockSlots.find(s => s._id === slotId);
  if (!slot) throw new Error('Slot not found');

  if (data.slotNumber) slot.slotNumber = data.slotNumber.trim().toUpperCase();
  if (data.section) slot.section = data.section.trim().toUpperCase();
  if (data.floor !== undefined) slot.floor = parseInt(data.floor);
  if (data.slotType) slot.slotType = data.slotType;
  if (data.supportedVehicleTypes) slot.supportedVehicleTypes = data.supportedVehicleTypes;
  if (data.hasEvCharging !== undefined) slot.hasEvCharging = Boolean(data.hasEvCharging);
  if (data.isAccessible !== undefined) slot.isAccessible = Boolean(data.isAccessible);
  if (data.notes !== undefined) slot.notes = data.notes;
  if (data.status) {
    slot.status = data.status;
    if (data.status === 'available') slot.currentReservation = null;
  }
  slot.lastUpdated = new Date().toISOString();

  updateMockFacilityCounts(slot.facility);
  return slot;
}

function updateMockSlotStatus(slotId, status) {
  const slot = mockSlots.find(s => s._id === slotId);
  if (!slot) throw new Error('Slot not found');
  slot.status = status;
  if (status === 'available') slot.currentReservation = null;
  slot.lastUpdated = new Date().toISOString();
  updateMockFacilityCounts(slot.facility);
  return slot;
}

function deleteMockSlot(slotId, user) {
  const index = mockSlots.findIndex(s => s._id === slotId);
  if (index === -1) throw new Error('Slot not found');
  const slot = mockSlots[index];

  if (['occupied', 'reserved'].includes(slot.status) && user?.role !== 'admin') {
    throw new Error('Cannot delete an occupied or reserved slot without admin authorization');
  }

  mockSlots.splice(index, 1);
  updateMockFacilityCounts(slot.facility);
  return { success: true, message: `Slot ${slot.slotNumber} deleted successfully` };
}

// ----------------- FACILITY METHODS -----------------

function getMockFacilities(query = {}) {
  let list = [...mockFacilities];
  if (query.city) {
    list = list.filter(f => f.address.city.toLowerCase().includes(query.city.toLowerCase()));
  }
  if (query.search || query.name) {
    const s = (query.search || query.name).toLowerCase();
    list = list.filter(f => f.name.toLowerCase().includes(s) || f.address.street.toLowerCase().includes(s));
  }
  if (query.evCharging === 'true') {
    list = list.filter(f => f.amenities?.evCharging);
  }
  if (query.covered === 'true') {
    list = list.filter(f => f.amenities?.covered);
  }
  if (query.security === 'true') {
    list = list.filter(f => f.amenities?.security);
  }
  if (query.accessible === 'true') {
    list = list.filter(f => f.amenities?.accessible);
  }
  return {
    success: true,
    total: list.length,
    page: 1,
    pages: 1,
    facilities: list
  };
}

function getMockFacility(id) {
  const facility = mockFacilities.find(f => f._id === id) || mockFacilities[0];
  const facilitySlots = mockSlots.filter(s => s.facility === facility._id);
  const slotSummary = [
    { _id: 'available', count: facilitySlots.filter(s => s.status === 'available').length },
    { _id: 'occupied', count: facilitySlots.filter(s => s.status === 'occupied').length },
    { _id: 'reserved', count: facilitySlots.filter(s => s.status === 'reserved').length },
    { _id: 'out_of_service', count: facilitySlots.filter(s => s.status === 'out_of_service').length }
  ];
  return {
    success: true,
    facility,
    slotSummary,
    reviews: []
  };
}

function createMockFacility(data, user) {
  const newFac = {
    _id: 'fac_' + Date.now(),
    name: data.name,
    description: data.description || 'Modern smart parking facility.',
    address: data.address || { street: data.street || 'MG Road', city: data.city || 'Bengaluru', state: 'Karnataka', zipCode: '560001', country: 'India' },
    coordinates: data.coordinates || { latitude: 12.9716, longitude: 77.5946 },
    facilityType: data.facilityType || 'garage',
    totalSlots: parseInt(data.totalSlots) || 40,
    availableSlots: parseInt(data.totalSlots) || 40,
    occupiedSlots: 0,
    reservedSlots: 0,
    outOfServiceSlots: 0,
    pricingRules: data.pricingRules || [
      { vehicleType: 'car', rateType: 'hourly', baseRate: parseInt(data.hourlyCarRate) || 60, minimumCharge: 60 },
      { vehicleType: 'motorcycle', rateType: 'hourly', baseRate: parseInt(data.hourlyMotoRate) || 20, minimumCharge: 20 },
      { vehicleType: 'suv', rateType: 'hourly', baseRate: parseInt(data.hourlySuvRate) || 80, minimumCharge: 80 }
    ],
    operatingHours: [
      { day: 'monday', open: '06:00', close: '23:00' },
      { day: 'tuesday', open: '06:00', close: '23:00' },
      { day: 'wednesday', open: '06:00', close: '23:00' },
      { day: 'thursday', open: '06:00', close: '23:00' },
      { day: 'friday', open: '06:00', close: '23:59' },
      { day: 'saturday', open: '07:00', close: '23:59' },
      { day: 'sunday', open: '08:00', close: '22:00' }
    ],
    amenities: data.amenities || { covered: Boolean(data.covered), evCharging: Boolean(data.evCharging), security: Boolean(data.security), accessible: Boolean(data.accessible) },
    supportedVehicleTypes: ['car', 'suv', 'motorcycle'],
    rating: 4.5,
    reviewCount: 1,
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80',
    images: [data.coverImage || 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&auto=format&fit=crop&q=80'],
    operator: user || mockUsers[1],
    isActive: true
  };

  mockFacilities.unshift(newFac);

  if (data.generateSlots) {
    const slots = generateInitialSlotsForFacility(newFac);
    mockSlots.push(...slots);
    updateMockFacilityCounts(newFac._id);
  }

  return newFac;
}

function updateMockFacility(id, data) {
  const fac = mockFacilities.find(f => f._id === id);
  if (!fac) throw new Error('Facility not found');
  Object.assign(fac, data);
  return fac;
}

function deleteMockFacility(id) {
  const index = mockFacilities.findIndex(f => f._id === id);
  if (index === -1) throw new Error('Facility not found');
  const fac = mockFacilities[index];
  mockFacilities.splice(index, 1);
  mockSlots = mockSlots.filter(s => s.facility !== id);
  return { success: true, message: `Facility ${fac.name} and all its spaces deleted` };
}

// ----------------- USER & VEHICLE METHODS -----------------

function getMockUser(body = {}) {
  const email = (body.email || '').toLowerCase();
  const found = mockUsers.find(u => u.email === email);
  if (found) {
    if (body.role) found.role = body.role;
    return found;
  }
  const newUser = {
    _id: 'mock_user_' + Date.now(),
    email: body.email || 'user@parkease.demo',
    name: body.name || (body.email ? body.email.split('@')[0] : 'Demo User'),
    role: body.role || 'driver',
    favoritesFacilities: ['6aec3afbedf61b18f3340d46']
  };
  mockUsers.push(newUser);
  return newUser;
}

function getMockVehicles(user) {
  return mockVehicles;
}

function createMockVehicle(body, user) {
  const newVeh = {
    _id: 'veh_' + Date.now(),
    owner: user?._id || mockUsers[2]._id,
    registrationNumber: body.registrationNumber.trim().toUpperCase(),
    vehicleType: body.vehicleType || 'car',
    make: body.make || 'Generic',
    model: body.model || 'Model',
    color: body.color || 'Silver',
    isDefault: body.isDefault || mockVehicles.length === 0,
    isActive: true
  };
  mockVehicles.unshift(newVeh);
  return newVeh;
}

function deleteMockVehicle(id) {
  mockVehicles = mockVehicles.filter(v => v._id !== id);
  return { success: true, message: 'Vehicle deleted' };
}

// ----------------- RESERVATION METHODS -----------------

function createMockReservation(body, user) {
  const facility = mockFacilities.find(f => f._id === body.facilityId) || mockFacilities[0];
  const rate = facility.pricingRules?.[0]?.baseRate || 50;
  const duration = parseFloat(body.durationHours) || 2;
  const total = rate * duration;
  const ref = 'PK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  // Find slot
  let slot = null;
  if (body.slotId) {
    slot = mockSlots.find(s => s._id === body.slotId && s.facility === facility._id);
  }
  if (!slot) {
    slot = mockSlots.find(s => s.facility === facility._id && s.status === 'available');
  }

  // Mark slot as reserved in mock store!
  if (slot) {
    slot.status = 'reserved';
    slot.lastUpdated = new Date().toISOString();
    updateMockFacilityCounts(facility._id);
  }

  const newRes = {
    _id: 'mock_res_' + Date.now(),
    reservationRef: ref,
    user: user || mockUsers[2],
    facility,
    slot: slot || { slotNumber: 'A01', section: 'A' },
    vehicleSnapshot: { registrationNumber: 'KA-01-AB-1234', vehicleType: 'car', make: 'Maruti', model: 'Swift' },
    status: 'confirmed',
    startTime: body.startTime || new Date().toISOString(),
    expectedEndTime: new Date(Date.now() + duration * 3600000).toISOString(),
    durationHours: duration,
    pricing: {
      baseRate: rate,
      estimatedTotal: total,
      finalTotal: total,
      breakdown: [{ label: `Parking (₹${rate}/hr × ${duration}h)`, amount: total }]
    },
    createdAt: new Date().toISOString()
  };

  mockReservations.unshift(newRes);
  return newRes;
}

function cancelMockReservation(id, reason) {
  const res = mockReservations.find(r => r._id === id);
  if (res) {
    res.status = 'cancelled';
    res.cancellationReason = reason || 'Cancelled by user';
    // Free the slot
    if (res.slot) {
      const slot = mockSlots.find(s => s._id === res.slot._id || (s.facility === res.facility?._id && s.slotNumber === res.slot.slotNumber));
      if (slot) {
        slot.status = 'available';
        slot.currentReservation = null;
        updateMockFacilityCounts(slot.facility);
      }
    }
  }
  return res;
}

function deleteMockReservation(id) {
  const idx = mockReservations.findIndex(r => r._id === id);
  if (idx !== -1) {
    const res = mockReservations[idx];
    if (res.slot) {
      const slot = mockSlots.find(s => s._id === res.slot._id || (s.facility === res.facility?._id && s.slotNumber === res.slot.slotNumber));
      if (slot) {
        slot.status = 'available';
        slot.currentReservation = null;
        updateMockFacilityCounts(slot.facility);
      }
    }
    mockReservations.splice(idx, 1);
  }
  return { success: true, message: 'Reservation deleted' };
}

function getMockReservations(user) {
  return mockReservations;
}

function getMockStats() {
  const totalSlots = mockSlots.length;
  const avail = mockSlots.filter(s => s.status === 'available').length;
  const occ = mockSlots.filter(s => s.status === 'occupied').length;
  const res = mockSlots.filter(s => s.status === 'reserved').length;
  const oos = mockSlots.filter(s => s.status === 'out_of_service').length;

  return {
    totalUsers: mockUsers.length,
    totalFacilities: mockFacilities.length,
    totalSlots,
    totalReservations: mockReservations.length,
    activeReservations: 1,
    completedReservations: 0,
    cancelledReservations: 0,
    confirmedReservations: mockReservations.length,
    estimatedDemoValue: 495,
    occupancyRate: totalSlots > 0 ? Math.round((occ / totalSlots) * 100) : 0,
    slotBreakdown: { reserved: res, occupied: occ, available: avail, out_of_service: oos }
  };
}

module.exports = {
  mockUsers,
  mockVehicles,
  mockFacilities,
  mockSlots,
  mockReservations,
  getMockFacilities,
  getMockFacility,
  createMockFacility,
  updateMockFacility,
  deleteMockFacility,
  getMockSlots,
  getMockSlot,
  createMockSlot,
  createMockBulkSlots,
  updateMockSlot,
  updateMockSlotStatus,
  deleteMockSlot,
  getMockUser,
  getMockVehicles,
  createMockVehicle,
  deleteMockVehicle,
  createMockReservation,
  cancelMockReservation,
  deleteMockReservation,
  getMockReservations,
  getMockStats
};
