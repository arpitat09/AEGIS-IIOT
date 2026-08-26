import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that adds dynamic running footer with page numbers and header line."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 11 * inch - 36, "AEGIS-IIOT — Major Project Defense & System Architecture Guide")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)
        
        # Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 36, page_text)
        self.drawString(54, 36, "Confidential — Academic & IEEE Project Defense Reference")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 8.5 * inch - 54, 46)
        
        self.restoreState()

def create_project_pdf():
    pdf_filename = "/home/arpita/AEGIS-IIOT/AEGIS_IIOT_Project_Documentation_and_Architecture_Guide.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    C_PRIMARY = colors.HexColor("#0F172A")    # Deep Slate
    C_CYBER = colors.HexColor("#0D9488")      # Teal / Cyber Green
    C_ACCENT = colors.HexColor("#2563EB")     # Electric Blue
    C_CARD_BG = colors.HexColor("#F8FAFC")    # Clean Light Gray
    C_BORDER = colors.HexColor("#E2E8F0")     # Light Border
    C_DARK = colors.HexColor("#1E293B")       # Body Text
    C_MUTED = colors.HexColor("#64748B")      # Subtitles
    C_ALERT = colors.HexColor("#DC2626")      # Critical Red
    C_WARN = colors.HexColor("#D97706")       # Warning Amber

    # Custom Styles
    style_cover_title = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=C_PRIMARY,
        alignment=1, # Center
        spaceAfter=8
    )

    style_cover_sub = ParagraphStyle(
        'CoverSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=C_CYBER,
        alignment=1,
        spaceAfter=15
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=C_PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=C_CYBER,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=C_DARK,
        spaceAfter=6
    )

    style_body_bold = ParagraphStyle(
        'BodyBold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=C_DARK,
        spaceAfter=6
    )

    style_callout = ParagraphStyle(
        'Callout_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0F766E"),
    )

    style_code = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor("#1E293B"),
    )

    story = []

    # =========================================================================
    # COVER / HEADER BANNER
    # =========================================================================
    story.append(Paragraph("AEGIS-IIOT", style_cover_title))
    story.append(Paragraph("Adaptive Cyber Defense System for Industrial IoT Networks", style_cover_sub))
    story.append(Paragraph("<b>Comprehensive System Architecture, Technical Implementation & Major Project Viva Guide</b>", ParagraphStyle('SubSub', alignment=1, fontSize=10, textColor=C_MUTED, fontName='Helvetica', spaceAfter=12)))
    
    # Meta / Link Table
    meta_data = [
        [Paragraph("<b>Production Frontend:</b>", style_body), Paragraph("<font color='#0D9488'>https://aegis-iiot-frontend.vercel.app/</font>", style_body), Paragraph("<b>Status:</b>", style_body), Paragraph("<font color='#059669'><b>LIVE (Vercel)</b></font>", style_body)],
        [Paragraph("<b>Production API:</b>", style_body), Paragraph("<font color='#0D9488'>https://aegis-iiot.onrender.com</font>", style_body), Paragraph("<b>Status:</b>", style_body), Paragraph("<font color='#059669'><b>HEALTHY (Render)</b></font>", style_body)],
        [Paragraph("<b>Domain:</b>", style_body), Paragraph("Industrial IoT / OT / SCADA Cybersecurity", style_body), Paragraph("<b>ML Stack:</b>", style_body), Paragraph("Dual-Tier (Hybrid) + SHAP", style_body)],
    ]
    t_meta = Table(meta_data, colWidths=[100, 210, 60, 134])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 14))

    # =========================================================================
    # 1. EXECUTIVE SUMMARY & HIGH-LEVEL OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Project Executive Summary (Simple Overview)", style_h1))
    story.append(Paragraph(
        "<b>AEGIS-IIOT</b> is an enterprise-grade, real-time Intrusion Detection and Prevention System (IDPS) built specifically to protect Critical Infrastructure and Industrial IoT (IIoT) ecosystems—such as robotic assembly plants, SCADA automation controllers, smart energy grids, and water treatment facilities.",
        style_body
    ))
    story.append(Paragraph(
        "<b>Why traditional firewalls fail in IIoT:</b> Traditional IT security uses signature matching (looking only for previously known viruses). In operational technology (OT), machines run 24/7 under hard real-time timing constraints using specialized protocols like Modbus/TCP and OPC-UA. A single undetected zero-day exploit or false-positive system reboot can halt physical assembly lines and cause severe economic and physical damage.",
        style_body
    ))
    story.append(Paragraph(
        "<b>The AEGIS-IIOT Solution:</b> Our system sniffs raw wire packets in real time via Scapy raw sockets, aggregates them into stateful connection flows, extracts 41 statistical features, evaluates them through a <b>Dual-Tier Machine Learning Engine</b> (Isolation Forest + One-Class SVM for anomaly detection, LightGBM + XGBoost for attack classification), provides <b>SHAP Game-Theoretic Explainability</b>, computes a dynamic 0–100 threat score via <b>EWMA</b>, and executes automated, safe containment policies.",
        style_body
    ))
    story.append(Spacer(1, 10))

    # =========================================================================
    # 2. SYSTEM ARCHITECTURE DIAGRAM & LAYER-BY-LAYER EXPLANATION
    # =========================================================================
    story.append(Paragraph("2. Complete Software Architecture & Project Mapping", style_h1))
    story.append(Paragraph(
        "The AEGIS-IIOT project is structured around the <b>6-Layer Decoupled Software Architecture</b> specified in industrial cybersecurity standards. Below is the master architectural blueprint and the exact breakdown of how our project implements every single component:",
        style_body
    ))

    # Embed Architecture Image
    img_path = "/home/arpita/.gemini/antigravity/brain/fb2f1655-34da-4b26-9abe-c2a63cd17f0f/.user_uploaded/media_1787690509533.png"
    if os.path.exists(img_path):
        # 504 pt width fits page perfectly (8.5 * 72 - 108 = 504)
        img = Image(img_path, width=500, height=285)
        story.append(img)
        story.append(Spacer(1, 10))

    # Detailed Layer Explanations
    arch_details = [
        ("Layer 1: Data Ingestion Layer", 
         "<b>Diagram Components:</b> Packet Capture Module (tcpdump/Scapy), Syslog/SIEM Log Collector, Log Stream Parser, Message Buffer (RabbitMQ).<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/realtime/packet_capture.py</code> and <code>backend/realtime/flow_manager.py</code>. The module binds to low-level network sockets using Scapy, captures raw Ethernet/IP frames, tracks bidirectional communication states (SYN/ACK flags, session duration, byte transfer), and buffers packets for asynchronous feature extraction."),

        ("Layer 2: Preprocessing & Feature Engineering Layer", 
         "<b>Diagram Components:</b> Data Cleaning, Missing Value Handler, One-Hot Encoding, Feature Scaling (RobustScaler), Correlation Filter, PCA Reduction.<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/ml_pipeline/preprocess.py</code> and <code>backend/utils/feature_engineering.py</code>. It cleans raw flow statistics, imputes missing records, one-hot encodes categorical protocol strings (TCP, UDP, ICMP) and service ports (HTTP, SSH, Telnet, Modbus), scales the 41 features using <code>RobustScaler</code> (which is resistant to extreme outliers), and applies PCA for optimal dimensional representation."),

        ("Layer 3: Hybrid ML Detection Engine", 
         "<b>Diagram Components:</b> Tier 1 Anomaly Detection (Isolation Forest, One-Class SVM) + Tier 2 Attack Classification (XGBoost, LightGBM, CNN).<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/services/anomaly_detector.py</code>, <code>backend/services/classifier.py</code>, and <code>backend/services/predictor.py</code>. It uses a dual-tier cascade: Tier 1 (unsupervised) rapidly identifies whether incoming traffic deviates from normal industrial baseline behavior (catching zero-day exploits). Tier 2 (supervised ensemble of LightGBM + XGBoost) classifies confirmed threats into specific attack families: DoS, Probe, R2L, or U2R with >96% precision."),

        ("Layer 4: Explainability & Risk Analysis Layer", 
         "<b>Diagram Components:</b> SHAP Explainability Module, Feature Importance Extractor, Attack Confidence Scoring, Risk Assessment Engine.<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/services/shap_service.py</code> and <code>backend/services/risk_engine.py</code>. It uses TreeSHAP game-theoretic feature attribution to compute exact quantitative contribution values for every packet attribute (e.g., source bytes, failed logins), eliminating the 'black-box AI' barrier and providing security operators with transparent justification."),

        ("Layer 5: Severity & Prevention Engine", 
         "<b>Diagram Components:</b> Severity Classifier (Low/Medium/High/Critical), Risk Score Calculation, Policy Engine, Prevention & Response Actions (Alert Generator, Rate Limiter, Block IP, Firewall Rule Manager, Isolate Device).<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/services/threat_score_service.py</code> and <code>backend/routes/prevention.py</code>. It uses an <b>Exponentially Weighted Moving Average (EWMA)</b> algorithm to calculate real-time threat scores (0–100) and maps risk tiers to deterministic containment policies without risking operational downtime."),

        ("Layer 6: Monitoring, Reporting & API Layer", 
         "<b>Diagram Components:</b> REST API (Flask), Live Dashboard (Flask + React), Report Generator (PDF/CSV), Admin Panel (User Management), Notification Service.<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/routes/dashboard.py</code>, <code>backend/routes/events.py</code> (Server-Sent Events), and the React 19 Frontend. Provides a real-time SOC Command Center featuring live packet wave graphs, dynamic threat gauges, incident triage tables, and forensic PDF/CSV report exports."),

        ("Storage Layer & External Integrations", 
         "<b>Diagram Components:</b> MySQL/SQLite (Structured Users, Alerts, Policies), MongoDB (Unstructured Logs), File Storage (Reports & Pickles), Firewall/IDS & Audit Trail.<br/>"
         "<b>How AEGIS-IIOT Implements This:</b> Implemented in <code>backend/database/schema.py</code> (SQLite/SQLAlchemy models: <code>Alert</code>, <code>User</code>, <code>AuditLog</code>) storing 25,000+ indexed forensic events, model pickle weights in <code>backend/models/</code>, and immutable cryptographic audit logging for full traceability.")
    ]

    for title, desc in arch_details:
        story.append(Paragraph(title, style_h2))
        story.append(Paragraph(desc, style_body))
        story.append(Spacer(1, 4))

    story.append(PageBreak())

    # =========================================================================
    # 3. CODEBASE FILE TO ARCHITECTURE MAPPING TABLE
    # =========================================================================
    story.append(Paragraph("3. Codebase File Mapping to Architectural Blueprint", style_h1))
    story.append(Paragraph("Every component in the architecture diagram maps to clean, modular code in the AEGIS-IIOT repository:", style_body))
    
    mapping_data = [
        [Paragraph("<b>Architectural Layer</b>", style_body_bold), Paragraph("<b>Diagram Module</b>", style_body_bold), Paragraph("<b>Repository File Path</b>", style_body_bold), Paragraph("<b>Core Responsibility</b>", style_body_bold)],
        [Paragraph("Layer 1 (Ingestion)", style_body), Paragraph("Packet Capture & Flow Assembler", style_body), Paragraph("<code>backend/realtime/packet_capture.py</code><br/><code>backend/realtime/flow_manager.py</code>", style_code), Paragraph("Raw socket wire capture, TCP/IP flow tracking, bidirectional feature assembly.", style_body)],
        [Paragraph("Layer 2 (Preprocessing)", style_body), Paragraph("Encoding, RobustScaler, PCA", style_body), Paragraph("<code>backend/ml_pipeline/preprocess.py</code><br/><code>backend/utils/feature_engineering.py</code>", style_code), Paragraph("41-feature extraction, outlier-resistant RobustScaler, PCA reduction.", style_body)],
        [Paragraph("Layer 3 (Hybrid ML)", style_body), Paragraph("Tier 1 Anomaly + Tier 2 Classifier", style_body), Paragraph("<code>backend/services/predictor.py</code><br/><code>backend/services/anomaly_detector.py</code><br/><code>backend/services/classifier.py</code>", style_code), Paragraph("Isolation Forest & SVM (Tier 1) + LightGBM & XGBoost (Tier 2).", style_body)],
        [Paragraph("Layer 4 (Explainability)", style_body), Paragraph("SHAP Kernel & Risk Engine", style_body), Paragraph("<code>backend/services/shap_service.py</code><br/><code>backend/services/risk_engine.py</code>", style_code), Paragraph("TreeSHAP feature attributions and attack confidence scoring.", style_body)],
        [Paragraph("Layer 5 (Prevention)", style_body), Paragraph("Severity Classifier & Policy Actions", style_body), Paragraph("<code>backend/services/threat_score_service.py</code><br/><code>backend/routes/prevention.py</code>", style_code), Paragraph("EWMA 0–100 threat scoring, IP blocking, rate limiting, node isolation.", style_body)],
        [Paragraph("Layer 6 (SOC UI & API)", style_body), Paragraph("REST API, SSE, Live Dashboard", style_body), Paragraph("<code>backend/routes/dashboard.py</code><br/><code>backend/routes/events.py</code><br/><code>frontend/src/pages/Dashboard.jsx</code>", style_code), Paragraph("GET /api/dashboard/live, SSE push, React 19 SOC Command Center.", style_body)],
        [Paragraph("Storage & Auth", style_body), Paragraph("SQLite, RBAC & Audit Trail", style_body), Paragraph("<code>backend/database/schema.py</code><br/><code>backend/services/auth_service.py</code>", style_code), Paragraph("PBKDF2/SHA256 crypto auth, User roles (Admin/Analyst/Viewer), Audit logs.", style_body)],
    ]
    t_map = Table(mapping_data, colWidths=[80, 110, 160, 154])
    t_map.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0F172A")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BOX', (0,0), (-1,-1), 1, C_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 0.5, C_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(t_map)
    story.append(Spacer(1, 14))

    # =========================================================================
    # 4. MACHINE LEARNING MODELS & MATHEMATICAL FORMULATIONS
    # =========================================================================
    story.append(Paragraph("4. Machine Learning Models & Algorithms Explained", style_h1))
    
    ml_models = [
        ("1. Isolation Forest (Unsupervised Anomaly Detection - Tier 1)",
         "<b>Concept:</b> Isolation Forest works on the principle that anomalies are 'few and different'. It constructs randomized isolation trees to isolate observations. Anomalies require significantly fewer partitions (shorter tree path length) than normal operational traffic.<br/>"
         "<b>Why used in IIoT:</b> Rapidly isolates zero-day and stealthy network incursions without requiring pre-labeled attack data."),

        ("2. One-Class Support Vector Machine (One-Class SVM - Tier 1)",
         "<b>Concept:</b> Computes a non-linear hyperspherical boundary around normal factory telemetry in high-dimensional feature space using an RBF kernel. Any network packet falling outside this envelope is flagged as an outlier."),

        ("3. LightGBM & XGBoost (Supervised Multi-Class Classifiers - Tier 2)",
         "<b>Concept:</b> Highly optimized Gradient Boosted Decision Tree (GBDT) algorithms that sequentially train decision trees to minimize classification loss. We use an ensemble voting mechanism to categorize attacks into 4 classes: <b>DoS</b> (flooding), <b>Probe</b> (port scanning), <b>R2L</b> (unauthorized remote access), and <b>U2R</b> (privilege escalation).<br/>"
         "<b>Advantage over Deep Learning:</b> Sub-millisecond CPU inference latency, zero GPU requirement, and native compatibility with exact TreeSHAP algorithms."),

        ("4. SHAP (Shapley Additive exPlanations - Explainable AI)",
         "<b>Concept:</b> Grounded in cooperative game theory, SHAP allocates credit for model predictions across all 41 features. For any given alert, the prediction is expressed as: <br/>"
         "<code>f(x) = baseline_value + SUM(shap_value_i)</code><br/>"
         "This reveals whether high packet volume, abnormal duration, or specific destination ports drove the classification."),

        ("5. Exponentially Weighted Moving Average (EWMA Dynamic Threat Scoring)",
         "<b>Formula:</b> <code>S_t = alpha * SeverityModifier(Alert_t) + (1 - alpha) * S_{t-1}</code> (where alpha = 0.85).<br/>"
         "<b>Why necessary:</b> Prevents static averaging over large numbers of historical alerts. Allows the Current Threat Level to dynamically spike (85–100, CRITICAL) during active attack bursts and smoothly settle (15–35, SECURE) during normal operation.")
    ]

    for title, desc in ml_models:
        story.append(Paragraph(title, style_h2))
        story.append(Paragraph(desc, style_body))
        story.append(Spacer(1, 3))

    story.append(PageBreak())

    # =========================================================================
    # 5. VIVA PRESENTATION SCRIPT & DEFENSE QUESTIONS
    # =========================================================================
    story.append(Paragraph("5. Major Project Defense & Viva Script (5-Minute Walkthrough)", style_h1))
    story.append(Paragraph(
        "<b>Introduction & Problem Statement:</b> 'Good morning respected examiners. Our project is <b>AEGIS-IIOT: Adaptive Cyber Defense System for Industrial IoT Networks</b>. In industrial automation, robotics, and smart grids, traditional signature firewalls cannot detect zero-day attacks, and deep learning models are too slow and opaque. AEGIS-IIOT is a full-stack, real-time intrusion detection and prevention platform.'",
        style_body
    ))
    story.append(Paragraph(
        "<b>Architecture & Pipeline:</b> 'Our system implements a 6-layer architecture: (1) Wire packet capture via Scapy, (2) Feature extraction into 41 parameters, (3) A Dual-Tier ML engine combining Isolation Forest anomaly detection with LightGBM/XGBoost classification, (4) SHAP explainable AI, (5) Dynamic EWMA risk assessment, and (6) A real-time SOC Command Center dashboard.'",
        style_body
    ))
    story.append(Paragraph(
        "<b>Live Verification & Deployment:</b> 'We have deployed the complete system live in production—Frontend on Vercel CDN and Backend API on Render Cloud—with cryptographic role-based access control, real-time packet telemetry waves, and deterministic incident containment.'",
        style_body
    ))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Top Examiner Questions & Model Answers:", style_h2))
    
    qa_list = [
        ("Q1: Why did you choose Gradient Boosted Trees over Deep Learning (CNN/LSTM)?",
         "<b>Answer:</b> Industrial IoT operates under strict sub-second latency constraints. LightGBM and XGBoost execute inference in under 2 milliseconds on standard CPU hardware without requiring heavy GPUs, demonstrate superior accuracy on tabular network flow features, and support exact game-theoretic TreeSHAP explainability."),
        
        ("Q2: How do you handle class imbalance in cybersecurity datasets?",
         "<b>Answer:</b> We address the extreme rarity of U2R/R2L attacks through cost-sensitive loss weighting in LightGBM/XGBoost, stratified cross-validation, and our Tier 1 unsupervised Isolation Forest, which detects anomalies independently of training label distributions."),

        ("Q3: How does your system prevent false-positive lockouts in industrial plants?",
         "<b>Answer:</b> AEGIS-IIOT implements a Guarded Policy Engine with 3 operating modes: <i>Monitor Mode</i> (passive detection), <i>Alert Mode</i> (operator recommendations), and <i>Prevention Mode</i> (deterministic automated IP rate-limiting and session termination without halting critical device processes)."),

        ("Q4: How does real-time communication work between Flask and React?",
         "<b>Answer:</b> We use a dual approach: Server-Sent Events (SSE) on <code>/api/stream/events</code> for instantaneous, zero-latency alert pushing, combined with a unified <code>GET /api/dashboard/live</code> polling endpoint that delivers synchronized dashboard telemetry in a single payload.")
    ]

    for q, a in qa_list:
        story.append(Paragraph(q, style_body_bold))
        story.append(Paragraph(a, style_body))
        story.append(Spacer(1, 4))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully generated: {pdf_filename}")

if __name__ == "__main__":
    create_project_pdf()
