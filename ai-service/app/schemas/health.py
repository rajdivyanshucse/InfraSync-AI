from pydantic import BaseModel

class HealthData(BaseModel):
    service: str
    status: str
    environment: str
    aiMode: str

class HealthResponse(BaseModel):
    success: bool
    data: HealthData
