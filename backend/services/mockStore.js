// In-memory mock store for robust execution in serverless environments (e.g. Vercel)
// when external MongoDB connection is not configured or during cold-starts.

const mockUsers = [
  { _id: '6aec3afbedf61b18f3340d41', email: 'admin@parkease.demo', name: 'Alex Admin', role: 'admin', phone: '+91-9876543210' },
  { _id: '6aec3afbedf61b18f3340d42', email: 'operator@parkease.demo', name: 'Om Operator', role: 'operator', phone: '+91-9876543211' },
  { _id: '6aec3afbedf61b18f3340d43', email: 'driver@parkease.demo', name: 'Dev Driver', role: 'driver', phone: '+91-9876543213', favoritesFacilities: ['6aec3afbedf61b18f3340d46'] },
  { _id: '6aec3afbedf61b18f3340d44', email: 'user@parkease.demo', name: 'Uma User', role: 'driver', phone: '+91-9876543214' }
];

const mockVehicles = [
  { _id: '6aec3afbedf61b18f3340f38', owner: '6aec3afbedf61b18f3340d43', registrationNumber: 'KA-01-AB-1234', vehicleType: 'car', make: 'Maruti', model: 'Swift ZXI', color: 'Pearl White', isDefault: true, isActive: true },
  { _id: '6aec3afbedf61b18f3340f39', owner: '6aec3afbedf61b18f3340d43', registrationNumber: 'KA-01-CD-5678', vehicleType: 'motorcycle', make: 'Honda', model: 'Activa 6G', color: 'Matte Blue', isDefault: false, isActive: true },
  { _id: '6aec3afbedf61b18f3340f3a', owner: '6aec3afbedf61b18f3340d44', registrationNumber: 'MH-02-EF-9012', vehicleType: 'suv', make: 'Hyundai', model: 'Creta SX', color: 'Titan Grey', isDefault: true, isActive: true }
];

const mockFacilities = [
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
    isActive: true
  }
];

let mockReservations = [
  {
    _id: '6aec3afbedf61b18f3340f40',
    reservationRef: 'PK-DEMO-9912',
    user: mockUsers[2],
    facility: mockFacilities[0],
    slot: { slotNumber: 'A05', section: 'A' },
    vehicleSnapshot: { registrationNumber: 'KA-01-AB-1234', vehicleType: 'car', make: 'Maruti', model: 'Swift ZXI', color: 'Pearl White' },
    status: 'confirmed',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    expectedEndTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    durationHours: 2,
    pricing: { baseRate: 60, estimatedTotal: 120, finalTotal: 120, breakdown: [{ label: 'Parking', amount: 120 }] },
    createdAt: new Date().toISOString()
  }
];

// Helper to filter mock facilities
function getMockFacilities(query = {}) {
  let list = [...mockFacilities];
  if (query.city) {
    list = list.filter(f => f.address.city.toLowerCase().includes(query.city.toLowerCase()));
  }
  if (query.search) {
    const s = query.search.toLowerCase();
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
  const slotSummary = [
    { _id: 'available', count: facility.availableSlots || 20 },
    { _id: 'occupied', count: facility.occupiedSlots || 20 },
    { _id: 'reserved', count: facility.reservedSlots || 5 }
  ];
  return {
    success: true,
    facility,
    slotSummary,
    reviews: []
  };
}

function getMockSlots(facilityId) {
  const fac = mockFacilities.find(f => f._id === facilityId) || mockFacilities[0];
  const total = fac.totalSlots || 40;
  const sections = ['A', 'B', 'C', 'D'];
  const slots = [];
  let count = 0;
  let occupied = 0, reserved = 0;
  const targetOccupied = fac.occupiedSlots || Math.floor(total * 0.4);
  const targetReserved = fac.reservedSlots || Math.floor(total * 0.15);

  for (const section of sections) {
    if (count >= total) break;
    const n = Math.min(Math.ceil(total / sections.length), total - count);
    for (let i = 1; i <= n; i++) {
      let status = 'available';
      if (occupied < targetOccupied) { status = 'occupied'; occupied++; }
      else if (reserved < targetReserved) { status = 'reserved'; reserved++; }
      else if (count >= total - (fac.outOfServiceSlots || 0)) { status = 'out_of_service'; }

      const isEV = Boolean(fac.amenities?.evCharging && section === 'A' && i <= 3);
      const isAccessible = Boolean(fac.amenities?.accessible && section === 'A' && i === 1);

      slots.push({
        _id: `${fac._id}_${section}${i}`,
        facility: fac._id,
        slotNumber: `${section}${String(i).padStart(2, '0')}`,
        section,
        floor: section === 'A' ? 1 : section === 'B' ? 2 : section === 'C' ? 3 : 4,
        slotType: isEV ? 'ev' : isAccessible ? 'accessible' : 'standard',
        supportedVehicleTypes: fac.supportedVehicleTypes || ['car', 'suv', 'motorcycle'],
        hasEvCharging: isEV,
        isAccessible: isAccessible,
        status
      });
      count++;
      if (count >= total) break;
    }
  }
  return slots;
}

function getMockUser(body = {}) {
  const email = (body.email || '').toLowerCase();
  const found = mockUsers.find(u => u.email === email);
  if (found) return found;
  return {
    _id: 'mock_user_' + Date.now(),
    email: body.email || 'user@parkease.demo',
    name: body.name || 'Demo User',
    role: body.role || 'driver',
    favoritesFacilities: []
  };
}

function getMockVehicles(user) {
  return mockVehicles;
}

function createMockReservation(body, user) {
  const facility = mockFacilities.find(f => f._id === body.facilityId) || mockFacilities[0];
  const rate = facility.pricingRules?.[0]?.baseRate || 50;
  const duration = parseFloat(body.durationHours) || 2;
  const total = rate * duration;
  const ref = 'PK-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const newRes = {
    _id: 'mock_res_' + Date.now(),
    reservationRef: ref,
    user: user || mockUsers[2],
    facility,
    slot: { slotNumber: 'A03', section: 'A' },
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

function getMockReservations(user) {
  return mockReservations;
}

function getMockStats() {
  return {
    totalUsers: mockUsers.length,
    totalFacilities: mockFacilities.length,
    totalSlots: 490,
    totalReservations: mockReservations.length,
    activeReservations: 1,
    completedReservations: 0,
    cancelledReservations: 0,
    confirmedReservations: mockReservations.length,
    estimatedDemoValue: 495,
    occupancyRate: 42,
    slotBreakdown: { reserved: 50, occupied: 190, available: 250, out_of_service: 4 }
  };
}

module.exports = {
  mockUsers,
  mockVehicles,
  mockFacilities,
  getMockFacilities,
  getMockFacility,
  getMockSlots,
  getMockUser,
  getMockVehicles,
  createMockReservation,
  getMockReservations,
  getMockStats
};
