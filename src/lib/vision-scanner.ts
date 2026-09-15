import { VisionHazardScan, IncidentType } from './types';

export interface SampleHazardPhoto {
  id: string;
  title: string;
  location: string;
  hazardType: IncidentType;
  imageUrl: string;
  scanResult: VisionHazardScan;
}

export const SAMPLE_HAZARD_PHOTOS: SampleHazardPhoto[] = [
  {
    id: 'photo_sonapur_slide',
    title: 'NH-6 Sonapur Tunnel Massive Slump & Mudslide',
    location: 'East Jaintia Hills, Meghalaya (NH-6 MP-142)',
    hazardType: 'LANDSLIDE',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    scanResult: {
      id: 'scan_sonapur_01',
      imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
      hazardType: 'LANDSLIDE',
      confidencePercent: 97.4,
      blockagePercentage: 100,
      estimatedDebrisVolumeM3: 1450,
      structuralIntegrityStatus: 'CATASTROPHIC_SEVERANCE',
      recommendedDetachment: '2x Komatsu PC210 Heavy Excavators + BRO D-80 Crawler Dozer',
      estimatedClearanceHours: 14.5,
      detectedAt: new Date().toISOString(),
    }
  },
  {
    id: 'photo_teesta_surge',
    title: 'NH-10 Teesta River Embankment Scour & Sub-base Breach',
    location: '29th Mile, Kalimpong - Sikkim Border (NH-10)',
    hazardType: 'FLOOD',
    imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    scanResult: {
      id: 'scan_teesta_02',
      imageUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      hazardType: 'FLOOD',
      confidencePercent: 94.8,
      blockagePercentage: 85,
      estimatedDebrisVolumeM3: 620,
      structuralIntegrityStatus: 'PARTIAL_COLLAPSE',
      recommendedDetachment: 'River Defense Riprap Boulders + PWD Sheet Piling Detachment',
      estimatedClearanceHours: 28.0,
      detectedAt: new Date().toISOString(),
    }
  },
  {
    id: 'photo_phesama_rockfall',
    title: 'NH-2 Phesama Boulder Rockfall & Slope Creep',
    location: 'Kohima District, Nagaland (NH-2 Ridge)',
    hazardType: 'LANDSLIDE',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    scanResult: {
      id: 'scan_phesama_03',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      hazardType: 'LANDSLIDE',
      confidencePercent: 91.2,
      blockagePercentage: 55,
      estimatedDebrisVolumeM3: 380,
      structuralIntegrityStatus: 'PARTIAL_COLLAPSE',
      recommendedDetachment: '1x Pneumatic Rock Breaker + JCB Loader Detachment',
      estimatedClearanceHours: 5.5,
      detectedAt: new Date().toISOString(),
    }
  },
  {
    id: 'photo_barak_bridge',
    title: 'Barak River Pier Settlement & Foundation Scour',
    location: 'Silchar Approach Bridge, Assam',
    hazardType: 'BRIDGE_DAMAGE',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    scanResult: {
      id: 'scan_barak_04',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      hazardType: 'BRIDGE_DAMAGE',
      confidencePercent: 96.1,
      blockagePercentage: 70,
      estimatedDebrisVolumeM3: 150,
      structuralIntegrityStatus: 'PARTIAL_COLLAPSE',
      recommendedDetachment: 'PWD Structural Engineering Team + Micro-piling Rig',
      estimatedClearanceHours: 36.0,
      detectedAt: new Date().toISOString(),
    }
  }
];

export function analyzeHazardPhoto(imageName: string, customUpload = false): VisionHazardScan {
  if (customUpload) {
    // Dynamic scan estimate for user-uploaded custom photo
    const randomDebris = Math.floor(Math.random() * 800) + 400;
    const randomBlockage = Math.floor(Math.random() * 40) + 60;
    return {
      id: `scan_custom_${Date.now()}`,
      imageUrl: imageName,
      hazardType: 'LANDSLIDE',
      confidencePercent: 92.5,
      blockagePercentage: randomBlockage,
      estimatedDebrisVolumeM3: randomDebris,
      structuralIntegrityStatus: randomBlockage >= 80 ? 'CATASTROPHIC_SEVERANCE' : 'PARTIAL_COLLAPSE',
      recommendedDetachment: '1x Heavy Excavator + BRO Tipper Truck Squad',
      estimatedClearanceHours: Math.round((randomDebris / 80) * 10) / 10,
      detectedAt: new Date().toISOString(),
    };
  }

  const found = SAMPLE_HAZARD_PHOTOS.find(p => p.id === imageName || p.title === imageName);
  return found ? found.scanResult : SAMPLE_HAZARD_PHOTOS[0].scanResult;
}
