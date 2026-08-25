from datetime import datetime, timedelta

from flask import Blueprint, jsonify

from database.schema import Alert


monitoring_bp = Blueprint(
    "monitoring",
    __name__
)


# -----------------------------------------
# Monitoring Module Home
# -----------------------------------------

@monitoring_bp.route("/", methods=["GET"])
def monitoring_home():

    return jsonify({
        "module": "Monitoring Layer",
        "status": "Running"
    })


# -----------------------------------------
# Get All Recent Alerts
# -----------------------------------------

@monitoring_bp.route("/alerts", methods=["GET"])
def get_alerts():

    alerts = Alert.query.order_by(
        Alert.timestamp.desc()
    ).limit(100).all()

    return jsonify(
        [
            alert.to_dict()
            for alert in alerts
        ]
    )


# -----------------------------------------
# Monitoring Dashboard Data
# -----------------------------------------

@monitoring_bp.route("/live", methods=["GET"])
def get_live_monitoring():

    # -------------------------------------
    # Get Recent Alerts
    # -------------------------------------

    alerts = Alert.query.order_by(
        Alert.timestamp.desc()
    ).limit(50).all()


    # -------------------------------------
    # Threats Today
    # -------------------------------------

    today = datetime.utcnow().date()

    threats_today = Alert.query.filter(
        Alert.timestamp >= today
    ).count()


    # -------------------------------------
    # Active Connections
    # -------------------------------------

    active_connections = len(
        set(
            (
                alert.source_ip,
                alert.destination_ip,
                alert.source_port,
                alert.destination_port,
                alert.protocol
            )
            for alert in alerts
            if alert.source_ip
            and alert.destination_ip
        )
    )


    # -------------------------------------
    # Packet Statistics
    # -------------------------------------

    total_packets = sum(
        alert.packet_count or 0
        for alert in alerts
    )

    recent_alerts = [
        alert
        for alert in alerts
        if alert.timestamp
        and alert.timestamp >= (
            datetime.utcnow()
            - timedelta(minutes=1)
        )
    ]

    recent_packets = sum(
        alert.packet_count or 0
        for alert in recent_alerts
    )

    packets_per_second = round(
        recent_packets / 60,
        2
    )


    # -------------------------------------
    # Total Traffic
    # -------------------------------------

    total_bytes = sum(
        alert.total_bytes or 0
        for alert in alerts
    )

    bandwidth_mbps = round(
        (total_bytes * 8)
        / (1024 * 1024),
        3
    )


    # -------------------------------------
    # Traffic Chart
    # Group Recent Data By Time
    # -------------------------------------

    traffic_chart = []

    for alert in reversed(alerts[:20]):

        if alert.timestamp:

            traffic_chart.append({
                "time": alert.timestamp.strftime(
                    "%H:%M:%S"
                ),

                "packets":
                    alert.packet_count or 0
            })


    # -------------------------------------
    # Recent Traffic Table
    # -------------------------------------

    traffic = []

    for alert in alerts[:20]:

        traffic.append({

            "id": alert.id,

            "source_ip":
                alert.source_ip,

            "destination_ip":
                alert.destination_ip,

            "source_port":
                alert.source_port,

            "destination_port":
                alert.destination_port,

            "protocol":
                alert.protocol,

            "service":
                alert.service,

            "packets":
                alert.packet_count or 0,

            "bytes":
                alert.total_bytes or 0,

            "duration":
                alert.duration or 0,

            "attack":
                alert.attack,

            "severity":
                alert.severity,

            "status":
                "Threat"
                if alert.attack
                and alert.attack != "Normal"
                else "Normal",

            "timestamp":
                alert.timestamp.strftime(
                    "%H:%M:%S"
                )
                if alert.timestamp
                else None
        })


    # -------------------------------------
    # Active Devices
    # Derived From Real IP Addresses
    # -------------------------------------

    device_ips = set()

    for alert in alerts:

        if alert.source_ip:
            device_ips.add(
                alert.source_ip
            )

        if alert.destination_ip:
            device_ips.add(
                alert.destination_ip
            )


    devices = []

    for ip in list(device_ips)[:10]:

        devices.append({

            "name": ip,

            "ip": ip,

            "status": "Online"
        })


    # -------------------------------------
    # Final Monitoring Response
    # -------------------------------------

    return jsonify({

        "network_status": {

            "packets_per_second":
                packets_per_second,

            "active_connections":
                active_connections,

            "threats_today":
                threats_today,

            "bandwidth_mbps":
                bandwidth_mbps
        },


        "traffic_chart":
            traffic_chart,


        "traffic":
            traffic,


        "devices":
            devices,


        "summary": {

            "total_alerts":
                Alert.query.count(),

            "total_packets":
                total_packets,

            "active_devices":
                len(device_ips)
        }
    })