from collections import defaultdict

import threading
import time

from scapy.layers.inet import (
    IP,
    TCP,
    UDP
)

from realtime.feature_extractor import (
    build_flow_features,
    get_protocol,
    get_service
)

from services.realtime_predictor import (
    predict_realtime
)


# ---------------------------------------
# Active Network Flows
# ---------------------------------------

flows = defaultdict(dict)


FLOW_TIMEOUT = 10


flow_lock = threading.Lock()


# ---------------------------------------
# Flask Application Reference
# ---------------------------------------

flask_app = None


# ---------------------------------------
# Configure Flask Application
# ---------------------------------------

def set_flask_app(app):

    global flask_app

    flask_app = app


# ---------------------------------------
# Flow Identification
# ---------------------------------------

def get_flow_key(packet):

    if not packet.haslayer(IP):

        return None


    src_ip = packet[IP].src

    dst_ip = packet[IP].dst


    src_port = 0

    dst_port = 0


    protocol = packet[IP].proto


    if packet.haslayer(TCP):

        src_port = (
            packet[TCP].sport
        )

        dst_port = (
            packet[TCP].dport
        )


    elif packet.haslayer(UDP):

        src_port = (
            packet[UDP].sport
        )

        dst_port = (
            packet[UDP].dport
        )


    return (

        src_ip,

        dst_ip,

        src_port,

        dst_port,

        protocol
    )


# ---------------------------------------
# Process Incoming Packet
# ---------------------------------------

def process_packet(packet):

    if not packet.haslayer(IP):

        return


    flow_key = get_flow_key(
        packet
    )


    if flow_key is None:

        return


    current_time = time.time()


    with flow_lock:


        if flow_key not in flows:


            src_port = 0

            dst_port = 0


            if packet.haslayer(TCP):

                src_port = (
                    packet[TCP].sport
                )

                dst_port = (
                    packet[TCP].dport
                )


            elif packet.haslayer(UDP):

                src_port = (
                    packet[UDP].sport
                )

                dst_port = (
                    packet[UDP].dport
                )


            flows[flow_key] = {

                "packets": [],

                "start_time":
                    current_time,

                "last_seen":
                    current_time,

                "src_ip":
                    packet[IP].src,

                "dst_ip":
                    packet[IP].dst,

                "src_port":
                    src_port,

                "dst_port":
                    dst_port,

                "protocol":
                    get_protocol(
                        packet
                    ),

                "service":
                    get_service(
                        packet
                    )
            }


        flows[flow_key][
            "packets"
        ].append(
            packet
        )


        flows[flow_key][
            "last_seen"
        ] = current_time


# ---------------------------------------
# Background Flow Cleanup
# ---------------------------------------

def cleanup_expired_flows():

    while True:


        current_time = time.time()


        completed_flows = []


        with flow_lock:


            expired_keys = []


            for flow_key, flow in list(
                flows.items()
            ):


                inactive_time = (

                    current_time

                    - flow[
                        "last_seen"
                    ]

                )


                if inactive_time >= (
                    FLOW_TIMEOUT
                ):

                    expired_keys.append(
                        flow_key
                    )


            for flow_key in expired_keys:


                flow = flows.pop(
                    flow_key
                )


                completed_flows.append(
                    flow
                )


        # -----------------------------------
        # Process Outside Lock
        # -----------------------------------

        for flow in completed_flows:

            process_flow(
                flow
            )


        time.sleep(1)


# ---------------------------------------
# Process Completed Flow
# ---------------------------------------

def process_flow(flow):

    try:


        if flask_app is None:


            print(

                "Real-time flow error: "

                "Flask app context has not "

                "been configured."

            )


            return


        # -----------------------------------
        # Build ML Features
        # -----------------------------------

        features = (
            build_flow_features(
                flow
            )
        )


        if features is None:

            return


        # -----------------------------------
        # Calculate Real Flow Statistics
        # -----------------------------------

        packet_count = len(
            flow["packets"]
        )


        total_bytes = sum(

            len(packet)

            for packet in flow[
                "packets"
            ]

        )


        duration = (

            flow["last_seen"]

            - flow["start_time"]

        )


        # -----------------------------------
        # Real-Time Metadata
        # -----------------------------------

        metadata = {

            "source_ip":
                flow["src_ip"],

            "destination_ip":
                flow["dst_ip"],

            "source_port":
                flow["src_port"],

            "destination_port":
                flow["dst_port"],

            "protocol":
                flow["protocol"],

            "service":
                flow["service"],

            "packet_count":
                packet_count,

            "total_bytes":
                total_bytes,

            "duration":
                round(
                    duration,
                    4
                ),

            "detection_source":
                "realtime"
        }


        # -----------------------------------
        # Run Hybrid ML Detection
        # -----------------------------------

        with flask_app.app_context():


            result = predict_realtime(

                features,

                metadata

            )


        # -----------------------------------
        # Terminal Display
        # -----------------------------------

        print("\n")


        print(
            "===================================="
        )


        print(
            "      AEGIS-IIOT LIVE DETECTION"
        )


        print(
            "===================================="
        )


        print(
            "Source IP:",
            result.get("source_ip")
        )


        print(
            "Destination IP:",
            result.get("destination_ip")
        )


        print(
            "Protocol:",
            result.get("protocol")
        )


        print(
            "Service:",
            result.get("service")
        )


        print(
            "Attack:",
            result["attack"]
        )


        print(
            "Confidence:",
            result["confidence"]
        )


        print(
            "Risk Score:",
            result["risk_score"]
        )


        print(
            "Severity:",
            result["severity"]
        )


        print(
            "Action:",
            result["action"]
        )


        print(
            "===================================="
        )


    except Exception as e:


        print(

            "Real-time flow processing error:",

            str(e)

        )


# ---------------------------------------
# Start Cleanup Thread
# ---------------------------------------

def start_flow_cleanup():

    cleanup_thread = threading.Thread(

        target=cleanup_expired_flows,

        daemon=True
    )


    cleanup_thread.start()


    print(
        "Real-time flow cleanup service started"
    )