from flask import Blueprint, jsonify, send_file
from sqlalchemy import func

from database.schema import db, Alert

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak
)

from io import BytesIO
from datetime import datetime, timedelta


# -----------------------------------
# Blueprint
# -----------------------------------

reports_bp = Blueprint(
    "reports",
    __name__
)


# -----------------------------------
# Shared Report Data
# -----------------------------------

def get_report_data():

    now = datetime.utcnow()
    dashboard_window = now - timedelta(minutes=5)

    # -----------------------------------
    # Total Alerts in Database
    # -----------------------------------
    total_alerts = (
        db.session.query(func.count(Alert.id)).scalar() or 0
    )

    # -----------------------------------
    # Recent Alerts (Top 20 latest)
    # -----------------------------------
    recent_query = (
        Alert.query.order_by(Alert.timestamp.desc()).limit(20).all()
    )

    recent_data = []
    for alert in recent_query:
        recent_data.append({
            "id": alert.id,
            "timestamp": (
                alert.timestamp.strftime("%Y-%m-%d %H:%M:%S")
                if alert.timestamp
                else "N/A"
            ),
            "attack": alert.attack or "Unknown",
            "severity": alert.severity or "Unknown",
            "risk_score": (
                float(alert.risk_score)
                if alert.risk_score is not None
                else 0
            ),
            "action": alert.action or "Alert",
            "source_ip": alert.source_ip or "N/A",
            "destination_ip": alert.destination_ip or "N/A",
            "protocol": alert.protocol or "TCP",
            "confidence": (
                float(alert.confidence)
                if alert.confidence is not None
                else 0
            ),
            "detection_source": alert.detection_source or "realtime"
        })

    # -----------------------------------
    # Severity Distribution
    # -----------------------------------
    severity_dist_query = (
        db.session.query(Alert.severity, func.count(Alert.id))
        .group_by(Alert.severity)
        .all()
    )
    severity_distribution = {
        sev: count for sev, count in severity_dist_query if sev
    }

    # -----------------------------------
    # Attack Distribution
    # -----------------------------------
    attack_dist_query = (
        db.session.query(Alert.attack, func.count(Alert.id))
        .group_by(Alert.attack)
        .all()
    )
    attack_distribution = {
        atk: count for atk, count in attack_dist_query if atk
    }

    # -----------------------------------
    # Action Distribution
    # -----------------------------------
    action_dist_query = (
        db.session.query(Alert.action, func.count(Alert.id))
        .group_by(Alert.action)
        .all()
    )
    action_distribution = {
        act: count for act, count in action_dist_query if act
    }

    # -----------------------------------
    # Threat Intelligence & Dynamic Score
    # -----------------------------------
    from services.threat_score_service import calculate_threat_score
    threat_intel = calculate_threat_score()
    average_risk_score = float(threat_intel["score"])

    # -----------------------------------
    # Critical & High Threat Counts
    # -----------------------------------
    critical_alerts = (
        Alert.query.filter(Alert.severity == "Critical").count()
    )
    high_alerts = (
        Alert.query.filter(Alert.severity == "High").count()
    )

    # -----------------------------------
    # Live Alert Count (Rolling 5m)
    # -----------------------------------
    live_count = (
        Alert.query.filter(Alert.timestamp >= dashboard_window).count()
    )

    # -----------------------------------
    # Real-Time Traffic Flow Time Series
    # -----------------------------------
    traffic_chart = []
    for alert in reversed(recent_query[:15]):
        if alert.timestamp:
            traffic_chart.append({
                "time": alert.timestamp.strftime("%H:%M:%S"),
                "packets": alert.packet_count or 14,
                "risk_score": float(alert.risk_score or 0),
                "severity": alert.severity or "Low",
                "attack": alert.attack or "Normal"
            })

    return {
        "total_alerts": total_alerts,
        "live_alert_count": live_count,
        "critical_alerts": critical_alerts,
        "high_alerts": high_alerts,
        "average_risk_score": average_risk_score,
        "threat_level": threat_intel,
        "severity_distribution": severity_distribution,
        "attack_distribution": attack_distribution,
        "action_distribution": action_distribution,
        "recent_alerts": recent_data,
        "traffic_chart": traffic_chart,
        "last_updated": now.strftime("%Y-%m-%d %H:%M:%S")
    }


# -----------------------------------
# Reports Home
# -----------------------------------

@reports_bp.route(
    "/",
    methods=["GET"]
)
def reports_home():

    return jsonify({
        "module": "Reports",
        "status": "Running"
    })


# -----------------------------------
# Reports Summary API
# -----------------------------------

