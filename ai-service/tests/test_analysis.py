from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_explicit_link():
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
                "status": "delayed",
                "zoneId": "ZONE-03",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-03-31T00:00:00.000Z",
                "microActivities": [
                    {
                        "microActivityId": "MA-03-02-001-01",
                        "activityId": "ACT-03-02-001",
                        "name": "Rebar Cage Assembly & Placement",
                        "discipline": "Structural Concrete",
                    }
                ],
            }
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["evidenceId"] == "EV-000121"
    assert data["status"] == "explicit"
    assert data["requiresHumanVerification"] is True

    schedule_link = data["scheduleLink"]
    assert schedule_link["status"] == "explicit"
    assert schedule_link["linkType"] == "explicit"
    assert schedule_link["activityId"] == "ACT-03-02-001"
    assert schedule_link["microActivityId"] == "MA-03-02-001-01"
    assert schedule_link["confidence"] == 1.0
    assert schedule_link["confidenceBand"] == "high"
    assert any("explicit system link" in r.lower() for r in schedule_link["reasons"])

    # Progress assessment is explicitly not assessed
    assert data["progressAssessment"]["status"] == "not_assessed"
    assert data["progressAssessment"]["confidence"] is None
    assert data["progressAssessment"]["basis"] == "schedule_linking_only"


def test_analyze_inferred_candidate():
    # Evidence without explicit link, but with WBS, discipline keywords, and zone match
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
                "zoneId": "ZONE-03",
                "plannedStart": "2026-03-01T00:00:00.000Z",
                "plannedFinish": "2026-04-15T00:00:00.000Z",
                "microActivities": [
                    {
                        "microActivityId": "MA-03-01-002-01",
                        "activityId": "ACT-03-01-002",
                        "name": "Bored Piling Rig Drilling - Pier P25 to P36",
                    }
                ],
            },
            {
                "activityId": "ACT-01-01-001",
                "activityName": "Gas Line Realignment Sector 14",
                "wbsId": "WBS-01-01",
                "discipline": "Civil Utilities",
                "status": "completed",
                "zoneId": "ZONE-01",
                "plannedStart": "2024-10-01T00:00:00.000Z",
                "plannedFinish": "2024-11-15T00:00:00.000Z",
            },
        ],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert data["status"] == "candidate"
    assert data["requiresHumanVerification"] is True

    schedule_link = data["scheduleLink"]
    assert schedule_link["status"] == "candidate"
    assert schedule_link["linkType"] == "inferred"
    assert schedule_link["activityId"] == "ACT-03-01-002"
    assert schedule_link["confidence"] >= 0.70
    assert len(schedule_link["reasons"]) > 0
    assert any("WBS match" in r for r in schedule_link["reasons"])


def test_analyze_ambiguous_candidates():
    # Two activities with identical scores and no distinctive discriminator
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

    # When candidates have close confidence, status must be "needs_review"
    assert data["status"] == "needs_review"
    assert data["scheduleLink"]["status"] == "needs_review"
    assert any(sig["code"] == "AMBIGUOUS_CANDIDATES" for sig in data["riskSignals"])
    assert data["requiresHumanVerification"] is True


def test_analyze_missing_location_risk_signal():
    payload = {
        "evidenceId": "EV-NOLOC",
        "projectId": "proj-1",
        "evidenceContext": {
            "evidenceId": "EV-NOLOC",
            "projectId": "proj-1",
            "title": "Unanchored photo",
        },
        "scheduleContext": [],
    }

    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()["data"]

    assert any(sig["code"] == "MISSING_LOCATION" for sig in data["riskSignals"])


def test_analyze_invalid_request_validation():
    # Missing evidenceId
    response = client.post("/analyze", json={"projectId": "proj-1"})
    assert response.status_code == 422

    # Missing projectId
    response = client.post("/analyze", json={"evidenceId": "EV-000121"})
    assert response.status_code == 422
