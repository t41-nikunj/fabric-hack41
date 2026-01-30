from fastapi import APIRouter

from backend.core.logging import get_logger

router = APIRouter()
log = get_logger(__name__)


@router.get("")
async def healthcheck():
    log.info("Health check endpoint was called.")
    return {"status": "ok"}