@reports_bp.route(
    "/summary",
    methods=["GET"]
)
def reports_summary():

    report_data = (
        get_report_data()
    )

    response = jsonify(
        report_data
    )

    # Prevent browser/API caching
    response.headers[
        "Cache-Control"
    ] = (
        "no-store, no-cache, "
        "must-revalidate, max-age=0"
    )

    response.headers[
        "Pragma"
    ] = "no-cache"

    response.headers[
        "Expires"
    ] = "0"

    return response


# -----------------------------------
# PDF Report Download
# -----------------------------------

@reports_bp.route(
    "/download",
    methods=["GET"]
)
def download_report():

    report_data = (
        get_report_data()
    )


    # -----------------------------------
    # Create PDF in Memory
    # -----------------------------------

    pdf_buffer = BytesIO()


    document = SimpleDocTemplate(

        pdf_buffer,

        pagesize=A4,

        rightMargin=40,

        leftMargin=40,

        topMargin=40,

        bottomMargin=40
    )


    # -----------------------------------
    # Styles
    # -----------------------------------

    styles = getSampleStyleSheet()


    title_style = ParagraphStyle(

        "AEGISTitle",

        parent=styles["Title"],

        alignment=TA_CENTER,

        fontSize=22,

        leading=28,

        textColor=colors.HexColor(
            "#0f172a"
        ),

        spaceAfter=8
    )


    subtitle_style = ParagraphStyle(

        "AEGISSubtitle",

        parent=styles["Normal"],

        alignment=TA_CENTER,

        fontSize=10,

        leading=15,

        textColor=colors.HexColor(
            "#475569"
        ),

        spaceAfter=20
    )


    section_style = ParagraphStyle(

        "AEGISSection",

        parent=styles["Heading2"],

        fontSize=15,

        leading=20,

        textColor=colors.HexColor(
            "#1d4ed8"
        ),

        spaceBefore=12,

        spaceAfter=10
    )


    normal_style = ParagraphStyle(

        "AEGISNormal",

        parent=styles["Normal"],

        fontSize=10,

        leading=15,

        textColor=colors.HexColor(
            "#334155"
        )
    )


    # -----------------------------------
    # PDF Content
    # -----------------------------------

    story = []


    story.append(
        Paragraph(
            "AEGIS-IIOT Security Report",
            title_style
        )
    )


    story.append(
        Paragraph(
            (
                "Adaptive Cyber Defense for "
                "Industrial IoT Systems"
            ),
            subtitle_style
        )
    )


    generated_time = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )


    story.append(
        Paragraph(
            (
                f"<b>Generated:</b> "
                f"{generated_time}"
            ),
            normal_style
        )
    )


    story.append(
        Spacer(
            1,
            18
        )
    )


    # -----------------------------------
    # Security Summary
    # -----------------------------------

    story.append(
        Paragraph(
            "Security Summary",
            section_style
        )
    )


    summary_data = [

        [
            "Metric",
            "Value"
        ],

        [
            "Total Alerts",
            str(
                report_data.get(
                    "total_alerts",
                    0
                )
            )
        ],

        [
            "Live Alerts",
            str(
                report_data.get(
                    "live_alert_count",
                    0
                )
            )
        ],

        [
            "Critical Alerts",
            str(
                report_data.get(
                    "critical_alerts",
                    0
                )
            )
        ],

        [
            "High Alerts",
            str(
                report_data.get(
                    "high_alerts",
                    0
                )
            )
        ],

        [
            "Average Risk Score",
            str(
                report_data.get(
                    "average_risk_score",
                    0
                )
            )
        ]
    ]


    summary_table = Table(
        summary_data,
        colWidths=[
            3.2 * inch,
            2.2 * inch
        ]
    )


    summary_table.setStyle(

        TableStyle([

            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#1d4ed8")
            ),

            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white
            ),

            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),

            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER"
            ),

            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.HexColor("#cbd5e1")
            ),

            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),

            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#f8fafc")
                ]
            ),

            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                8
            ),

            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                8
            )
        ])
    )


    story.append(
        summary_table
    )


    story.append(
        Spacer(
            1,
            20
        )
    )


    # -----------------------------------
    # Attack Distribution
    # -----------------------------------

    story.append(
        Paragraph(
            "Attack Distribution",
            section_style
        )
    )


    attack_distribution = (
        report_data.get(
            "attack_distribution",
            {}
        )
    )


    if attack_distribution:

        attack_data = [

            [
                "Attack Type",
                "Count"
            ]
        ]


        for attack, count in (
            attack_distribution.items()
        ):

            attack_data.append(
                [
                    str(attack),
                    str(count)
                ]
            )


        attack_table = Table(
            attack_data,
            colWidths=[
                3.2 * inch,
                2.2 * inch
            ]
        )


        attack_table.setStyle(

            TableStyle([

                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#0f766e")
                ),

                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),

                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1")
                ),

                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER"
                )
            ])
        )


        story.append(
            attack_table
        )

    else:

        story.append(
            Paragraph(
                (
                    "No live attack activity "
                    "was detected in the "
                    "current monitoring window."
                ),
                normal_style
            )
        )


    story.append(
        Spacer(
            1,
            20
        )
    )


    # -----------------------------------
    # Recent Incidents
    # -----------------------------------

    story.append(
        Paragraph(
            "Recent Security Incidents",
            section_style
        )
    )


    recent_alerts = (
        report_data.get(
            "recent_alerts",
            []
        )
    )


    if recent_alerts:

        incident_data = [

            [
                "Time",
                "Attack",
                "Severity",
                "Risk"
            ]
        ]


        for alert in recent_alerts[:15]:

            incident_data.append(
                [

                    str(
                        alert.get(
                            "timestamp",
                            "N/A"
                        )
                    ),

                    str(
                        alert.get(
                            "attack",
                            "Unknown"
                        )
                    ),

                    str(
                        alert.get(
                            "severity",
                            "Unknown"
                        )
                    ),

                    str(
                        alert.get(
                            "risk_score",
                            0
                        )
                    )
                ]
            )


        incident_table = Table(
            incident_data,
            colWidths=[
                1.6 * inch,
                1.6 * inch,
                1.2 * inch,
                1.0 * inch
            ]
        )


        incident_table.setStyle(

            TableStyle([

                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#7c3aed")
                ),

                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),

                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),

                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#cbd5e1")
                ),

                (
                    "ALIGN",
                    (0, 0),
                    (-1, -1),
                    "CENTER"
                ),

                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8
                )
            ])
        )


        story.append(
            incident_table
        )

    else:

        story.append(
            Paragraph(
                (
                    "No live security incidents "
                    "were detected in the current "
                    "monitoring window."
                ),
                normal_style
            )
        )


    # -----------------------------------
    # Build PDF
    # -----------------------------------

    document.build(
        story
    )


    pdf_buffer.seek(
        0
    )


    return send_file(

        pdf_buffer,

        as_attachment=True,

        download_name=(
            "AEGIS-IIOT-Security-Report.pdf"
        ),

        mimetype="application/pdf"
    )


