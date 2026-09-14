# 🚀 NORTHLINK AI — Smart Logistics & Accessibility Intelligence Platform

> **"Intelligence for Every Route"**  
> *AI-Powered Disaster Logistics, Geospatial Accessibility, and Rerouting Platform for the North Eastern Region (NER) of India.*

---

## 🏔️ 1. Executive Summary & Problem Statement
The North Eastern Region of India (Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, and Sikkim) faces acute logistical bottlenecks due to rugged mountain geography, annual monsoons, massive landslides, flash floods, and bridge subsidence.
When critical arteries like **NH-6 (Meghalaya–Barak Valley lifeline)** or **NH-10 (Sikkim Teesta corridor)** collapse, entire states are severed from essential supplies—especially cold-chain vaccines, life-saving medicines, food grains, and disaster relief.

**NORTHLINK AI** is an intelligent, command-center platform engineered to bridge this infrastructure vulnerability through:
1. **Real-Time GIS Accessibility Grid**: Multi-layer interactive map of 8 NER states showing open, restricted, and severed transport corridors.
2. **AI Route Intelligence Engine**: Transparent, explainable multi-factor predictive model assessing landslide proximity, river inundation, rainfall indices, road structural health, and slope gradient.
3. **Strategic Alternative Bypass Rerouting**: Evaluates alternative hill bypasses (e.g., bypassing NH-6 Sonapur landslide via NH-27 Lumding–Haflong link), calculating delay hours avoided and net safety gains.
4. **GPS Fleet & Cold-Chain Telemetry**: Live tracking of emergency convoys with simulated real-time movement and delivery timeline milestones.
5. **Offline-First Field Reporting**: Resilient browser-cached submission protocol for field officers operating in zero-connectivity mountain valleys with auto-sync.
6. **Multilingual Emergency Alerts**: Early-warning advisories in English, Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिंदी), and Manipuri (মৈতৈলোন্).

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
   - Select the preset: **Guwahati to Silchar (NH-6 Landslide Vulnerability)**.
   - Select Commodity: **MEDICINES (Cold-Chain Life Saving)**.
   - Click **"Analyze"**.
   - Observe the AI engine detect the catastrophic Sonapur Tunnel landslide on NH-6 (Risk: 88/100, CRITICAL, +4.5 hours delay).
   - Show the AI recommendation: **NH-27 Lumding–Haflong bypass** (Risk: 32/100, LOW), saving ~4.5 hours and ensuring cold-chain integrity.
   - Click **"Configurable Scoring Weights"** to demonstrate transparent factor weight tuning (Landslides, Floods, Rainfall, Roadbed).

3. **Live GIS Map & Spatial Inspector (`/live-map`)**:
   - Filter by State (e.g. "Meghalaya" or "Sikkim") and Incident Type.
   - Click on any red landslide or green corridor to inspect the feature in the side drawer.

4. **Logistics & GPS Fleet Tracking (`/logistics`)**:
   - Inspect active medicine shipment `NL-MED-2026-0901`.
   - Click **"Inspect Timeline"** to view milestone progression.
   - Observe the live GPS Simulation pill in the top header actively updating vehicle coordinates.

5. **Offline-First Field Officer Reporting (`/field-reports`)**:
   - Demonstrate the "Fetch Device Coordinates" GPS button.
   - Click **"Save Offline Draft"** to show instant local browser caching during disconnected valley conditions.
   - Click **"Sync Now"** to push the draft to the central database, where it immediately populates the live dashboard.

6. **Multilingual Emergency Alerts (`/alerts`)**:
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
