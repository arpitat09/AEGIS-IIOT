from flask import Blueprint, send_file
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)
from io import BytesIO


architecture_bp = Blueprint(
    "architecture",
    __name__,
)


@architecture_bp.route(
    "/download",
    methods=["GET"],
)
def download_architecture():

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=45,
        bottomMargin=45,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ArchitectureTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        leading=28,
        textColor=colors.HexColor("#0F172A"),
        spaceAfter=12,
    )

    subtitle_style = ParagraphStyle(
        "ArchitectureSubtitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        leading=15,
        textColor=colors.HexColor("#64748B"),
        spaceAfter=25,
    )

    heading_style = ParagraphStyle(
        "ArchitectureHeading",
        parent=styles["Heading2"],
        fontSize=15,
        leading=20,
        textColor=colors.HexColor("#2563EB"),
        spaceBefore=15,
        spaceAfter=10,
    )

    body_style = ParagraphStyle(
        "ArchitectureBody",
        parent=styles["BodyText"],
        fontSize=10,
        leading=16,
        textColor=colors.HexColor("#334155"),
        spaceAfter=8,
    )

    story = []

    # ==========================================
    # TITLE
    # ==========================================

    story.append(
        Paragraph(
            "AEGIS-IIOT System Architecture",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "Adaptive Cyber Defense Architecture for Industrial Internet of Things Environments",
            subtitle_style,
        )
    )

    # ==========================================
    # OVERVIEW
    # ==========================================

    story.append(
        Paragraph(
            "1. Architecture Overview",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            "AEGIS-IIOT is designed as a six-layer hybrid cybersecurity framework that continuously monitors industrial network activity, detects anomalies, classifies cyberattacks, explains machine learning decisions and automatically applies adaptive prevention actions.",
            body_style,
        )
    )

    # ==========================================
    # SIX LAYERS
    # ==========================================

    story.append(
        Paragraph(
            "2. Six-Layer Security Architecture",
            heading_style,
        )
    )

    layer_data = [
        [
            "Layer",
            "Primary Function",
            "Key Components",
        ],
        [
            "Layer 1",
            "Data Ingestion",
            "Packet Capture, Network Traffic, Device Logs, IIoT Sensors",
        ],
        [
            "Layer 2",
            "Data Preprocessing",
            "Data Cleaning, Normalization, Feature Extraction, Feature Selection",
        ],
        [
            "Layer 3",
            "Hybrid ML Detection",
            "Isolation Forest, One-Class SVM, XGBoost, LightGBM",
        ],
        [
            "Layer 4",
            "Explainability & Risk",
            "SHAP, Confidence Score, Risk Assessment, Severity Engine",
        ],
        [
            "Layer 5",
            "Adaptive Prevention",
            "Alerts, Rate Limiting, IP Blocking, Firewall Rules, Device Isolation",
        ],
        [
            "Layer 6",
            "Monitoring & Reporting",
            "Live Dashboard, Incident Center, Analytics, Reports",
        ],
    ]

    layer_table = Table(
        layer_data,
        colWidths=[
            70,
            130,
            280,
        ],
    )

    layer_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#2563EB"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, 0),
                    "CENTER",
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#CBD5E1"),
                ),
                (
                    "BACKGROUND",
                    (0, 1),
                    (-1, -1),
                    colors.HexColor("#F8FAFC"),
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.HexColor("#F8FAFC"),
                        colors.HexColor("#EFF6FF"),
                    ],
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    story.append(layer_table)

    story.append(
        Spacer(
            1,
            20,
        )
    )

    # ==========================================
    # HYBRID ML
    # ==========================================

    story.append(
        Paragraph(
            "3. Hybrid Machine Learning Framework",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            "<b>Stage A — Unsupervised Anomaly Detection:</b> Isolation Forest and One-Class SVM analyse industrial traffic and identify unknown or abnormal behavior without requiring prior attack labels.",
            body_style,
        )
    )

    story.append(
        Paragraph(
            "<b>Stage B — Supervised Attack Classification:</b> XGBoost and LightGBM classify suspicious traffic into specific cyberattack categories.",
            body_style,
        )
    )

    # ==========================================
    # DATA FLOW
    # ==========================================

    story.append(
        Paragraph(
            "4. System Data Flow",
            heading_style,
        )
    )

    data_flow = [
        [
            "IIoT Devices",
            "→",
            "Data Ingestion",
            "→",
            "Preprocessing",
            "→",
            "Hybrid ML",
            "→",
            "Risk Analysis",
            "→",
            "Adaptive Prevention",
            "→",
            "Dashboard",
        ]
    ]

    flow_table = Table(
        data_flow,
        colWidths=[
            58,
            15,
            58,
            15,
            58,
            15,
            58,
            15,
            58,
            15,
            58,
            15,
            58,
        ],
    )

    flow_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#EFF6FF"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#1E3A8A"),
                ),
                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER",
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#BFDBFE"),
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, -1),
                    "Helvetica-Bold",
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    10,
                ),
            ]
        )
    )

    story.append(flow_table)

    story.append(
        Spacer(
            1,
            20,
        )
    )

    # ==========================================
    # TECHNOLOGY STACK
    # ==========================================

    story.append(
        Paragraph(
            "5. Technology Stack",
            heading_style,
        )
    )

    technology_data = [
        [
            "Component",
            "Technologies",
        ],
        [
            "Frontend",
            "React, Material UI, Framer Motion",
        ],
        [
            "Backend",
            "Python, Flask, REST APIs",
        ],
        [
            "Machine Learning",
            "Scikit-learn, XGBoost, LightGBM",
        ],
        [
            "Explainability",
            "SHAP",
        ],
        [
            "Deployment",
            "Vite, Local / Cloud Deployment",
        ],
    ]

    technology_table = Table(
        technology_data,
        colWidths=[
            160,
            320,
        ],
    )

    technology_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#0F172A"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "BACKGROUND",
                    (0, 1),
                    (-1, -1),
                    colors.HexColor("#F8FAFC"),
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#CBD5E1"),
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    story.append(technology_table)

    # ==========================================
    # PREVENTION WORKFLOW
    # ==========================================

    story.append(
        Paragraph(
            "6. Adaptive Prevention Workflow",
            heading_style,
        )
    )

    story.append(
        Paragraph(
            "The prevention engine maps detected threats to appropriate security actions using severity and risk information. Low-risk events may generate monitoring alerts, while high-risk or critical threats can trigger rate limiting, IP blocking, firewall rule updates or device isolation.",
            body_style,
        )
    )

    story.append(
        Spacer(
            1,
            20,
        )
    )

    story.append(
        Paragraph(
            "AEGIS-IIOT combines intelligent detection, explainable analysis and adaptive prevention to provide continuous cyber defense for industrial environments.",
            body_style,
        )
    )

    document.build(story)

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="AEGIS-IIOT-System-Architecture.pdf",
        mimetype="application/pdf",
    )