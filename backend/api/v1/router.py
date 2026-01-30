from fastapi import APIRouter

from backend.api.v1.endpoints import health, sports

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(sports.router, prefix="/sports", tags=["sports"])
