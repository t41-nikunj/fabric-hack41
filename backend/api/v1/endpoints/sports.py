from fastapi import APIRouter, HTTPException

from backend.schemas.sports import SportListResponse, TurfListResponse
from backend.services.sports import get_all_sports, get_turfs_for_sport

router = APIRouter()


@router.get("", response_model=SportListResponse)
async def list_sports():
    """List all bookable sports with available turf counts."""
    return SportListResponse(sports=get_all_sports())


@router.get("/{sport_id}/turfs", response_model=TurfListResponse)
async def list_turfs(sport_id: int):
    """List turfs/grounds for a specific sport."""
    result = get_turfs_for_sport(sport_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Sport not found")
    sport_name, turfs = result
    return TurfListResponse(sport=sport_name, turfs=turfs)