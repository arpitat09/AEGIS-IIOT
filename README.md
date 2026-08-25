<div align="center">

# 🛡️ AEGIS-IIOT
### Adaptive Cyber Defense System for Industrial IoT Networks

[![Live Demo](https://img.shields.io/badge/Live%20Platform-Vercel%20Production-00E5A8?style=for-the-badge&logo=vercel&logoColor=black)](https://aegis-iiot-frontend.vercel.app/)
[![Backend API](https://img.shields.io/badge/API%20Engine-Render%20Cloud-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://aegis-iiot.onrender.com/api/health)
[![Python](https://img.shields.io/badge/Python-3.10.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>An Enterprise-Grade Intrusion Detection & Prevention System (IDPS) combining Scapy real-time packet capture, dual-tier hybrid machine learning, SHAP explainable AI, dynamic EWMA threat scoring, and automated containment for Critical Infrastructure & Industrial IoT ecosystems.</b>
</p>

[Explore Live Platform](https://aegis-iiot-frontend.vercel.app/) • [Architecture](#-system-architecture) • [Key Capabilities](#-key-capabilities) • [API Documentation](#-api-endpoints) • [Local Setup](#-quick-start) • [Deployment](#-deployment)

---

</div>

## 🌐 Live Platform Access & Demo Credentials

| Resource | URL | Status |
| :--- | :--- | :--- |
| **Frontend Console** | [https://aegis-iiot-frontend.vercel.app/](https://aegis-iiot-frontend.vercel.app/) | `● Online (Vercel CDN)` |
| **Backend SOC API** | [https://aegis-iiot.onrender.com](https://aegis-iiot.onrender.com) | `● Healthy (Render Cloud)` |

### 🔑 Pre-Configured SOC Test Accounts

| Role | Username | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@aegis-iiot.sec` | `Admin@Aegis2026!SOC` | Full Platform, User Management, Audit Logs |
| **Security Analyst** | `analyst@aegis-iiot.sec` | `Analyst@Aegis2026!SOC` | Live Monitoring, Incident Triage, Containment |
| **Viewer** | `viewer@aegis-iiot.sec` | `Viewer@Aegis2026!SOC` | Read-only Telemetry & Forensics Reports |

---

## ⚡ Key Capabilities

- **🚀 Real-Time Network Packet Ingestion**: Sub-second packet sniffing via **Scapy raw sockets**, tracking bidirectional connection states and extracting 41 flow features per packet.
- **🧠 Dual-Tier Hybrid ML Pipeline**:
  - **Tier 1 (Unsupervised Anomaly Detection)**: Isolation Forest + One-Class SVM for zero-day and stealthy outlier identification.
  - **Tier 2 (Supervised Attack Classification)**: LightGBM + XGBoost voting ensemble classifying attacks into `DoS`, `Probe`, `R2L`, `U2R`, or `Normal`.
- **🔍 Explainable AI (SHAP Tree Attribution)**: Transparent explanations revealing the exact network flow features (duration, byte volume, error rates) driving every prediction.
- **📈 Dynamic EWMA Threat Scoring**: Exponentially Weighted Moving Average ($\alpha = 0.85$) mapping live incursion bursts into a responsive 0–100 threat assessment level.
- **🛡️ Adaptive Prevention & Containment**: Deterministic rule execution providing automated IP blocking, session termination, and PLC node isolation.
- **📊 SOC Command Center**: Dark cyber telemetry dashboard with real-time packet velocity area waves, live alerts stream, and attack distribution donut charts.
- **🔐 Enterprise Security & Audit Logging**: Cryptographic **PBKDF2/SHA256** password hashing, HMAC token authentication, and immutable security audit logs.

---

## 🏗️ System Architecture

AEGIS-IIOT is designed as a decoupled 6-layer architecture engineered for high throughput and industrial operational reliability:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LAYER 1: DATA INGESTION                               │
│  Scapy Wire Sniffing • Industrial Modbus/TCP Sockets • PCAP File Processing │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  LAYER 2: PREPROCESSING & FEATURE PIPELINE                  │
│  Stateful Flow Manager • RobustScaler (Outlier Safe) • PCA Dimensionality    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    LAYER 3: DUAL-TIER HYBRID ML ENGINE                      │
│  [ Tier 1 ]: Isolation Forest & One-Class SVM (Outlier Detection)           │
│  [ Tier 2 ]: LightGBM & XGBoost Ensemble (Multi-Class Classification)       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                LAYER 4: EXPLAINABILITY & DYNAMIC RISK ENGINE                │
│  SHAP Kernel Feature Attribution • EWMA Real-Time Incursion Scoring (0–100) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  LAYER 5: ADAPTIVE PREVENTION CONTROLS                      │
│  Deterministic Containment Policy • Block IP • Rate Limiting • Node Isolation│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                LAYER 6: SOC TELEMETRY & MONITORING CONSOLE                  │
│  Flask REST API Gateway • Server-Sent Events (SSE) • React 19 SOC Dashboard │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

<table align="center">
  <tr>
    <th>Category</th>
    <th>Technologies</th>
  </tr>
  <tr>
    <td><b>Frontend</b></td>
    <td>React 19, Vite, Material UI (MUI 9), Recharts, Framer Motion, Axios, React Router</td>
  </tr>
  <tr>
    <td><b>Backend</b></td>
    <td>Python 3.10, Flask, Flask-CORS, Flask-SQLAlchemy, Gunicorn</td>
  </tr>
  <tr>
    <td><b>Machine Learning & AI</b></td>
    <td>LightGBM, XGBoost, Scikit-Learn (Isolation Forest, One-Class SVM), SHAP, NumPy, Pandas</td>
  </tr>
  <tr>
    <td><b>Network Telemetry</b></td>
    <td>Scapy (Raw Socket Ingestion), Flow Manager, Server-Sent Events (SSE)</td>
  </tr>
  <tr>
    <td><b>Database & Security</b></td>
    <td>SQLite, PBKDF2/SHA-256 Hashing, HMAC Token Auth, Immutable Audit Logs</td>
  </tr>
  <tr>
    <td><b>Deployment & DevOps</b></td>
    <td>Vercel (Frontend CDN), Render (Backend Cloud), Docker, Docker Compose, Nginx</td>
  </tr>
</table>

---

## 📁 Repository Structure

```
AEGIS-IIOT/
├── backend/
│   ├── app.py                      # Flask Application Server Entrypoint
│   ├── config.py                   # Environment & Database Configurations
│   ├── database/
│   │   ├── database.db             # Persistent SQLite Security Database
│   │   └── schema.py               # Alert, User, and AuditLog ORM Models
│   ├── ml_pipeline/
│   │   ├── config.py               # ML Pipeline Hyperparameters & Features
│   │   ├── loader.py               # Model Persistence Loader
│   │   └── preprocess.py           # Preprocessing & Scaling Pipeline
│   ├── models/                     # Trained Serialized Weights & Pickles
│   │   ├── lightgbm.pkl            # LightGBM Classifier
│   │   ├── xgboost.pkl             # XGBoost Classifier
│   │   ├── isolation_forest.pkl    # Isolation Forest Anomaly Model
│   │   ├── oneclass_svm.pkl        # One-Class SVM Model
│   │   ├── scaler.pkl              # RobustScaler Transformer
│   │   └── pca.pkl                 # Principal Component Transformer
│   ├── realtime/
│   │   ├── packet_capture.py       # Scapy Raw Socket Ingestion Engine
│   │   ├── flow_manager.py         # Bidirectional Flow Assembler
│   │   └── feature_extractor.py    # 41-Dimensional Feature Extractor
│   ├── routes/
│   │   ├── dashboard.py            # Unified GET /api/dashboard/live
│   │   ├── monitoring.py           # Real-Time Telemetry & Socket Endpoints
│   │   ├── incidents.py            # Incident Lifecycle Triage & Containment
│   │   ├── reports.py              # Forensic Summaries & Threat Intel
│   │   ├── auth.py                 # RBAC Login, User Mgmt & Audit Logs
│   │   ├── system.py               # Live Engine Health & Status
│   │   └── events.py               # Server-Sent Events (SSE) Stream
│   ├── services/
│   │   ├── predictor.py            # Hybrid ML Inference Engine
│   │   ├── threat_score_service.py # EWMA Dynamic Risk Engine
│   │   ├── risk_engine.py          # Severity & Attack-Aware Mapping
│   │   ├── auth_service.py         # Cryptographic Auth & RBAC Seeder
│   │   └── shap_service.py         # SHAP Feature Contribution Service
│   ├── requirements.txt            # Python Dependencies
│   └── test_api.py                 # Automated Backend Verification Suite
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/             # Badges, Navbar, Sidebar, SystemStatusBar
│   │   │   ├── dashboard/          # ThreatGauge, TrafficChart, OverviewCards, etc.
│   │   │   └── incidents/          # Incident Triage & Response Controls
│   │   ├── features/landing/       # Cyber Landing Page, Topology Canvas, Pipeline
│   │   ├── context/                # AuthContext & Session Management
│   │   ├── hooks/                  # useRealtimeStream (SSE Hook)
│   │   ├── pages/                  # Dashboard, Incidents, Reports, Login, Home, etc.
│   │   ├── routes/                 # AppRoutes & ProtectedRoute RBAC Guards
│   │   ├── services/               # Axios API Client & Unified Dashboard Hook
│   │   └── theme/                  # SOC Color Tokens & Typography
│   ├── public/                     # Static Assets & Netlify _redirects
│   ├── vercel.json                 # Vercel SPA Routing Rewrites
│   ├── package.json                # Frontend Dependencies (React 19, MUI 9)
│   └── vite.config.js              # Vite Build Configuration
│
├── Dockerfile.backend              # Backend Container Definition (Python 3.10)
├── Dockerfile.frontend             # Frontend Container Definition (Node + Nginx)
├── docker-compose.yml              # Unified Multi-Container Compose Config
├── render.yaml                     # Render 1-Click Cloud Deployment Blueprint
└── README.md                       # Project Documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/arpitat09/AEGIS-IIOT.git
cd AEGIS-IIOT
```

### 3. Backend Setup
```bash
# Navigate to backend and create virtual environment
python3 -m venv backend/venv
source backend/venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Run automated backend test suite
PYTHONPATH=backend python backend/test_api.py

# Start Flask backend server
PYTHONPATH=backend python backend/app.py
```
> The backend server will start on `http://127.0.0.1:5000`.

### 4. Frontend Setup
In a new terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
> The frontend will be live at `http://localhost:5173`.

---

## 🐳 Docker Deployment

To launch the entire platform in isolated containers with a single command:

```bash
docker compose up --build -d
```
- **Frontend Web App**: `http://localhost:80`
- **Backend API**: `http://localhost:5000`

---

## 🔌 API Endpoints Reference

### 📊 Dashboard & Monitoring
- `GET /api/dashboard/live`: Unified single-source telemetry payload for Command Center.
- `GET /api/reports/summary`: Aggregate alert statistics, risk scores, and attack distributions.
- `GET /api/system/threat-score`: Real-time EWMA dynamic threat score (0–100) and trend percentage.
- `GET /api/system/status`: Live operational status of Backend, ML Engine, Scapy Ingestion, and DB.
- `GET /api/stream/events`: Server-Sent Events (SSE) stream for zero-latency alert push.

### 🛡️ Incidents & Containment
- `GET /api/incidents`: Fetch paginated security incident records with severity filters.
- `PATCH /api/incidents/<id>`: Update incident status (`Investigating`, `Contained`, `Resolved`).
- `GET /api/prevention/`: Retrieve automated prevention recommendations and containment rules.

### 🔐 Authentication & Governance
- `POST /api/auth/login`: Authenticate SOC user and issue signed Bearer token.
- `GET /api/auth/me`: Validate active session token and retrieve role permissions.
- `GET /api/auth/audit-logs`: Retrieve immutable security audit events (Admin only).

---

## 🏭 Target Industrial IoT Environments

- **🏭 Smart Manufacturing**: High-speed robotics, CNC machines, assembly line controllers.
- **⚡ Smart Energy & Utilities**: Electrical substation automation, smart microgrids, solar arrays.
- **🎛️ SCADA & Industrial Automation**: Supervisory control systems, PLCs, Modbus/TCP gateways.
- **🚆 Connected Infrastructure**: Smart city transit controls, municipal water filtration facilities.
- **📡 IIoT Sensor Arrays**: OPC-UA telemetry nodes, vibration sensors, BACnet facility networks.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <b>AEGIS-IIOT — Defending Industrial Infrastructure with Real-Time Machine Intelligence.</b>
</div>
