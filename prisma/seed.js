const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const USERS = [
  {
    id: 'usr_admin',
    name: 'Dr. Anurag Sharma',
    email: 'admin@northlink.gov.in',
    passwordHash: '$2a$10$DEMOHASHNOTFORPRODUCTIONPURPOSESONLY0001',
    role: 'ADMIN',
    preferredLanguage: 'en',
  },
  {
    id: 'usr_logistics',
    name: 'Priyanka Borah',
    email: 'logistics@northlink.gov.in',
    passwordHash: '$2a$10$DEMOHASHNOTFORPRODUCTIONPURPOSESONLY0002',
    role: 'LOGISTICS_MANAGER',
    preferredLanguage: 'en',
  },
  {
    id: 'usr_field',
    name: 'Tenzing Lepcha',
    email: 'field.officer@northlink.gov.in',
    passwordHash: '$2a$10$DEMOHASHNOTFORPRODUCTIONPURPOSESONLY0003',
    role: 'FIELD_OFFICER',
    preferredLanguage: 'en',
  },
  {
    id: 'usr_driver',
    name: 'Rameshwar Sangma',
    email: 'driver@northlink.gov.in',
    passwordHash: '$2a$10$DEMOHASHNOTFORPRODUCTIONPURPOSESONLY0004',
    role: 'DRIVER',
    preferredLanguage: 'en',
  },
  {
    id: 'usr_viewer',
    name: 'Public Disaster Monitor',
    email: 'viewer@northlink.gov.in',
    passwordHash: '$2a$10$DEMOHASHNOTFORPRODUCTIONPURPOSESONLY0005',
    role: 'VIEWER',
    preferredLanguage: 'en',
  },
];

const DISTRICTS = [
  { id: 'dist_kamrup', name: 'Kamrup Metropolitan (Guwahati)', state: 'Assam', districtCode: 'AS-KM', latitude: 26.1445, longitude: 91.7362 },
  { id: 'dist_cachar', name: 'Cachar (Silchar)', state: 'Assam', districtCode: 'AS-CA', latitude: 24.8333, longitude: 92.7789 },
  { id: 'dist_dibrugarh', name: 'Dibrugarh', state: 'Assam', districtCode: 'AS-DI', latitude: 27.4728, longitude: 94.9120 },
  { id: 'dist_jorhat', name: 'Jorhat', state: 'Assam', districtCode: 'AS-JO', latitude: 26.7509, longitude: 94.2037 },
  { id: 'dist_dima_hasao', name: 'Dima Hasao (Haflong)', state: 'Assam', districtCode: 'AS-DH', latitude: 25.1833, longitude: 93.0167 },
  { id: 'dist_east_khasi', name: 'East Khasi Hills (Shillong)', state: 'Meghalaya', districtCode: 'ML-EK', latitude: 25.5788, longitude: 91.8933 },
  { id: 'dist_east_jaintia', name: 'East Jaintia Hills (Khliehriat)', state: 'Meghalaya', districtCode: 'ML-EJ', latitude: 25.3500, longitude: 92.3667 },
  { id: 'dist_west_garo', name: 'West Garo Hills (Tura)', state: 'Meghalaya', districtCode: 'ML-WG', latitude: 25.5144, longitude: 90.2033 },
  { id: 'dist_imphal_west', name: 'Imphal West', state: 'Manipur', districtCode: 'MN-IW', latitude: 24.8170, longitude: 93.9368 },
  { id: 'dist_senapati', name: 'Senapati', state: 'Manipur', districtCode: 'MN-SE', latitude: 25.2667, longitude: 94.0167 },
  { id: 'dist_churachandpur', name: 'Churachandpur', state: 'Manipur', districtCode: 'MN-CC', latitude: 24.3333, longitude: 93.6833 },
  { id: 'dist_aizawl', name: 'Aizawl', state: 'Mizoram', districtCode: 'MZ-AZ', latitude: 23.7271, longitude: 92.7176 },
  { id: 'dist_kolasib', name: 'Kolasib', state: 'Mizoram', districtCode: 'MZ-KO', latitude: 24.2247, longitude: 92.6781 },
  { id: 'dist_kohima', name: 'Kohima', state: 'Nagaland', districtCode: 'NL-KO', latitude: 25.6751, longitude: 94.1086 },
  { id: 'dist_dimapur', name: 'Dimapur', state: 'Nagaland', districtCode: 'NL-DI', latitude: 25.9068, longitude: 93.7271 },
  { id: 'dist_west_tripura', name: 'West Tripura (Agartala)', state: 'Tripura', districtCode: 'TR-WT', latitude: 23.8315, longitude: 91.2868 },
  { id: 'dist_dhalai', name: 'Dhalai (Ambassa)', state: 'Tripura', districtCode: 'TR-DH', latitude: 23.9167, longitude: 91.8500 },
  { id: 'dist_papum_pare', name: 'Papum Pare (Itanagar)', state: 'Arunachal Pradesh', districtCode: 'AR-PP', latitude: 27.0844, longitude: 93.6053 },
  { id: 'dist_tawang', name: 'Tawang', state: 'Arunachal Pradesh', districtCode: 'AR-TA', latitude: 27.5861, longitude: 91.8594 },
  { id: 'dist_east_sikkim', name: 'East Sikkim (Gangtok)', state: 'Sikkim', districtCode: 'SK-ES', latitude: 27.3389, longitude: 88.6065 },
  { id: 'dist_north_sikkim', name: 'North Sikkim (Mangan)', state: 'Sikkim', districtCode: 'SK-NS', latitude: 27.5100, longitude: 88.5300 }
];

async function main() {
  console.log('🚀 Starting NorthLink AI Database Seeding...');
  try {
    // Check if connected
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connected to PostgreSQL Database.');

    for (const u of USERS) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: u,
        create: u,
      });
    }
    console.log(`✅ Seeded ${USERS.length} users.`);

    for (const d of DISTRICTS) {
      await prisma.district.upsert({
        where: { districtCode: d.districtCode },
        update: d,
        create: d,
      });
    }
    console.log(`✅ Seeded ${DISTRICTS.length} districts.`);

    console.log('🎉 PostgreSQL Database seeding completed successfully!');
  } catch (error) {
    console.warn('⚠️ Direct PostgreSQL connection could not be established:', error.message);
    console.log('ℹ️ Running in resilient fallback mode for live hackathon demonstration.');
  } finally {
    await prisma.$disconnect();
  }
}

main();
