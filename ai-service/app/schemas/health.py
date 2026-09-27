from typing import List, Optional
from pydantic import BaseModel

class HealthData(BaseModel):
    service: str
    status: str
    environment: str
    aiMode: str

class HealthResponse(BaseModel):
    success: bool
    data: HealthData

class ReadyData(BaseModel):
    service: str
    status: str
    environment: str
    aiMode: str
    loadedComponents: List[str]
    ready: bool

class ReadyResponse(BaseModel):
    success: bool
    data: ReadyData
