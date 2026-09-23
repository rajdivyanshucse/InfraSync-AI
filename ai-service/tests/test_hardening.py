from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_confidence_boundary_high():
    """
    Test confidence calculation: Spatial match + Schedule Window match + Keyword match + WBS match -> High (>= 0.80)
    """
    payload = {
        "evidenceId": "EV-TEST-HIGH",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-TEST-HIGH",
            "projectId": "proj-1",
            "title": "Civil Pier Cap Concrete Pour",
            "description": "Concrete pouring inspection at Pier Cap P25. WBS-03-02",
            "explicitWbsId": "WBS-03-02",
            "zoneId": "ZONE-03",
            "stationing": "CH 5+340",
            "capturedAt": "2026-03-10T10:00:00.000Z",
            "capturedBy": "Alpha Infrastructure Ltd",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-03-02-001",
                "activityName": "Pier Cap Construction P25-P48",
                "wbsId": "WBS-03-02",
                "discipline": "Civil",
                "contractor": "Alpha Infrastructure Ltd",
                "zoneId": "ZONE-03",
                "stationingRange": "CH 5+000 to CH 6+000",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-03-31T00:00:00.000Z",
                "status": "inProgress",
                "microActivities": [
                    {
                        "microActivityId": "MA-01",
                        "name": "Pier Cap Concreting",
                        "status": "inProgress",
                    }
                ]
            }
        ]
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    schedule_link = data["scheduleLink"]
    assert schedule_link["status"] == "candidate"
    assert schedule_link["confidence"] >= 0.80
    assert schedule_link["confidenceBand"] == "high"
    assert schedule_link["activityId"] == "ACT-03-02-001"

def test_confidence_boundary_low_ambiguous():
    """
    Test confidence calculation: Partial or weak match -> Low (< 0.55) or needs_review
    """
    payload = {
        "evidenceId": "EV-TEST-LOW",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-TEST-LOW",
            "projectId": "proj-1",
            "title": "General site clearing",
            "description": "Earthmoving and debris clearing near access road.",
            "zoneId": "ZONE-UNKNOWN",
            "capturedAt": "2026-03-10T10:00:00.000Z",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-03-02-001",
                "activityName": "Superstructure Segment Erection",
                "zoneId": "ZONE-05",
                "plannedStart": "2026-07-01T00:00:00.000Z",
                "plannedFinish": "2026-09-30T00:00:00.000Z",
                "status": "notStarted",
                "microActivities": []
            }
        ]
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    schedule_link = data["scheduleLink"]
    assert schedule_link["status"] in ["not_found", "needs_review"]
    if schedule_link["confidence"] is not None:
        assert schedule_link["confidence"] < 0.55
        assert schedule_link["confidenceBand"] == "low"

def test_zero_schedule_activities_returns_not_found():
    """
    Test zero schedule context provided -> cleanly returns not_found without failure
    """
    payload = {
        "evidenceId": "EV-EMPTY-SCHED",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-EMPTY-SCHED",
            "projectId": "proj-1",
            "title": "Survey Check",
        },
        "scheduleContext": []
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["scheduleLink"]["status"] == "not_found"
    assert data["candidates"] == []
    assert data["requiresHumanVerification"] is True

def test_risk_analyzer_ahead_of_schedule_no_delay_signals():
    """
    Test activity ahead of schedule (positive variance) -> does not generate false delay alarm
    """
    payload = {
        "evidenceId": "EV-AHEAD",
        "projectId": "proj-1",
        "activityId": "ACT-AHEAD-01",
        "evidenceContext": {
            "evidenceId": "EV-AHEAD",
            "projectId": "proj-1",
            "title": "Rapid Deck Casting",
            "explicitActivityId": "ACT-AHEAD-01",
        },
        "scheduleContext": [
            {
                "activityId": "ACT-AHEAD-01",
                "activityName": "Viaduct Deck Slab Casting",
                "plannedProgress": 40.0,
                "actualProgress": 55.0,
                "variance": 15.0,
                "criticalPath": False,
                "status": "inProgress",
                "microActivities": [
                    {
                        "microActivityId": "MA-01",
                        "name": "Deck Slab Pouring",
                        "status": "inProgress",
                        "delayedUnits": 0,
                        "blockedUnits": 0,
                        "awaitingInspection": 0,
                    }
                ]
            }
        ]
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    sig_types = [s["signalType"] for s in data["riskSignals"]]
    assert "SIGNIFICANT_PROGRESS_VARIANCE" not in sig_types
    assert "EXECUTION_BLOCKAGE" not in sig_types
    assert "EXECUTION_DELAY" not in sig_types

def test_malformed_empty_evidence_id_rejected():
    """
    Test missing evidenceId -> FastAPI Pydantic returns HTTP 422
    """
    payload = {
        "projectId": "proj-1",
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 422
