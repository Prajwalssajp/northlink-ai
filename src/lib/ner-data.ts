import { 
  District, 
  RoadSegment, 
  Incident, 
  Route, 
  Vehicle, 
  Shipment, 
  Alert, 
  User, 
  FieldReport,
  RouteRiskAssessment
} from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Dr. Anurag Sharma',
    email: 'admin@northlink.gov.in',
    role: 'ADMIN',
    preferredLanguage: 'en',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_logistics',
    name: 'Priyanka Borah',
    email: 'logistics@northlink.gov.in',
    role: 'LOGISTICS_MANAGER',
    preferredLanguage: 'en',
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_field',
    name: 'Tenzing Lepcha',
    email: 'field.officer@northlink.gov.in',
    role: 'FIELD_OFFICER',
    preferredLanguage: 'en',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_driver',
    name: 'Rameshwar Sangma',
    email: 'driver@northlink.gov.in',
    role: 'DRIVER',
    preferredLanguage: 'en',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'usr_viewer',
    name: 'Public Disaster Monitor',
    email: 'viewer@northlink.gov.in',
    role: 'VIEWER',
    preferredLanguage: 'en',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_DISTRICTS: District[] = [
  // Assam
  { id: 'dist_kamrup', name: 'Kamrup Metropolitan (Guwahati)', state: 'Assam', districtCode: 'AS-KM', latitude: 26.1445, longitude: 91.7362, createdAt: new Date().toISOString() },
  { id: 'dist_cachar', name: 'Cachar (Silchar)', state: 'Assam', districtCode: 'AS-CA', latitude: 24.8333, longitude: 92.7789, createdAt: new Date().toISOString() },
  { id: 'dist_dibrugarh', name: 'Dibrugarh', state: 'Assam', districtCode: 'AS-DI', latitude: 27.4728, longitude: 94.9120, createdAt: new Date().toISOString() },
  { id: 'dist_jorhat', name: 'Jorhat', state: 'Assam', districtCode: 'AS-JO', latitude: 26.7509, longitude: 94.2037, createdAt: new Date().toISOString() },
  { id: 'dist_dima_hasao', name: 'Dima Hasao (Haflong)', state: 'Assam', districtCode: 'AS-DH', latitude: 25.1833, longitude: 93.0167, createdAt: new Date().toISOString() },

  // Meghalaya
  { id: 'dist_east_khasi', name: 'East Khasi Hills (Shillong)', state: 'Meghalaya', districtCode: 'ML-EK', latitude: 25.5788, longitude: 91.8933, createdAt: new Date().toISOString() },
  { id: 'dist_east_jaintia', name: 'East Jaintia Hills (Khliehriat)', state: 'Meghalaya', districtCode: 'ML-EJ', latitude: 25.3500, longitude: 92.3667, createdAt: new Date().toISOString() },
  { id: 'dist_west_garo', name: 'West Garo Hills (Tura)', state: 'Meghalaya', districtCode: 'ML-WG', latitude: 25.5144, longitude: 90.2033, createdAt: new Date().toISOString() },

  // Manipur
  { id: 'dist_imphal_west', name: 'Imphal West', state: 'Manipur', districtCode: 'MN-IW', latitude: 24.8170, longitude: 93.9368, createdAt: new Date().toISOString() },
  { id: 'dist_senapati', name: 'Senapati', state: 'Manipur', districtCode: 'MN-SE', latitude: 25.2667, longitude: 94.0167, createdAt: new Date().toISOString() },
  { id: 'dist_churachandpur', name: 'Churachandpur', state: 'Manipur', districtCode: 'MN-CC', latitude: 24.3333, longitude: 93.6833, createdAt: new Date().toISOString() },

  // Mizoram
  { id: 'dist_aizawl', name: 'Aizawl', state: 'Mizoram', districtCode: 'MZ-AZ', latitude: 23.7271, longitude: 92.7176, createdAt: new Date().toISOString() },
  { id: 'dist_kolasib', name: 'Kolasib', state: 'Mizoram', districtCode: 'MZ-KO', latitude: 24.2247, longitude: 92.6781, createdAt: new Date().toISOString() },

  // Nagaland
  { id: 'dist_kohima', name: 'Kohima', state: 'Nagaland', districtCode: 'NL-KO', latitude: 25.6751, longitude: 94.1086, createdAt: new Date().toISOString() },
  { id: 'dist_dimapur', name: 'Dimapur', state: 'Nagaland', districtCode: 'NL-DI', latitude: 25.9068, longitude: 93.7271, createdAt: new Date().toISOString() },

  // Tripura
  { id: 'dist_west_tripura', name: 'West Tripura (Agartala)', state: 'Tripura', districtCode: 'TR-WT', latitude: 23.8315, longitude: 91.2868, createdAt: new Date().toISOString() },
  { id: 'dist_dhalai', name: 'Dhalai (Ambassa)', state: 'Tripura', districtCode: 'TR-DH', latitude: 23.9167, longitude: 91.8500, createdAt: new Date().toISOString() },

  // Arunachal Pradesh
  { id: 'dist_papum_pare', name: 'Papum Pare (Itanagar)', state: 'Arunachal Pradesh', districtCode: 'AR-PP', latitude: 27.0844, longitude: 93.6053, createdAt: new Date().toISOString() },
  { id: 'dist_tawang', name: 'Tawang', state: 'Arunachal Pradesh', districtCode: 'AR-TA', latitude: 27.5861, longitude: 91.8594, createdAt: new Date().toISOString() },

  // Sikkim
  { id: 'dist_east_sikkim', name: 'East Sikkim (Gangtok)', state: 'Sikkim', districtCode: 'SK-ES', latitude: 27.3389, longitude: 88.6065, createdAt: new Date().toISOString() },
  { id: 'dist_north_sikkim', name: 'North Sikkim (Mangan)', state: 'Sikkim', districtCode: 'SK-NS', latitude: 27.5100, longitude: 88.5300, createdAt: new Date().toISOString() }
];