# ==================================================
# THREAT INTELLIGENCE AGGREGATION
# ==================================================

@reports_bp.route("/threat-intel", methods=["GET"])
def get_threat_intel():
    """
    Threat Intelligence analytics aggregated from real database alerts.
    """
    # 1. Top Attacking Source IPs
    top_sources_q = (
        db.session.query(
            Alert.source_ip,
            func.count(Alert.id).label("count"),
            func.avg(Alert.risk_score).label("avg_risk"),
            func.max(Alert.severity).label("max_sev"),
            func.max(Alert.attack).label("primary_attack")
        )
        .filter(Alert.source_ip != None)
        .group_by(Alert.source_ip)
        .order_by(func.count(Alert.id).desc())
        .limit(10)
        .all()
    )

    top_sources = [
        {
            "source_ip": s[0],
            "threat_count": s[1],
            "avg_risk": round(float(s[2] or 0), 1),
            "max_severity": s[3],
            "primary_attack": s[4]
        }
        for s in top_sources_q
    ]

    # 2. Most Targeted Destinations / Assets
    top_targets_q = (
        db.session.query(
            Alert.destination_ip,
            func.count(Alert.id).label("count"),
            func.avg(Alert.risk_score).label("avg_risk")
        )
        .filter(Alert.destination_ip != None)
        .group_by(Alert.destination_ip)
        .order_by(func.count(Alert.id).desc())
        .limit(8)
        .all()
    )

    top_targets = [
        {
            "destination_ip": t[0],
            "incident_count": t[1],
            "avg_risk": round(float(t[2] or 0), 1),
            "status": "High Exposure" if t[1] > 1000 else "Monitored"
        }
        for t in top_targets_q
    ]

    # 3. Protocol & Service Breakdown
    proto_q = (
        db.session.query(Alert.protocol, func.count(Alert.id))
        .filter(Alert.protocol != None)
        .group_by(Alert.protocol)
        .all()
    )
    protocol_distribution = {p[0]: p[1] for p in proto_q if p[0]}

    # 4. Attack Types
    attack_q = (
        db.session.query(Alert.attack, func.count(Alert.id))
        .filter(Alert.attack != None)
        .group_by(Alert.attack)
        .all()
    )
    attack_distribution = {a[0]: a[1] for a in attack_q if a[0]}

    return jsonify({
        "top_threat_sources": top_sources,
        "most_targeted_assets": top_targets,
        "protocol_distribution": protocol_distribution,
        "attack_distribution": attack_distribution,
        "total_analyzed_events": db.session.query(func.count(Alert.id)).scalar() or 0
    })