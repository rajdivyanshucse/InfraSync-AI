from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.health import router as health_router
from .routes.analysis import router as analysis_router
from .config import settings

app = FastAPI(
    title="InfraSync AI Analysis Service",
    description="Lightweight microservice foundation for InfraSync AI analysis operations",
    version="1.0.0",
)

# Enable CORS for local cross-service or browser interactions
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(health_router)
app.include_router(analysis_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
