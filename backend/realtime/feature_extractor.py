import numpy as np

from scapy.layers.inet import IP, TCP, UDP, ICMP


def get_protocol(packet):

    if packet.haslayer(TCP):
        return "tcp"

    if packet.haslayer(UDP):
        return "udp"

    if packet.haslayer(ICMP):
        return "icmp"

    return "tcp"


def get_service(packet):

    if packet.haslayer(TCP):

        port = packet[TCP].dport

        if port == 80:
            return "http"

        if port == 443:
            return "http_443"

        if port == 21:
            return "ftp"

        if port == 22:
            return "ssh"

        if port == 23:
            return "telnet"

        if port == 25:
            return "smtp"

        if port == 53:
            return "domain"

    if packet.haslayer(UDP):

        port = packet[UDP].dport

        if port == 53:
            return "domain_u"

    return "other"


def get_flag(packet):

    if not packet.haslayer(TCP):
        return "SF"

    flags = packet[TCP].flags

    if flags == "S":
        return "S0"

    if flags == "SA":
        return "SF"

    if flags == "R":
        return "REJ"

    return "SF"


def build_flow_features(flow):

    packets = flow["packets"]

    if len(packets) == 0:
        return None

    first_packet = packets[0]

    duration = (
        flow["last_seen"]
        - flow["start_time"]
    )

    total_bytes = sum(
        len(packet)
        for packet in packets
    )

    src_bytes = total_bytes

    dst_bytes = 0

    # --------------------------------
    # Base NSL-KDD Features
    # --------------------------------

    features = {

        "duration": duration,

        "protocol_type":
            get_protocol(first_packet),

        "service":
            get_service(first_packet),

        "flag":
            get_flag(first_packet),

        "src_bytes": src_bytes,

        "dst_bytes": dst_bytes,

        "land": 0,

        "wrong_fragment": 0,

        "urgent": 0,

        "hot": 0,

        "num_failed_logins": 0,

        "logged_in": 0,

        "num_compromised": 0,

        "root_shell": 0,

        "su_attempted": 0,

        "num_root": 0,

        "num_file_creations": 0,

        "num_shells": 0,

        "num_access_files": 0,

        "num_outbound_cmds": 0,

        "is_host_login": 0,

        "is_guest_login": 0,

        "count": len(packets),

        "srv_count": len(packets),

        "serror_rate": 0,

        "srv_serror_rate": 0,

        "rerror_rate": 0,

        "srv_rerror_rate": 0,

        "same_srv_rate": 1,

        "diff_srv_rate": 0,

        "srv_diff_host_rate": 0,

        "dst_host_count": len(packets),

        "dst_host_srv_count": len(packets),

        "dst_host_same_srv_rate": 1,

        "dst_host_diff_srv_rate": 0,

        "dst_host_same_src_port_rate": 1,

        "dst_host_srv_diff_host_rate": 0,

        "dst_host_serror_rate": 0,

        "dst_host_srv_serror_rate": 0,

        "dst_host_rerror_rate": 0,

        "dst_host_srv_rerror_rate": 0,

        "difficulty": 0
    }

    return features