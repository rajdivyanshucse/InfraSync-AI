from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_explicit_link_and_risk_signals():
    # Activity ACT-03-02-001 has negative variance (-14 pp), critical path True, delayed execution
    payload = {
        "evidenceId": "EV-000121",
        "projectId": "proj-1",
        "activityId": "ACT-03-02-001",
        "microActivityId": "MA-03-02-001-01",
        "evidenceContext": {
            "evidenceId": "EV-000121",
            "projectId": "proj-1",
            "title": "Pier P3 Reinforcement Cage Inspection",
            "description": "High-resolution photographic capture of vertical rebar tying at Pier P3.",
            "explicitActivityId": "ACT-03-02-001",
            "explicitMicroActivityId": "MA-03-02-001-01",
            "zoneId": "ZONE-03",
            "stationing": "CH 5+340",
            "gpsCoords": "19.0834 N, 72.8845 E",
            "capturedAt": "2026-03-16T10:15:00.000Z",
            "capturedBy": "Ananya Sen (Resident Engineer)",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-03-02-001",
                "activityName": "Pile Cap Reinforcement & Shuttering",
                "wbsId": "WBS-03-02",
                "wbsName": "Pier Foundations P1-P12",
                "phaseId": "PH-03",
                "discipline": "Structural Concrete",
                "contractor": "Apex Foundation Engineering Ltd.",
                "status": "delayed",
                "plannedProgress": 56.0,
                "actualProgress": 42.0,
                "variance": -14.0,
                "criticalPath": True,
                "zoneId": "ZONE-03",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-03-31T00:00:00.000Z",
                "milestones": [
                    {
                        "id": "MS-04",
                        "name": "Box Girder Span 01-12 Launching",
                        "status": "delayed",
                        "targetDate": "2026-06-25",
                    }
                ],
                "microActivities": [
                    {
                        "microActivityId": "MA-03-02-001-01",
                        "activityId": "ACT-03-02-001",
                        "name": "Rebar Cage Assembly & Placement",
                        "discipline": "Structural Concrete",
                        "status": "delayed",
                        "delayedUnits": 28,
                        "blockedUnits": 12,
                        "awaitingInspection": 16,
                        "evidenceCount": 2,
                    }
                ],
            }
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["evidenceId"] == "EV-000121"
    assert data["mode"] == "delay_risk_analysis"
    assert data["status"] == "explicit"
    assert data["requiresHumanVerification"] is True

    # 1. Verify schedule link
    schedule_link = data["scheduleLink"]
    assert schedule_link["status"] == "explicit"
    assert schedule_link["linkType"] == "explicit"
    assert schedule_link["activityId"] == "ACT-03-02-001"
    assert schedule_link["confidence"] == 1.0

    # 2. Verify Risk Signals generated
    signals = data["riskSignals"]
    sig_types = [s["signalType"] for s in signals]

    assert "SIGNIFICANT_PROGRESS_VARIANCE" in sig_types
    assert "CRITICAL_PATH_EXPOSURE" in sig_types
    assert "EXECUTION_BLOCKAGE" in sig_types
    assert "EXECUTION_DELAY" in sig_types
    assert "INSPECTION_PENDING" in sig_types
    assert "MILESTONE_EXPOSURE" in sig_types

    # Verify severity and explainable structure
    var_sig = next(s for s in signals if s["signalType"] == "SIGNIFICANT_PROGRESS_VARIANCE")
    assert var_sig["severity"] == "critical" # on critical path + delayed/blocked
    assert "-14.0" in var_sig["explanation"]
    assert var_sig["requiresHumanReview"] is True

    cp_sig = next(s for s in signals if s["signalType"] == "CRITICAL_PATH_EXPOSURE")
    assert cp_sig["severity"] == "critical"
    assert "critical path" in cp_sig["explanation"].lower()


def test_analyze_no_risk_scenario():
    # Activity fully on-track, positive variance, not critical, no delayed units
    payload = {
        "evidenceId": "EV-ONTRACK",
        "projectId": "proj-1",
        "activityId": "ACT-01-01-001",
        "evidenceContext": {
            "evidenceId": "EV-ONTRACK",
            "projectId": "proj-1",
            "title": "Trench inspection",
            "capturedAt": "2026-03-18T10:00:00.000Z",
            "zoneId": "ZONE-01",
            "stationing": "CH 1+200",
            "gpsCoords": "19.0750 N, 72.8760 E",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-01-01-001",
                "activityName": "Gas Line Realignment Sector 14",
                "status": "completed",
                "plannedProgress": 100.0,
                "actualProgress": 100.0,
                "variance": 0.0,
                "criticalPath": False,
                "zoneId": "ZONE-01",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-03-31T00:00:00.000Z",
                "microActivities": [
                    {
                        "microActivityId": "MA-01-01-001-01",
                        "name": "Gas Trench Excavation",
                        "status": "completed",
                        "evidenceCount": 4,
                        "blockedUnits": 0,
                        "delayedUnits": 0,
                        "awaitingInspection": 0,
                    }
                ],
            }
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    # Filter out base linkage info signals
    delay_risks = [s for s in data["riskSignals"] if s["signalType"] in [
        "SIGNIFICANT_PROGRESS_VARIANCE", "CRITICAL_PATH_EXPOSURE", "EXECUTION_BLOCKAGE", "EXECUTION_DELAY"
    ]]
    assert len(delay_risks) == 0


def test_analyze_evidence_coverage_gap():
    # Active activity with 0 evidence records
    payload = {
        "evidenceId": "EV-NEW-CAPTURE",
        "projectId": "proj-1",
        "activityId": "ACT-GAP",
        "scheduleContext": [
            {
                "activityId": "ACT-GAP",
                "activityName": "Unmonitored Active Foundation",
                "status": "inProgress",
                "plannedProgress": 40.0,
                "actualProgress": 40.0,
                "variance": 0.0,
                "microActivities": [
                    {
                        "microActivityId": "MA-GAP-01",
                        "name": "Piling without photos",
                        "status": "inProgress",
                        "evidenceCount": 0,
                    }
                ],
            }
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    signals = response.json()["data"]["riskSignals"]

    assert any(s["signalType"] == "EVIDENCE_COVERAGE_GAP" for s in signals)
    gap_sig = next(s for s in signals if s["signalType"] == "EVIDENCE_COVERAGE_GAP")
    assert gap_sig["severity"] == "medium"


def test_analyze_inferred_candidate():
    payload = {
        "evidenceId": "EV-UNLINKED-01",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-UNLINKED-01",
            "projectId": "proj-1",
            "title": "Bored cast in-situ piling inspection at Pier P28",
            "description": "Drilling rig depth validation for rotary bored pile shaft.",
            "zoneId": "ZONE-03",
            "stationing": "CH 7+120",
            "explicitWbsId": "WBS-03-01",
            "capturedAt": "2026-03-10T09:00:00.000Z",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-03-01-002",
                "activityName": "Piling Pier P25 to P48",
                "wbsId": "WBS-03-01",
                "discipline": "Geotechnical & Piling",
                "status": "inProgress",
                "plannedProgress": 88.0,
                "actualProgress": 82.0,
                "variance": -6.0,
                "criticalPath": True,
                "zoneId": "ZONE-03",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-04-15T00:00:00.000Z",
                "microActivities": [
                    {
                        "microActivityId": "MA-03-01-002-01",
                        "activityId": "ACT-03-01-002",
                        "name": "Bored Piling Rig Drilling - Pier P25 to P36",
                        "evidenceCount": 4,
                    }
                ],
            },
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["status"] == "candidate"
    assert data["scheduleLink"]["activityId"] == "ACT-03-01-002"

    # Since variance is -6.0 on critical path, critical path exposure should be flagged
    signals = data["riskSignals"]
    assert any(s["signalType"] == "CRITICAL_PATH_EXPOSURE" for s in signals)


def test_analyze_ambiguous_candidates():
    payload = {
        "evidenceId": "EV-AMBIGUOUS",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-AMBIGUOUS",
            "projectId": "proj-1",
            "title": "General concrete pouring survey",
            "description": "Concrete pour inspection without specific zone or unit tags.",
            "capturedAt": "2026-03-10T10:00:00.000Z",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-A",
                "activityName": "Concrete Pouring Section A",
                "discipline": "Concrete",
                "status": "inProgress",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-03-31T00:00:00.000Z",
            },
            {
                "activityId": "ACT-B",
                "activityName": "Concrete Pouring Section B",
                "discipline": "Concrete",
                "status": "inProgress",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-03-31T00:00:00.000Z",
            },
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["status"] == "needs_review"
    assert data["scheduleLink"]["status"] == "needs_review"
    assert any(sig.get("code") == "AMBIGUOUS_CANDIDATES" or sig.get("signalType") == "AMBIGUOUS_CANDIDATES" for sig in data["riskSignals"])


def test_analyze_validation_missing_evidence_id():
    response = client.post("/analyze", json={"projectId": "proj-1"})
    assert response.status_code == 422


def test_analyze_validation_missing_project_id():
    response = client.post("/analyze", json={"evidenceId": "EV-100"})
    assert response.status_code == 422


def test_analyze_empty_schedule_context():
    payload = {
        "evidenceId": "EV-EMPTY-SCHED",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-EMPTY-SCHED",
            "projectId": "proj-1",
            "title": "General photo",
            "capturedAt": "2026-03-10T10:00:00.000Z",
        },
        "scheduleContext": [],
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["status"] in ["not_found", "needs_review"]
    assert data["requiresHumanVerification"] is True