export const INITIAL_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'seg_nh6_sonapur',
    name: 'NH-6 Sonapur Tunnel & Khliehriat Ghat',
    highwayNumber: 'NH-6',
    source: 'Shillong (Meghalaya)',
    destination: 'Silchar (Assam)',
    roadType: 'Mountain Highway Corridor',
    accessibilityStatus: 'CRITICAL_RISK',
    riskLevel: 'CRITICAL',
    averageTravelTime: 360,
    coordinatesGeoJson: JSON.stringify([
      [25.5788, 91.8933],
      [25.4600, 92.1500],
      [25.3500, 92.3667],
      [25.1200, 92.4800],
      [24.8333, 92.7789]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh27_guwahati_nagaon',
    name: 'NH-27 East-West Expressway (Guwahati to Nagaon)',
    highwayNumber: 'NH-27',
    source: 'Guwahati (Kamrup)',
    destination: 'Nagaon / Kaziranga',
    roadType: '4-Lane National Highway',
    accessibilityStatus: 'OPEN',
    riskLevel: 'LOW',
    averageTravelTime: 120,
    coordinatesGeoJson: JSON.stringify([
      [26.1445, 91.7362],
      [26.1800, 92.0500],
      [26.2400, 92.4000],
      [26.3450, 92.6840]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh27_haflong_silchar',
    name: 'NH-27 Mahur - Jatinga - Silchar Hill Section',
    highwayNumber: 'NH-27',
    source: 'Lumding / Haflong',
    destination: 'Silchar',
    roadType: 'Hill Highway Corridor (Alternative Bypass to NH-6)',
    accessibilityStatus: 'RESTRICTED',
    riskLevel: 'MEDIUM',
    averageTravelTime: 280,
    coordinatesGeoJson: JSON.stringify([
      [25.7500, 93.1700],
      [25.1833, 93.0167],
      [25.0200, 92.9000],
      [24.8333, 92.7789]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh2_dimapur_kohima',
    name: 'NH-2 Phesama - Kohima Hill Corridor',
    highwayNumber: 'NH-2',
    source: 'Dimapur',
    destination: 'Kohima',
    roadType: 'Highland Mountain Road',
    accessibilityStatus: 'RESTRICTED',
    riskLevel: 'HIGH',
    averageTravelTime: 150,
    coordinatesGeoJson: JSON.stringify([
      [25.9068, 93.7271],
      [25.7800, 93.9200],
      [25.6751, 94.1086]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh10_sevoke_gangtok',
    name: 'NH-10 Sevoke Coronation Bridge to Teesta & Rangpo',
    highwayNumber: 'NH-10',
    source: 'Siliguri / Sevoke',
    destination: 'Gangtok',
    roadType: 'Teesta River Valley Hill Pass',
    accessibilityStatus: 'BLOCKED',
    riskLevel: 'CRITICAL',
    averageTravelTime: 300,
    coordinatesGeoJson: JSON.stringify([
      [26.8800, 88.4700],
      [27.0500, 88.4300],
      [27.1700, 88.5200],
      [27.3389, 88.6065]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh102_imphal_moreh',
    name: 'NH-102 Asian Highway 1 (Imphal to Moreh Border)',
    highwayNumber: 'NH-102',
    source: 'Imphal',
    destination: 'Moreh Border',
    roadType: 'Strategic Trade Corridor',
    accessibilityStatus: 'OPEN',
    riskLevel: 'LOW',
    averageTravelTime: 180,
    coordinatesGeoJson: JSON.stringify([
      [24.8170, 93.9368],
      [24.5000, 94.0200],
      [24.2500, 94.3000]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh306_silchar_aizawl',
    name: 'NH-306 Vairengte - Kolasib - Aizawl Spine',
    highwayNumber: 'NH-306',
    source: 'Silchar',
    destination: 'Aizawl',
    roadType: 'Mountain Spine Lifeline',
    accessibilityStatus: 'RESTRICTED',
    riskLevel: 'MEDIUM',
    averageTravelTime: 240,
    coordinatesGeoJson: JSON.stringify([
      [24.8333, 92.7789],
      [24.4500, 92.7300],
      [24.2247, 92.6781],
      [23.7271, 92.7176]
    ]),
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'seg_nh415_itanagar_link',
    name: 'NH-415 Banderdewa - Naharlagun - Itanagar Express',
    highwayNumber: 'NH-415',
    source: 'Banderdewa (Assam border)',
    destination: 'Itanagar (Papum Pare)',
    roadType: 'Four Lane Hill Expressway',
    accessibilityStatus: 'OPEN',
    riskLevel: 'LOW',
    averageTravelTime: 65,
    coordinatesGeoJson: JSON.stringify([
      [27.1200, 93.7500],
      [27.1000, 93.6800],
      [27.0844, 93.6053]
    ]),
    lastUpdated: new Date().toISOString()
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'inc_01',
    title: 'Massive Mudslide & Slump on NH-6 Sonapur Tunnel',
    description: 'Heavy continuous rainfall caused an active debris slide 500m north of Sonapur tunnel. Debris of 1,200 cubic meters blocking both carriageways. NHAI & BRO excavators deployed.',
    incidentType: 'LANDSLIDE',
    severity: 'CRITICAL',
    latitude: 25.1320,
    longitude: 92.4215,
    locationName: 'Sonapur Tunnel, East Jaintia Hills',
    districtId: 'dist_east_jaintia',
    districtName: 'East Jaintia Hills',
    state: 'Meghalaya',
    roadSegmentId: 'seg_nh6_sonapur',
    reportedBy: 'Meghalaya Disaster Management Authority',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'inc_02',
    title: 'Teesta River Flash Flood Breaches NH-10 at 29th Mile',
    description: 'Surging water levels from Chungthang cloudburst overflowed embankment at 29th Mile near Teesta Bazaar. Road foundation eroded over 80 meters.',
    incidentType: 'FLOOD',
    severity: 'CRITICAL',
    latitude: 27.0620,
    longitude: 88.4410,
    locationName: '29th Mile, Teesta Basin',
    districtId: 'dist_east_sikkim',
    districtName: 'East Sikkim',
    state: 'Sikkim',
    roadSegmentId: 'seg_nh10_sevoke_gangtok',
    reportedBy: 'Border Roads Organisation (Swastik)',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'inc_03',
    title: 'Rockfall and Slope Subsidence near Phesama Checkpost',
    description: 'Boulders falling intermittently due to overnight downpour. Single-lane movement permitted only for light vehicles. Heavy cargo trucks stopped.',
    incidentType: 'LANDSLIDE',
    severity: 'HIGH',
    latitude: 25.6410,
    longitude: 94.1120,
    locationName: 'Phesama, Kohima District',
    districtId: 'dist_kohima',
    districtName: 'Kohima',
    state: 'Nagaland',
    roadSegmentId: 'seg_nh2_dimapur_kohima',
    reportedBy: 'Nagaland Police Traffic Wing',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 7 * 3600000).toISOString()
  },
  {
    id: 'inc_04',
    title: 'Culvert Settlement & Crack on Haflong-Silchar Link',
    description: 'Depression observed on approach slab of culvert MP-44. Speed restricted to 15 km/h with 15-tonne gross vehicle weight cap.',
    incidentType: 'ROAD_DAMAGE',
    severity: 'MEDIUM',
    latitude: 25.1050,
    longitude: 92.9520,
    locationName: 'Jatinga Valley, Dima Hasao',
    districtId: 'dist_dima_hasao',
    districtName: 'Dima Hasao',
    state: 'Assam',
    roadSegmentId: 'seg_nh27_haflong_silchar',
    reportedBy: 'PWD Assam Hill Division',
    status: 'INVESTIGATING',
    reportedAt: new Date(Date.now() - 11 * 3600000).toISOString()
  },
  {
    id: 'inc_05',
    title: 'Severe Inundation on Brahmaputra Lowlands (Kaziranga Bypass)',
    description: 'Minor water seepage onto road edge during high-flood discharge. Caution flags posted; safe transit speed 30 km/h.',
    incidentType: 'FLOOD',
    severity: 'MEDIUM',
    latitude: 26.5820,
    longitude: 93.1840,
    locationName: 'Kaziranga Southern Corridor',
    districtId: 'dist_jorhat',
    districtName: 'Jorhat',
    state: 'Assam',
    roadSegmentId: 'seg_nh27_guwahati_nagaon',
    reportedBy: 'State Disaster Management Authority (ASDMA)',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: 'inc_06',
    title: 'Timber Bridge Bearing Shift at Kolasib Pass',
    description: 'Temporary Bailey bridge support strut shifted 4cm under stress. Heavy trucks diverted to secondary gravel route via Bilkhawthlir.',
    incidentType: 'BRIDGE_DAMAGE',
    severity: 'HIGH',
    latitude: 24.2180,
    longitude: 92.6810,
    locationName: 'Kolasib Valley Approach',
    districtId: 'dist_kolasib',
    districtName: 'Kolasib',
    state: 'Mizoram',
    roadSegmentId: 'seg_nh306_silchar_aizawl',
    reportedBy: 'Mizoram PWD Bridges Wing',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 18 * 3600000).toISOString()
  },
  {
    id: 'inc_07',
    title: 'Extreme Monsoon Cloudburst (Rainfall >180mm in 6 hrs)',
    description: 'Severe weather advisory. Low visibility (<30m) and hydroplaning hazard along hill bends between Nongpoh and Shillong.',
    incidentType: 'HEAVY_RAINFALL',
    severity: 'HIGH',
    latitude: 25.8940,
    longitude: 91.8790,
    locationName: 'Ri-Bhoi Umiam Pass',
    districtId: 'dist_east_khasi',
    districtName: 'East Khasi Hills',
    state: 'Meghalaya',
    roadSegmentId: 'seg_nh6_sonapur',
    reportedBy: 'IMD Regional Meteorological Centre Guwahati',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'inc_08',
    title: 'Oil Tanker Mechanical Breakdown Blocking Chieswema Turning',
    description: 'Loaded petroleum tanker stalled across narrow hairpin turn, causing 4 km multi-vehicle bottleneck on the Dimapur-Kohima ridge.',
    incidentType: 'TRAFFIC',
    severity: 'MEDIUM',
    latitude: 25.7200,
    longitude: 94.0750,
    locationName: 'Chieswema Ridge, Kohima',
    districtId: 'dist_kohima',
    districtName: 'Kohima',
    state: 'Nagaland',
    roadSegmentId: 'seg_nh2_dimapur_kohima',
    reportedBy: 'Highway Patrol Team Beta',
    status: 'INVESTIGATING',
    reportedAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'inc_09',
    title: 'Landslip on Banderdewa - Karsingsa Stretch',
    description: 'Shoulder collapse along 30 meters of embankment. Single-lane barricaded with warning beacons.',
    incidentType: 'ROAD_DAMAGE',
    severity: 'LOW',
    latitude: 27.1120,
    longitude: 93.6950,
    locationName: 'Karsingsa, Papum Pare',
    districtId: 'dist_papum_pare',
    districtName: 'Papum Pare',
    state: 'Arunachal Pradesh',
    roadSegmentId: 'seg_nh415_itanagar_link',
    reportedBy: 'Arunachal Highway Dept',
    status: 'MITIGATED',
    reportedAt: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: 'inc_10',
    title: 'Flash Waterlogging at Ambassa Valley Bridge Approach',
    description: 'Minor stream runoff caused 25cm waterlogging over the road surface. Cars moving cautiously.',
    incidentType: 'FLOOD',
    severity: 'LOW',
    latitude: 23.9210,
    longitude: 91.8620,
    locationName: 'Ambassa River Crossing',
    districtId: 'dist_dhalai',
    districtName: 'Dhalai',
    state: 'Tripura',
    reportedBy: 'Tripura State Emergency Operations',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 8 * 3600000).toISOString()
  },
  {
    id: 'inc_11',
    title: 'Deep Slump on Tura-Dalu Road near Purakhasia',
    description: 'Subsurface water seepage leading to 45cm road sinkage. Buses and heavy commercial trucks restricted.',
    incidentType: 'ROAD_DAMAGE',
    severity: 'HIGH',
    latitude: 25.3200,
    longitude: 90.1500,
    locationName: 'Purakhasia, West Garo Hills',
    districtId: 'dist_west_garo',
    districtName: 'West Garo Hills',
    state: 'Meghalaya',
    reportedBy: 'District Transport Officer Tura',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 16 * 3600000).toISOString()
  },
  {
    id: 'inc_12',
    title: 'Snow & Slush Blockage at Sela Tunnel Northern Portal',
    description: 'Unseasonal freezing rain created black ice and slush barrier on approach hairpin 14.',
    incidentType: 'OTHER',
    severity: 'CRITICAL',
    latitude: 27.5020,
    longitude: 92.1020,
    locationName: 'Sela Pass Corridor',
    districtId: 'dist_tawang',
    districtName: 'Tawang',
    state: 'Arunachal Pradesh',
    reportedBy: 'BRO Project Vartak',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: 'inc_13',
    title: 'Senapati Bridge Structural Inspection Barricade',
    description: 'Routine vibration test and repair work following minor seismic tremors. Alternating 15-minute convoy release.',
    incidentType: 'TRAFFIC',
    severity: 'LOW',
    latitude: 25.2680,
    longitude: 94.0210,
    locationName: 'Senapati Bridge MP-12',
    districtId: 'dist_senapati',
    districtName: 'Senapati',
    state: 'Manipur',
    reportedBy: 'Manipur PWD Maintenance Squad',
    status: 'INVESTIGATING',
    reportedAt: new Date(Date.now() - 9 * 3600000).toISOString()
  },
  {
    id: 'inc_14',
    title: 'Tree Fall & Power Line Snapped on Mangan Valley Road',
    description: 'Uprooted Pine trees blocked both lanes. Forest clearing crews currently cutting timber.',
    incidentType: 'OTHER',
    severity: 'MEDIUM',
    latitude: 27.5180,
    longitude: 88.5350,
    locationName: 'Mangan North Ridge',
    districtId: 'dist_north_sikkim',
    districtName: 'North Sikkim',
    state: 'Sikkim',
    reportedBy: 'North Sikkim District Emergency Cell',
    status: 'MITIGATED',
    reportedAt: new Date(Date.now() - 20 * 3600000).toISOString()
  },
  {
    id: 'inc_15',
    title: 'Soil Erosion under Pier 3 at Barak River Suspension Span',
    description: 'River discharge eroding embankment near south pier. Structural engineers on-site installing riprap boulders.',
    incidentType: 'BRIDGE_DAMAGE',
    severity: 'HIGH',
    latitude: 24.8150,
    longitude: 92.7950,
    locationName: 'Barak River Span, Silchar',
    districtId: 'dist_cachar',
    districtName: 'Cachar',
    state: 'Assam',
    reportedBy: 'Cachar District Administration',
    status: 'ACTIVE',
    reportedAt: new Date(Date.now() - 1 * 3600000).toISOString()
  }
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route_guwahati_silchar_primary',
    name: 'Guwahati to Silchar via NH-6 (Sonapur-Khliehriat Corridor)',
    origin: 'Guwahati (Kamrup)',
    destination: 'Silchar (Cachar)',
    originDistrictId: 'dist_kamrup',
    destDistrictId: 'dist_cachar',
    distance: 310,
    estimatedDuration: 420, // 7 hrs base
    riskScore: 88.5,
    routeStatus: 'CRITICAL_RISK',
    coordinatesGeoJson: JSON.stringify([
      [26.1445, 91.7362], // Guwahati
      [25.8940, 91.8790], // Nongpoh
      [25.5788, 91.8933], // Shillong
      [25.4600, 92.1500], // Jowai
      [25.3500, 92.3667], // Khliehriat
      [25.1320, 92.4215], // Sonapur Tunnel (Active Landslide!)
      [24.9500, 92.6500], // Badarpur
      [24.8333, 92.7789]  // Silchar
    ]),
    alternativeRouteId: 'route_guwahati_silchar_alt',
    createdAt: new Date().toISOString()
  },
  {
    id: 'route_guwahati_silchar_alt',
    name: 'Guwahati to Silchar via NH-27 (Nagaon - Lumding - Haflong Bypass)',
    origin: 'Guwahati (Kamrup)',
    destination: 'Silchar (Cachar)',
    originDistrictId: 'dist_kamrup',
    destDistrictId: 'dist_cachar',
    distance: 365,
    estimatedDuration: 480, // 8 hrs base (but bypasses catastrophic landslide)
    riskScore: 32.0,
    routeStatus: 'OPEN',
    coordinatesGeoJson: JSON.stringify([
      [26.1445, 91.7362], // Guwahati
      [26.2400, 92.4000], // Jagiroad
      [26.3450, 92.6840], // Nagaon
      [25.7500, 93.1700], // Lumding
      [25.1833, 93.0167], // Haflong
      [25.0200, 92.9000], // Harangajao
      [24.8333, 92.7789]  // Silchar
    ]),
    createdAt: new Date().toISOString()
  },
  {
    id: 'route_guwahati_imphal',
    name: 'Guwahati to Imphal via Dimapur & Kohima (NH-29 / NH-2)',
    origin: 'Guwahati (Kamrup)',
    destination: 'Imphal (Imphal West)',
    originDistrictId: 'dist_kamrup',
    destDistrictId: 'dist_imphal_west',
    distance: 475,
    estimatedDuration: 660,
    riskScore: 58.0,
    routeStatus: 'RESTRICTED',
    coordinatesGeoJson: JSON.stringify([
      [26.1445, 91.7362],
      [26.3450, 92.6840],
      [25.9068, 93.7271],
      [25.6751, 94.1086],
      [25.2667, 94.0167],
      [24.8170, 93.9368]
    ]),
    createdAt: new Date().toISOString()
  },
  {
    id: 'route_siliguri_gangtok',
    name: 'Siliguri to Gangtok via NH-10 Teesta Valley Corridor',
    origin: 'Siliguri Gateway',
    destination: 'Gangtok (East Sikkim)',
    originDistrictId: 'dist_kamrup',
    destDistrictId: 'dist_east_sikkim',
    distance: 114,
    estimatedDuration: 240,
    riskScore: 92.0,
    routeStatus: 'BLOCKED',
    coordinatesGeoJson: JSON.stringify([
      [26.7150, 88.4310],
      [26.8800, 88.4700],
      [27.0620, 88.4410], // Teesta Breached
      [27.1700, 88.5200],
      [27.3389, 88.6065]
    ]),
    alternativeRouteId: 'route_siliguri_gangtok_alt',
    createdAt: new Date().toISOString()
  },
  {
    id: 'route_siliguri_gangtok_alt',
    name: 'Siliguri to Gangtok via Lava - Algarah - Reshi - Rhenock Bypass',
    origin: 'Siliguri Gateway',
    destination: 'Gangtok (East Sikkim)',
    originDistrictId: 'dist_kamrup',
    destDistrictId: 'dist_east_sikkim',
    distance: 142,
    estimatedDuration: 330,
    riskScore: 38.5,
    routeStatus: 'OPEN',
    coordinatesGeoJson: JSON.stringify([
      [26.7150, 88.4310],
      [27.0100, 88.6600], // Lava
      [27.1200, 88.6400], // Algarah
      [27.1800, 88.6300], // Reshi Border
      [27.2400, 88.6100], // Pakyong
      [27.3389, 88.6065]  // Gangtok
    ]),
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh_01',
    vehicleNumber: 'AS-01-GC-4482',
    driverName: 'Biren Barman',
    driverPhone: '+91 94350 11201',
    vehicleType: 'COLD_CHAIN_VAN',
    currentLatitude: 25.5610,
    currentLongitude: 91.9050,
    speed: 38.5,
    status: 'IN_TRANSIT',
    batteryOrFuel: 88,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_02',
    vehicleNumber: 'ML-05-D-8821',
    driverName: 'Marcellus Kharmalki',
    driverPhone: '+91 98620 44910',
    vehicleType: 'HEAVY_TRUCK',
    currentLatitude: 25.3210,
    currentLongitude: 92.3500,
    speed: 0,
    status: 'DIVERTED',
    batteryOrFuel: 64,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_03',
    vehicleNumber: 'MN-01-AB-1903',
    driverName: 'N. Tomba Singh',
    driverPhone: '+91 98560 33812',
    vehicleType: 'MEDIUM_CARGO',
    currentLatitude: 25.7100,
    currentLongitude: 93.9900,
    speed: 42.0,
    status: 'IN_TRANSIT',
    batteryOrFuel: 76,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_04',
    vehicleNumber: 'AS-11-F-7622',
    driverName: 'Abdul Karim',
    driverPhone: '+91 94351 77218',
    vehicleType: 'EMERGENCY_4X4',
    currentLatitude: 25.1700,
    currentLongitude: 93.0400,
    speed: 51.2,
    status: 'IN_TRANSIT',
    batteryOrFuel: 92,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_05',
    vehicleNumber: 'SK-01-T-3108',
    driverName: 'Pemba Bhutia',
    driverPhone: '+91 94740 55102',
    vehicleType: 'COLD_CHAIN_VAN',
    currentLatitude: 27.1100,
    currentLongitude: 88.6200,
    speed: 34.0,
    status: 'IN_TRANSIT',
    batteryOrFuel: 70,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_06',
    vehicleNumber: 'MZ-01-K-5541',
    driverName: 'Lalrinsanga',
    driverPhone: '+91 98625 11980',
    vehicleType: 'HEAVY_TRUCK',
    currentLatitude: 24.4100,
    currentLongitude: 92.7100,
    speed: 28.5,
    status: 'IN_TRANSIT',
    batteryOrFuel: 58,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_07',
    vehicleNumber: 'TR-01-M-9023',
    driverName: 'Debabrata Debbarma',
    driverPhone: '+91 94361 22849',
    vehicleType: 'MEDIUM_CARGO',
    currentLatitude: 23.8500,
    currentLongitude: 91.3100,
    speed: 45.0,
    status: 'IDLE',
    batteryOrFuel: 95,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_08',
    vehicleNumber: 'AR-01-H-4419',
    driverName: 'Taba Tagia',
    driverPhone: '+91 94360 88231',
    vehicleType: 'EMERGENCY_4X4',
    currentLatitude: 27.0950,
    currentLongitude: 93.6300,
    speed: 40.0,
    status: 'IN_TRANSIT',
    batteryOrFuel: 83,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_09',
    vehicleNumber: 'NL-07-B-6601',
    driverName: 'Kevichusa Angami',
    driverPhone: '+91 98622 77014',
    vehicleType: 'HEAVY_TRUCK',
    currentLatitude: 25.8800,
    currentLongitude: 93.7500,
    speed: 48.0,
    status: 'IN_TRANSIT',
    batteryOrFuel: 69,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'veh_10',
    vehicleNumber: 'AS-01-EC-9912',
    driverName: 'Diganta Saikia',
    driverPhone: '+91 94350 44819',
    vehicleType: 'COLD_CHAIN_VAN',
    currentLatitude: 26.1700,
    currentLongitude: 91.7800,
    speed: 0,
    status: 'MAINTENANCE',
    batteryOrFuel: 42,
    lastUpdated: new Date().toISOString()
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'ship_01',
    trackingNumber: 'NL-MED-2026-0901',
    commodityType: 'MEDICINES',
    priority: 'CRITICAL',
    origin: 'Guwahati Medical Warehouse',
    destination: 'Silchar Medical College Hospital (SMCH)',
    vehicleId: 'veh_01',
    routeId: 'route_guwahati_silchar_primary',
    status: 'DELAYED',
    expectedDeliveryTime: new Date(Date.now() + 4 * 3600000).toISOString(),
    delayMinutes: 240,
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_02',
    trackingNumber: 'NL-EMG-2026-0902',
    commodityType: 'EMERGENCY_SUPPLIES',
    priority: 'CRITICAL',
    origin: 'Lumding Relief Hub',
    destination: 'Cachar Flood Relief Camp',
    vehicleId: 'veh_04',
    routeId: 'route_guwahati_silchar_alt',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 2 * 3600000).toISOString(),
    delayMinutes: 15,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_03',
    trackingNumber: 'NL-MED-2026-0903',
    commodityType: 'MEDICINES',
    priority: 'CRITICAL',
    origin: 'Siliguri Cold Depot',
    destination: 'STNM Central Hospital, Gangtok',
    vehicleId: 'veh_05',
    routeId: 'route_siliguri_gangtok_alt',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    delayMinutes: 30,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_04',
    trackingNumber: 'NL-FOD-2026-0904',
    commodityType: 'FOOD',
    priority: 'HIGH',
    origin: 'FCI Godown, Dimapur',
    destination: 'Imphal Civil Supplies Depot',
    vehicleId: 'veh_03',
    routeId: 'route_guwahati_imphal',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 5 * 3600000).toISOString(),
    delayMinutes: 75,
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_05',
    trackingNumber: 'NL-AGR-2026-0905',
    commodityType: 'AGRICULTURAL_PRODUCE',
    priority: 'STANDARD',
    origin: 'Jowai Turmeric Processing Unit',
    destination: 'Guwahati Agri Export Terminal',
    vehicleId: 'veh_02',
    routeId: 'route_guwahati_silchar_primary',
    status: 'DELAYED',
    expectedDeliveryTime: new Date(Date.now() + 7 * 3600000).toISOString(),
    delayMinutes: 180,
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_06',
    trackingNumber: 'NL-CON-2026-0906',
    commodityType: 'CONSTRUCTION_MATERIALS',
    priority: 'HIGH',
    origin: 'Guwahati Cement Yard',
    destination: 'NH-6 Landslide Restoration BRO Camp',
    vehicleId: 'veh_09',
    routeId: 'route_guwahati_silchar_primary',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 6 * 3600000).toISOString(),
    delayMinutes: 45,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_07',
    trackingNumber: 'NL-FOD-2026-0907',
    commodityType: 'FOOD',
    priority: 'HIGH',
    origin: 'Silchar Distribution Depot',
    destination: 'Aizawl Essential Ration Center',
    vehicleId: 'veh_06',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 4 * 3600000).toISOString(),
    delayMinutes: 60,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_08',
    trackingNumber: 'NL-EMG-2026-0908',
    commodityType: 'EMERGENCY_SUPPLIES',
    priority: 'CRITICAL',
    origin: 'Guwahati NDMA Regional Depot',
    destination: 'Itanagar Disaster Warehouse',
    vehicleId: 'veh_08',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    delayMinutes: 0,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_09',
    trackingNumber: 'NL-MED-2026-0909',
    commodityType: 'MEDICINES',
    priority: 'CRITICAL',
    origin: 'Agartala Central Drug Store',
    destination: 'Ambassa Subdivisional Hospital',
    vehicleId: 'veh_07',
    status: 'PLANNED',
    expectedDeliveryTime: new Date(Date.now() + 8 * 3600000).toISOString(),
    delayMinutes: 0,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_10',
    trackingNumber: 'NL-FOD-2026-0910',
    commodityType: 'FOOD',
    priority: 'STANDARD',
    origin: 'FCI Depot, Guwahati',
    destination: 'Tezpur Civil Supply Center',
    status: 'DELIVERED',
    expectedDeliveryTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    actualDeliveryTime: new Date(Date.now() - 2 * 3600000).toISOString(),
    delayMinutes: 10,
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_11',
    trackingNumber: 'NL-AGR-2026-0911',
    commodityType: 'AGRICULTURAL_PRODUCE',
    priority: 'STANDARD',
    origin: 'Tawang Organic Apple Farms',
    destination: 'Guwahati Cold Terminal',
    status: 'DELAYED',
    expectedDeliveryTime: new Date(Date.now() + 12 * 3600000).toISOString(),
    delayMinutes: 360,
    createdAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_12',
    trackingNumber: 'NL-CON-2026-0912',
    commodityType: 'CONSTRUCTION_MATERIALS',
    priority: 'HIGH',
    origin: 'Silchar Steel Depot',
    destination: 'Barak River Pier 3 Restoration',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 1 * 3600000).toISOString(),
    delayMinutes: 0,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_13',
    trackingNumber: 'NL-MED-2026-0913',
    commodityType: 'MEDICINES',
    priority: 'CRITICAL',
    origin: 'Dimapur Blood Bank',
    destination: 'Kohima Civil Hospital',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 2 * 3600000).toISOString(),
    delayMinutes: 40,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_14',
    trackingNumber: 'NL-EMG-2026-0914',
    commodityType: 'EMERGENCY_SUPPLIES',
    priority: 'CRITICAL',
    origin: 'Shillong Relief Camp Hub',
    destination: 'Khliehriat Emergency Shelter',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    delayMinutes: 90,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ship_15',
    trackingNumber: 'NL-FOD-2026-0915',
    commodityType: 'FOOD',
    priority: 'HIGH',
    origin: 'Guwahati Grain Silos',
    destination: 'Jorhat Flood Relief Distribution',
    status: 'IN_TRANSIT',
    expectedDeliveryTime: new Date(Date.now() + 3 * 3600000).toISOString(),
    delayMinutes: 20,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'alt_01',
    title: 'CRITICAL RED ALERT: NH-6 Sonapur Tunnel Blocked by Landslide',
    message: 'National Highway 6 blocked completely due to massive landslide debris. All supply convoys bound for Silchar, Tripura, and Mizoram are advised to divert via NH-27 Lumding-Haflong route immediately.',
    severity: 'CRITICAL',
    affectedRegion: 'East Jaintia Hills, Meghalaya',
    incidentId: 'inc_01',
    status: 'ACTIVE',
    translations: {
      hi: {
        title: 'गंभीर चेतावनी: भूस्खलन के कारण NH-6 सोनापुर सुरंग बंद',
        message: 'विशाल भूस्खलन के कारण राष्ट्रीय राजमार्ग 6 पूरी तरह अवरुद्ध। सिलचर और मिजोरम जाने वाले सभी आवश्यक वाहनों को NH-27 हाफलोंग मार्ग से जाने का निर्देश।'
      },
      as: {
        title: 'জৰুৰী সতৰ্কতা: ভূমিস্খলনৰ বাবে NH-6 সোণাপুৰ সুৰংগ পথ বন্ধ',
        message: 'ডাঙৰ ভূমিস্খলনৰ বাবে ৰাষ্ট্ৰীয় ঘাইপথ ৬ সম্পূৰ্ণৰূপে বন্ধ। শিলচৰ আৰু মিজোৰাম অভিমুখী বাহনসমূহক NH-27 লামডিং-হাফলং পথেৰে যাবলৈ অনুৰোধ জনোৱা হৈছে।'
      },
      bn: {
        title: 'জরুরি সতর্কতা: ধসের কারণে NH-6 সোনাপুর টানেল সম্পূর্ণ বন্ধ',
        message: 'বিশাল ধসের কারণে ৬ নম্বর জাতীয় সড়ক সম্পূর্ণ বন্ধ। শিলচর এবং মিজোরামগামী সমস্ত প্রয়োজনীয় যানকে NH-27 হাফলং পথ ব্যবহার করার পরামর্শ দেওয়া হচ্ছে।'
      },
      mni: {
        title: 'অকন্বা চেবাও: লৈবাক চংবনা মরম ওইদুনা NH-6 সোনাপুর টনেল থিংজিনখ্রে',
        message: 'লৈবাক কক্থৎলকপদগী NH-6 মপুং ফানা থিংজিনখ্রে। শীলচর অমসুং মিজোরাম চৎকদবা গারীশিং NH-27 হাফলং লম্বীদা চৎনবগী অপাম্বা ফোংদোকচরি।'
      }
    },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'alt_02',
    title: 'TEESTA RIVER SURGE: NH-10 Sikkim Lifeline Severed',
    message: 'River flash flood eroded NH-10 foundation at 29th Mile. Direct road link to Gangtok cut off. Use alternative corridor via Lava - Algarah - Reshi border.',
    severity: 'CRITICAL',
    affectedRegion: 'East Sikkim / Kalimpong Border',
    incidentId: 'inc_02',
    status: 'ACTIVE',
    translations: {
      hi: {
        title: 'तीस्ता नदी बाढ़: NH-10 सिक्किम मार्ग टूटा',
        message: 'तीस्ता नदी के उफान से NH-10 की नींव बही। गंगटोक जाने के लिए लावा-अलगरह-रेशी वैकल्पिक मार्ग अपनाएं।'
      },
      as: {
        title: 'তিস্তা নদীৰ বান: ছিকিমৰ প্ৰাণৰেখা NH-10 বিচ্ছিন্ন',
        message: 'তিস্তা নদীৰ বানে NH-10 পথৰ অংশ উটুৱাই লৈ গৈছে। গ্যাংটকলৈ যাত্ৰাৰ বাবে লাভা-আলগৰাহ পথ ব্যৱহাৰ কৰক।'
      }
    },
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: 'alt_03',
    title: 'Heavy Rainfall Warning: Red Warning across Khasi & Jaintia Hills',
    message: 'Continuous precipitation exceeding 150mm recorded in 12 hours. High vulnerability to slope destabilization and hydroplaning across NH-6 & Shillong bypass.',
    severity: 'HIGH',
    affectedRegion: 'Meghalaya Highland Corridors',
    incidentId: 'inc_07',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString()
  },
  {
    id: 'alt_04',
    title: 'Cargo Weight Restriction Cap on Jatinga Valley Culvert',
    description: 'Vehicle tonnage on NH-27 Mahur-Harangajao capped at 15 MT due to culvert subsidence. Multi-axle carriers must queue for regulated passage.',
    message: 'Vehicle tonnage on NH-27 Mahur-Harangajao capped at 15 MT due to culvert subsidence. Multi-axle carriers must queue for regulated passage.',
    severity: 'MEDIUM',
    affectedRegion: 'Dima Hasao, Assam',
    incidentId: 'inc_04',
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString()
  }
];

export const INITIAL_FIELD_REPORTS: FieldReport[] = [
  {
    id: 'fr_01',
    reporterName: 'Tenzing Lepcha (Field Officer)',
    incidentType: 'LANDSLIDE',
    severity: 'CRITICAL',
    description: 'Ground crack expanding along hillside above Sonapur tunnel. Boulders threatening to fall onto lower lane. Excavators on site.',
    latitude: 25.1320,
    longitude: 92.4215,
    locationName: 'Sonapur Tunnel MP 142',
    syncStatus: 'SYNCED',
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'fr_02',
    reporterName: 'Animesh Roy (Surveyor)',
    incidentType: 'ROAD_DAMAGE',
    severity: 'MEDIUM',
    description: 'Shoulder erosion noticed near Umkiang village after flash stream overflow. Signboards erected.',
    latitude: 25.1800,
    longitude: 92.4900,
    locationName: 'Umkiang Border Stretch',
    syncStatus: 'SYNCED',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString()
  }
];
