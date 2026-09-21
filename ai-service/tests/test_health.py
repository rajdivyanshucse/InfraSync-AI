from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_health():
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["service"] == "infrasync-ai-service"
    assert json_data["data"]["status"] == "ok"
    assert json_data["data"]["environment"] == "development"
    assert json_data["data"]["aiMode"] == "demo"
