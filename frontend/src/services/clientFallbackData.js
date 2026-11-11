// Client-side fallback data for Bengaluru & Mumbai facilities & slots
// Guarantees immediate zero-lag display even if remote serverless functions experience cold starts.

export const FALLBACK_FACILITIES = [
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

export function getFallbackSlots(facilityId) {
  const fac = FALLBACK_FACILITIES.find(f => f._id === facilityId) || FALLBACK_FACILITIES[0];
  const sections = ['A', 'B', 'C', 'D'];
  const total = fac.totalSlots || 40;
  const slots = [];
  let count = 0;
  let occupied = 0, reserved = 0;
  const targetOcc = fac.occupiedSlots || 15;
  const targetRes = fac.reservedSlots || 5;

  for (const section of sections) {
    if (count >= total) break;
    const n = Math.min(Math.ceil(total / sections.length), total - count);
    for (let i = 1; i <= n; i++) {
      let status = 'available';
      if (occupied < targetOcc) { status = 'occupied'; occupied++; }
      else if (reserved < targetRes) { status = 'reserved'; reserved++; }

      const isEV = Boolean(fac.amenities?.evCharging && section === 'A' && i <= 3);
      const isAccessible = Boolean(fac.amenities?.accessible && section === 'A' && i === 1);

      slots.push({
        _id: `${fac._id}_${section}${String(i).padStart(2, '0')}`,
        facility: fac._id,
        slotNumber: `${section}${String(i).padStart(2, '0')}`,
        section,
        floor: section === 'A' ? 1 : section === 'B' ? 2 : section === 'C' ? 3 : 4,
        slotType: isEV ? 'ev' : isAccessible ? 'accessible' : 'standard',
        supportedVehicleTypes: ['car', 'suv', 'motorcycle'],
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
