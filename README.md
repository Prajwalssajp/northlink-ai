# 🚀 NORTHLINK AI — Smart Logistics & Accessibility Intelligence Platform

> **"Intelligence for Every Route"**  
> *AI-Powered Disaster Logistics, Geospatial Accessibility, and Rerouting Platform for the North Eastern Region (NER) of India.*

---

## 🏔️ 1. Executive Summary & Problem Statement
The North Eastern Region of India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim) faces acute logistical bottlenecks due to rugged mountain geography, annual monsoons, massive landslides, flash floods, and bridge subsidence.
When critical arteries like **NH-6 (Meghalaya–Barak Valley lifeline)** or **NH-10 (Sikkim Teesta corridor)** collapse, entire states are severed from essential supplies—especially cold-chain vaccines, life-saving medicines, food grains, and disaster relief.

**NORTHLINK AI** is an intelligent, command-center platform engineered to bridge this infrastructure vulnerability through:
1. **Real-Time GIS Accessibility Grid**: Multi-layer interactive map of 8 NER states showing open, restricted, and severed transport corridors.
2. **AI Route Intelligence Engine**: Transparent, explainable Random Forest ML predictive model assessing landslide proximity, river inundation, rainfall indices, road structural health, and slope gradient.
3. **Strategic Alternative Bypass Rerouting**: Evaluates alternative hill bypasses (e.g., bypassing NH-6 Sonapur landslide via NH-27 Lumding–Haflong link), calculating delay hours avoided and net safety gains.
4. **📸 Computer Vision Road Hazard & Landslide Scanner**: Instant volumetric debris calculation ($m^3$), road blockage %, and heavy machinery deployment recommendations from drone or field camera photos.
5. **🧊 IoT Cold-Chain Sensor Telemetry**: Live temperature, humidity, compressor health, and dynamic spoilage countdown timers for sensitive medical and vaccine convoys.
6. **🚁 Aerial Relief & Drone Corridors**: IAF / BRO Forward Operating Base air-drop corridors for emergency relief into cut-off mountain valleys.
7. **📄 1-Click Official NDMA / BRO Dispatch Manifest PDF**: Print-ready official Government of India disaster transit certificates with cryptographic QR verification.
8. **🔊 Voice Audio Road Guidance Assistant**: Hands-free Web Speech API tactical road advisories for drivers navigating fog, rain, or landslide zones.
9. **🌦️ Live IMD Doppler Weather Radar Overlay**: Geospatial storm-cell simulation displaying precipitation intensity (mm/h) across the Eastern Himalayas.
10. **📲 Low-Bandwidth Satellite SMS & WhatsApp Dispatch**: 160-character satellite SMS broadcast simulator and WhatsApp dispatch for zero-connectivity 2G mountain pockets.
11. **Offline-First Field Reporting**: Resilient browser-cached submission protocol for field officers operating in zero-connectivity mountain valleys with auto-sync.
12. **Multilingual Emergency Alerts**: Early-warning advisories in English, Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिंदी), and Manipuri (মৈতৈলোন্).

---

## 🛠️ 2. Technology Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS.
- **GIS Cartography**: Leaflet / React-Leaflet with Dark Matter GIS tiles and geo-referenced coordinate polylines.
- **Data Analytics**: Recharts for incident distributions, delay by commodity, and corridor accessibility.
- **Backend & APIs**: Next.js 14 Server API Routes with validation, error handling, and role-based access control.
- **Database & Spatial ORM**: PostgreSQL + PostGIS via Prisma ORM (`postgis/postgis:15-3.3`), with a resilient in-memory dual-layer fallback adapter guaranteeing zero-downtime during hackathon demonstrations.
- **Security**: JWT authentication with pre-configured operator roles (`ADMIN`, `LOGISTICS_MANAGER`, `FIELD_OFFICER`, `DRIVER`, `VIEWER`).

---

## ⚡ 3. Quick Start & Setup on Any Device (Windows, Mac, Linux)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Git**: Installed on your system
- **Package Manager**: `npm` (comes with Node) or `pnpm` / `yarn`
- *(Optional)* **Docker Desktop** for PostgreSQL + PostGIS (the platform includes an automated in-memory fallback adapter that runs out of the box with zero external database setup).

---

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Prajwalssajp/northlink-ai.git
cd northlink-ai
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
- **Windows (PowerShell)**:
  ```powershell
  Copy-Item .env.example .env
  ```
- **macOS / Linux**:
  ```bash
  cp .env.example .env
  ```

Sample `.env` contents:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/northlink_db?schema=public"
JWT_SECRET="northlink-ner-secure-jwt-key-hackathon-2026-09"
PORT=3000
NODE_ENV="development"
NEXT_PUBLIC_DEMO_MODE="true"
```
*(Note: If PostgreSQL is not active, NorthLink AI automatically utilizes its high-performance in-memory fallback store with full NER seed data, so you can test immediately with zero database configuration!)*

#### 4. (Optional) Run Database via Docker
If you have Docker Desktop and want live PostGIS:
```bash
npm run docker:up
npm run prisma:generate
npm run db:seed
```

#### 5. Launch the Application
- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode (Recommended for Demos)**:
  ```bash
  npm run build
  npm run start
  ```

#### 6. Access in Browser
- Local machine: **`http://localhost:3000`**
- On another device on the same Wi-Fi / Local Network: **`http://<YOUR_LOCAL_IP>:3000`**

---

## 🎯 4. Hackathon 3-Minute Live Demonstration Script

Follow this structured workflow during jury evaluation:

1. **Overview Dashboard (`/`)**:
   - Point out the dark command-center aesthetic and live IST clock.
   - Show the 6 KPI cards pulling real metrics: Active Shipments, Monitored Routes, At-Risk Routes, Active Incidents, Vehicles in Transit, and Critical Alerts.
   - Highlight the embedded GIS Regional Map showing active landslides at Sonapur Tunnel and flood breach at Teesta River.

2. **AI Route Intelligence (`/route-intelligence`)**:
   - Select preset: **Guwahati to Silchar (NH-6 Landslide Vulnerability)** with Commodity **MEDICINES**.
   - Click **"Analyze"** — view Random Forest tree ensemble consensus (85%+ votes for bypass), delay avoided (~4.5 hrs), and safety gain (+64%).
   - Click **"Listen Voice Guidance"** 🔊 — Web Speech API speaks tactical navigation instructions hands-free.
   - Click **"NDMA Manifest PDF"** 📄 — opens print-ready official NDMA/BRO Disaster Transit Certificate with QR code and escort pass.
   - Click **"Broadcast Reroute SMS"** 📲 — launches Satellite SMS simulator with 160-char counter and 1-click WhatsApp dispatch.

3. **Computer Vision Road Hazard Scanner (`/hazard-scanner`)**:
   - Click any preset image (Sonapur Landslide, Teesta Flash Flood, Haflong Cliff Slump) or upload a photo.
   - Click **"Run Computer Vision Hazard Analysis"**.
   - Review AI estimates: Volumetric debris ($1,450 m^3$), Road blockage (85%), Road clearance time (~6.5 hrs).
   - View recommended heavy machinery detachment (e.g. 2x JCB-3DX Backhoe, 1x 20T Hydraulic Excavator).
   - Click **"Broadcast Audio Advisory"** or **"Dispatch to Regional Incident Grid"**.

4. **Live GIS Map, Doppler Radar & Drone Corridors (`/live-map`)**:
   - Click **"Doppler Radar"** toggle 🌦️: view animated IMD precipitation storm cells and rain intensity (mm/h).
   - Click **"Drone Corridors"** toggle 🚁: inspect IAF Kumbhirgram, BRO Haflong, and NDRF Tezpur aerial relief flight bridges for cut-off mountain valleys.
   - Filter by State or Incident Type; click any corridor or hazard to inspect real-time telemetry.

5. **Logistics & Cold-Chain IoT Telemetry (`/logistics`)**:
   - View live IoT Cold-Chain sensor readouts (Temperature -18.4°C, Humidity 42%, Compressor RUNNING, Battery 94%).
   - Observe the **Spoilage Countdown Risk Calculator** (e.g., "Critical Spoilage Window: 4h 15m if unpowered").
   - Click **"Voice Status"** to hear automated audio telemetry readout.
   - Test the quick **"Print NDMA Manifest"** and **"Satellite SMS"** triggers.

6. **Offline-First Field Officer Reporting (`/field-reports`)**:
   - Demonstrate the "Fetch Device Coordinates" GPS button.
   - Click **"Save Offline Draft"** for instant local browser caching during disconnected mountain operations.
   - Click **"Sync Now"** to push the draft to the central database, instantly updating the live incident grid.

7. **Multilingual Emergency Alerts (`/alerts`)**:
   - Toggle languages: English ➔ অসমীয়া (Assamese) ➔ বাংলা (Bengali) ➔ हिंदी (Hindi) ➔ মৈতৈলোন্ (Manipuri).
   - Demonstrate disaster communication inclusivity for local NER communities.

---

## 👥 5. Default Role Accounts for Testing

Use the quick role switcher in the top-right header to switch roles seamlessly:
- **Admin (Director General)**: `admin@northlink.gov.in`
- **Logistics Manager**: `logistics@northlink.gov.in`
- **Field Officer**: `field.officer@northlink.gov.in`
- **Convoy Driver**: `driver@northlink.gov.in`
- **Public Disaster Monitor**: `viewer@northlink.gov.in`

---

## 🏛️ 6. Project Directory Structure

```
northlink-ai/
├── docker-compose.yml              # PostGIS Docker Compose definition
├── prisma/
│   ├── schema.prisma               # Complete Prisma schema with PostGIS models
│   └── seed.js                     # Seed script for 8 NER states
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root shell layout with providers
│   │   ├── page.tsx                # Overview Dashboard
│   │   ├── live-map/page.tsx       # Fullscreen GIS Map
│   │   ├── route-intelligence/page.tsx # AI Route Intelligence Engine
│   │   ├── logistics/page.tsx      # GPS Fleet & Shipment Tracking
│   │   ├── incidents/page.tsx      # Hazard Management & Verification
│   │   ├── field-reports/page.tsx  # Offline-First Field Submission
│   │   ├── alerts/page.tsx         # Multilingual Emergency Alerts
│   │   ├── analytics/page.tsx      # Recharts Logistics Analytics
│   │   ├── admin/page.tsx          # Infrastructure Diagnostics & RBAC
│   │   ├── settings/page.tsx       # Scoring Sensitivity Settings
│   │   └── api/                    # RESTful Endpoints
│   ├── components/
│   │   ├── layout/Header.tsx
│   │   ├── layout/Sidebar.tsx
│   │   ├── gis/GisMap.tsx
│   │   ├── gis/MapContainerWrapper.tsx
│   │   └── dashboard/...
│   └── lib/
│       ├── ai-risk-engine.ts       # Transparent AI Risk Scoring
│       ├── db-fallback.ts          # Resilient Fallback Data Layer
│       ├── prisma.ts               # Prisma Client Singleton
│       ├── types.ts                # TypeScript Interfaces & Enums
│       └── ner-data.ts             # Geographic & Operational Seed Data
```

---

*NORTHLINK AI — Built for the North Eastern Region Smart Logistics Hackathon.*
