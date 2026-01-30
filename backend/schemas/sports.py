from pydantic import BaseModel


class Turf(BaseModel):
    id: int
    name: str
    location: str
    price_per_hour: float
    is_available: bool


class Sport(BaseModel):
    id: int
    name: str
    icon: str
    available_turfs_count: int


class SportListResponse(BaseModel):
    sports: list[Sport]


class TurfListResponse(BaseModel):
    sport: str
    turfs: list[Turf]