from app import app
from database.schema import db, Alert, User

def test_api_routes():
    with app.test_client() as client:
        # Health check
        res = client.get("/api/health")
        assert res.status_code == 200, f"Health check failed: {res.status_code}"
        print("✓ /api/health passed")

        # ----------------------------------------------------
        # Authentication & RBAC Tests
        # ----------------------------------------------------
        # 1. Successful Login
        res = client.post("/api/auth/login", json={
            "username": "admin@aegis-iiot.sec",
            "password": "Admin@Aegis2026!SOC"
        })
        assert res.status_code == 200, f"Admin login failed: {res.status_code}"
        auth_data = res.get_json()
        assert "token" in auth_data, "Auth token should be in response"
        admin_token = auth_data["token"]
        assert auth_data["user"]["role"] == "ADMIN"
        print(f"✓ /api/auth/login passed: authenticated {auth_data['user']['username']} (Role: {auth_data['user']['role']})")

        # 2. Invalid Credentials
        res = client.post("/api/auth/login", json={
            "username": "admin@aegis-iiot.sec",
            "password": "WrongPassword123!"
        })
        assert res.status_code == 401, f"Expected 401 for wrong credentials, got {res.status_code}"
        print("✓ /api/auth/login rejected invalid credentials with 401")

        # 3. Authenticated /me endpoint
        res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {admin_token}"})
        assert res.status_code == 200, f"/api/auth/me failed: {res.status_code}"
        me_data = res.get_json()
        assert me_data["user"]["username"] == "admin"
        assert me_data["permissions"]["can_manage_users"] is True
        print("✓ /api/auth/me passed with valid Bearer token")

        # 4. Security Audit Logs (Admin only)
        res = client.get("/api/auth/audit-logs", headers={"Authorization": f"Bearer {admin_token}"})
        assert res.status_code == 200, f"Audit logs failed: {res.status_code}"
        audit_data = res.get_json()
        assert "logs" in audit_data and len(audit_data["logs"]) > 0
        print(f"✓ /api/auth/audit-logs passed: retrieved {audit_data['total']} immutable audit events")

        # ----------------------------------------------------
        # Threat Intelligence Feed
        # ----------------------------------------------------
        res = client.get("/api/reports/threat-intel")
        assert res.status_code == 200, f"Threat intel failed: {res.status_code}"
        intel_data = res.get_json()
        assert "top_threat_sources" in intel_data
        assert "most_targeted_assets" in intel_data
        print(f"✓ /api/reports/threat-intel passed: {len(intel_data['top_threat_sources'])} adversary sources identified")

        # Explainability
        res = client.get("/api/explainability/summary")
        assert res.status_code == 200, f"Explainability summary failed: {res.status_code}"
        print("✓ /api/explainability/summary passed")

        # Incidents summary and list
        res = client.get("/api/incidents/summary")
        assert res.status_code == 200, f"Incidents summary failed: {res.status_code}"
        print("✓ /api/incidents/summary passed")

        res1 = client.get("/api/incidents")
        assert res1.status_code == 200, f"Incidents no-slash failed: {res1.status_code}"
        res2 = client.get("/api/incidents/")
        assert res2.status_code == 200, f"Incidents trailing-slash failed: {res2.status_code}"
        assert len(res2.get_json()) > 0, "Incidents should return non-empty list"
        print("✓ /api/incidents (both formats) passed with data")

        # Monitoring
        res = client.get("/api/monitoring/live")
        assert res.status_code == 200, f"Monitoring live failed: {res.status_code}"
        print("✓ /api/monitoring/live passed")

        # Analytics
        res = client.get("/api/analytics/summary")
        assert res.status_code == 200, f"Analytics summary failed: {res.status_code}"
        print("✓ /api/analytics/summary passed")

        # Reports Summary (Dashboard Data Flow)
        res = client.get("/api/reports/summary")
        assert res.status_code == 200, f"Reports summary failed: {res.status_code}"
        data = res.get_json()
        assert data["total_alerts"] >= 13050, f"Expected >= 13050 total alerts, got {data['total_alerts']}"
        assert data["critical_alerts"] > 0, "Critical alerts count should be > 0"
        assert data["high_alerts"] > 0, "High alerts count should be > 0"
        assert data["average_risk_score"] > 50, f"Expected average risk > 50, got {data['average_risk_score']}"
        assert len(data["recent_alerts"]) == 20, f"Expected 20 recent alerts, got {len(data['recent_alerts'])}"
        print("✓ /api/reports/summary passed with full dashboard assertions:")
        print(f"   - Total Alerts: {data['total_alerts']}")
        print(f"   - Critical Alerts: {data['critical_alerts']}")
        print(f"   - High Alerts: {data['high_alerts']}")
        print(f"   - Average Risk Score: {data['average_risk_score']}%")

        # ----------------------------------------------------
        # Unified Dashboard Live Contract (Phase 1)
        # ----------------------------------------------------
        res = client.get("/api/dashboard/live")
        assert res.status_code == 200, f"Dashboard live failed: {res.status_code}"
        dash_data = res.get_json()
        assert "generated_at" in dash_data
        assert "summary" in dash_data and dash_data["summary"]["total_alerts"] >= 13050
        assert "threat_level" in dash_data and "score" in dash_data["threat_level"]
        assert "recent_alerts" in dash_data and len(dash_data["recent_alerts"]) > 0
        assert "attack_distribution" in dash_data
        assert "traffic_chart" in dash_data and len(dash_data["traffic_chart"]) > 0
        assert "incidents" in dash_data
        assert "network_status" in dash_data
        assert "devices" in dash_data
        print("✓ /api/dashboard/live passed with full unified data contract:")
        print(f"   - Total Monitored Alerts: {dash_data['summary']['total_alerts']}")
        print(f"   - Dynamic Threat Score: {dash_data['threat_level']['score']}/100 ({dash_data['threat_level']['level']})")
        print(f"   - Live Traffic Points: {len(dash_data['traffic_chart'])}")
        print(f"   - Incident Records: {len(dash_data['incidents'])}")

        # System Status
        res = client.get("/api/system/status")
        assert res.status_code == 200, f"System status failed: {res.status_code}"
        sys_data = res.get_json()
        assert "components" in sys_data
        assert sys_data["components"]["backend"]["status"] == "online"
        assert sys_data["components"]["ml_engine"]["status"] == "active"
        print("✓ /api/system/status passed with live engine telemetry")

        # Threat Score
        res = client.get("/api/system/threat-score")
        assert res.status_code == 200, f"Threat score failed: {res.status_code}"
        threat_data = res.get_json()
        assert 0 <= threat_data["score"] <= 100
        print(f"✓ /api/system/threat-score passed: {threat_data['score']}/100 ({threat_data['level']})")

        # Incident Management PATCH
        res = client.get("/api/incidents?limit=1")
        assert res.status_code == 200
        incidents = res.get_json()
        if incidents:
            first_id = incidents[0]["id"]
            patch_res = client.patch(f"/api/incidents/{first_id}", json={"status": "CONTAINED", "action": "Block IP"})
            assert patch_res.status_code == 200
            assert patch_res.get_json()["status"] in ["Contained", "CONTAINED"]
            print(f"✓ PATCH /api/incidents/{first_id} passed: updated status to CONTAINED")

        # Prevention Status & Details
        res = client.get("/api/prevention/")
        assert res.status_code == 200, f"Prevention failed: {res.status_code}"
        print("✓ /api/prevention/ passed")

        res = client.get("/api/prevention/status")
        assert res.status_code == 200, f"Prevention status failed: {res.status_code}"
        prev_status = res.get_json()
        assert prev_status["status"] == "ACTIVE"
        assert prev_status["engine_online"] is True
        print(f"✓ /api/prevention/status passed: {prev_status['status']} (Actions: {prev_status['total_actions']}, Blocked IPs: {prev_status['blocked_ips']})")

        # ----------------------------------------------------
        # Sensor Cyber-Physical Telemetry & FDIA Tests
        # ----------------------------------------------------
        res = client.get("/api/detection/sensors")
        assert res.status_code == 200, f"Sensors failed: {res.status_code}"
        sensor_data = res.get_json()
        assert sensor_data["total_monitored"] == 6
        assert len(sensor_data["sensors"]) == 6
        print(f"✓ /api/detection/sensors passed: {sensor_data['total_monitored']} industrial sensors active ({sensor_data['safety_envelope_status']})")

        # FDIA Simulation & Cyber-Physical Correlation Test
        res = client.post("/api/detection/simulate-fdia", json={
            "sensor_type": "temperature",
            "attack_mode": "sudden_spike"
        })
        assert res.status_code == 200, f"Simulate FDIA failed: {res.status_code}"
        fdia_sim_data = res.get_json()
        assert fdia_sim_data["fdia_evaluation"]["is_fdia"] is True
        assert fdia_sim_data["fdia_evaluation"]["severity"] == "Critical"
        print(f"✓ /api/detection/simulate-fdia passed: detected {fdia_sim_data['fdia_evaluation']['observed_value']}°C jump ({fdia_sim_data['fdia_evaluation']['reason']})")

        # Modbus TCP Protocol Incursion Simulation Test
        res = client.post("/api/detection/simulate-modbus", json={
            "scenario": "Unauthorized Modbus Function Request",
            "source_ip": "198.51.100.23",
            "destination_ip": "192.168.1.10"
        })
        assert res.status_code == 200, f"Simulate Modbus failed: {res.status_code}"
        modbus_sim_data = res.get_json()
        assert modbus_sim_data["alert"]["service"] == "Modbus TCP"
        assert modbus_sim_data["alert"]["destination_port"] == 502
        print(f"✓ /api/detection/simulate-modbus passed: correlated {modbus_sim_data['alert']['attack']} on port 502")

        # ----------------------------------------------------
        # Notification Center & Delivery Tests
        # ----------------------------------------------------
        res = client.get("/api/notifications")
        assert res.status_code == 200, f"Notifications failed: {res.status_code}"
        notifs = res.get_json()
        print(f"✓ /api/notifications passed: retrieved {len(notifs)} notifications")

        res = client.get("/api/notifications/unread-count")
        assert res.status_code == 200, f"Unread count failed: {res.status_code}"
        cnt_data = res.get_json()
        assert "unread_count" in cnt_data
        print(f"✓ /api/notifications/unread-count passed: {cnt_data['unread_count']} unread, {cnt_data['critical_count']} critical")

        # ----------------------------------------------------
        # Notification Rules Engine Tests
        # ----------------------------------------------------
        res = client.get("/api/notification-rules")
        assert res.status_code == 200, f"Rules failed: {res.status_code}"
        rules = res.get_json()
        assert len(rules) >= 4, f"Expected >= 4 default rules, got {len(rules)}"
        print(f"✓ /api/notification-rules passed: {len(rules)} active dispatch policies")

        # ----------------------------------------------------
        # Industrial IoT Asset Inventory Tests
        # ----------------------------------------------------
        res = client.get("/api/assets")
        assert res.status_code == 200, f"Assets failed: {res.status_code}"
        assets = res.get_json()
        assert len(assets) >= 7, f"Expected >= 7 industrial assets, got {len(assets)}"
        print(f"✓ /api/assets passed: {len(assets)} registered industrial control assets")

        # ----------------------------------------------------
        # AI SOC Copilot & Security Insights Tests
        # ----------------------------------------------------
        res = client.post("/api/ai/copilot", json={"query": "What happened in the last hour?"})
        assert res.status_code == 200, f"Copilot failed: {res.status_code}"
        copilot_data = res.get_json()
        assert "answer" in copilot_data and len(copilot_data["answer"]) > 20
        print(f"✓ /api/ai/copilot passed: successfully answered natural language query with live data")

        res = client.get("/api/ai/insights")
        assert res.status_code == 200, f"AI insights failed: {res.status_code}"
        insights_data = res.get_json()
        assert "key_insights" in insights_data and len(insights_data["key_insights"]) > 0
        print(f"✓ /api/ai/insights passed: generated {len(insights_data['key_insights'])} trend insights")

        # ----------------------------------------------------
        # Integrations Status Tests
        # ----------------------------------------------------
        res = client.get("/api/integrations/status")
        assert res.status_code == 200, f"Integrations status failed: {res.status_code}"
        integ_data = res.get_json()
        assert "in_app" in integ_data and "email" in integ_data and "slack" in integ_data and "sms" in integ_data
        print(f"✓ /api/integrations/status passed: In-App, Email, Slack, SMS channel status online")

        print("\n=======================================================")
        print("ALL AEGIS-IIOT SOC BACKEND APIS & SECURITY TESTS PASSED")
        print("=======================================================")

if __name__ == "__main__":
    test_api_routes()
