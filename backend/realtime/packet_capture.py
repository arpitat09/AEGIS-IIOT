import random
import time
from scapy.all import sniff
from scapy.layers.inet import IP, TCP, UDP, ICMP

from realtime.flow_manager import (
    process_packet,
    start_flow_cleanup,
    set_flask_app
)


def run_synthetic_traffic_generator():
    """
    Continuous realistic IIoT and cyber-threat packet generator fallback.
    Simulates industrial sensors (Modbus, MQTT, HTTP, DNS) and occasional attack patterns.
    """
    print("[AEGIS-IIOT] Switching to Simulated Industrial IIoT Traffic Engine...")

    device_ips = [
        "192.168.1.10", "192.168.1.15", "192.168.1.20",
        "192.168.1.45", "192.168.1.101", "10.0.0.5"
    ]
    target_servers = [
        "192.168.1.1", "192.168.1.2", "10.0.0.1"
    ]
    attack_ips = [
        "185.220.101.5", "45.154.255.88", "198.51.100.23", "203.0.113.44"
    ]

    services_ports = [
        (80, "http", "TCP"),
        (443, "http_443", "TCP"),
        (22, "ssh", "TCP"),
        (21, "ftp", "TCP"),
        (53, "domain_u", "UDP"),
        (502, "modbus", "TCP"),
        (1883, "mqtt", "TCP"),
    ]

    while True:
        try:
            # 80% normal traffic, 20% simulated threat/anomalous flow
            is_attack = random.random() < 0.25

            if is_attack:
                attack_type = random.choice(["DoS", "Probe", "R2L", "U2R"])
                src_ip = random.choice(attack_ips)
                dst_ip = random.choice(target_servers)

                if attack_type == "DoS":
                    # SYN flood / high volume burst
                    port, _, proto = (80, "http", "TCP")
                    for _ in range(random.randint(15, 30)):
                        pkt = IP(src=src_ip, dst=dst_ip) / TCP(sport=random.randint(1024, 65535), dport=port, flags="S")
                        process_packet(pkt)
                        time.sleep(0.01)

                elif attack_type == "Probe":
                    # Port scan / sweep
                    for test_port in random.sample([21, 22, 23, 80, 443, 502, 1883, 8080], 4):
                        pkt = IP(src=src_ip, dst=dst_ip) / TCP(sport=random.randint(1024, 65535), dport=test_port, flags="S")
                        process_packet(pkt)
                        time.sleep(0.02)

                elif attack_type == "R2L":
                    # Repeated unauthorized access attempt
                    pkt = IP(src=src_ip, dst=dst_ip) / TCP(sport=random.randint(1024, 65535), dport=22, flags="PA")
                    for _ in range(random.randint(5, 10)):
                        process_packet(pkt)
                        time.sleep(0.05)

                else: # U2R
                    pkt = IP(src=src_ip, dst=dst_ip) / TCP(sport=random.randint(1024, 65535), dport=23, flags="PA")
                    for _ in range(random.randint(3, 8)):
                        process_packet(pkt)
                        time.sleep(0.05)

            else:
                # Normal Industrial IoT Communication
                src_ip = random.choice(device_ips)
                dst_ip = random.choice(target_servers)
                port, _, proto = random.choice(services_ports)

                burst_size = random.randint(2, 6)
                sport = random.randint(1024, 65535)

                for _ in range(burst_size):
                    if proto == "TCP":
                        pkt = IP(src=src_ip, dst=dst_ip) / TCP(sport=sport, dport=port, flags="SA")
                    else:
                        pkt = IP(src=src_ip, dst=dst_ip) / UDP(sport=sport, dport=port)
                    process_packet(pkt)
                    time.sleep(0.02)

            time.sleep(random.uniform(1.5, 3.5))

        except Exception as e:
            print(f"[AEGIS-IIOT Simulation Error]: {e}")
            time.sleep(2)


def start_capture(app, interface=None):

    # Give flow manager access to Flask application
    set_flask_app(app)

    # Start background flow cleanup service
    start_flow_cleanup()

    print("====================================")
    print("AEGIS-IIOT REAL-TIME CAPTURE STARTED")
    print("====================================")

    print("Capturing LIVE network traffic...")

    print(
        f"Interface: "
        f"{interface if interface else 'Default Interface'}"
    )

    print(
        "Real packets will be converted into network flows "
        "and sent to the Hybrid ML detection engine."
    )

    print("====================================")

    try:

        sniff(
            iface=interface,
            prn=process_packet,
            store=False
        )

    except KeyboardInterrupt:

        print("\n====================================")
        print("AEGIS-IIOT REAL-TIME CAPTURE STOPPED")
        print("====================================")

    except Exception as error:

        print(
            f"Real-time packet capture permission/interface notice: {error}"
        )
        print("Activating AEGIS-IIOT live simulation engine...")
        run_synthetic_traffic_generator()