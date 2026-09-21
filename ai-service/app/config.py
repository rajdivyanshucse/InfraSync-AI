import os

class Settings:
    SERVICE_NAME: str = "infrasync-ai-service"
    AI_MODE: str = os.getenv("AI_MODE", "demo").lower()
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
