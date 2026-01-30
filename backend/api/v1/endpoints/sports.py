from fastapi import APIRouter, HTTPException

from backend.core.logging import get_logger
from backend.schemas.sports import SportListResponse, TurfListResponse
from backend.services.sports import get_all_sports, get_turfs_for_sport, get_message_info

router = APIRouter()
log = get_logger(__name__)

@router.get("/confirm")
async def confirm(
    message: str
):
    return get_message_info(message=message)

@router.get("", response_model=SportListResponse)
async def list_sports():
    """List all bookable sports with available turf counts."""
    log.info("Listing all sports.")
    sports = get_all_sports()
    log.info(f"Found {len(sports)} sports.")
    return SportListResponse(sports=sports)


@router.get("/{sport_id}/turfs", response_model=TurfListResponse)
async def list_turfs(sport_id: int):
    """List turfs/grounds for a specific sport."""
    log.info(f"Listing turfs for sport_id: {sport_id}.")
    result = get_turfs_for_sport(sport_id)
    if result is None:
        log.warning(f"Sport with id {sport_id} not found.")
        raise HTTPException(status_code=404, detail="Sport not found")
    sport_name, turfs = result
    log.info(f"Found {len(turfs)} turfs for sport '{sport_name}'.")
    return TurfListResponse(sport=sport_name, turfs=turfs)