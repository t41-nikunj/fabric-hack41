from backend.schemas.sports import Sport, Turf

# --- Mock Data ---

_SPORTS_DATA = [
    {"id": 1, "name": "Football", "icon": "⚽"},
    {"id": 2, "name": "Badminton", "icon": "🏸"},
    {"id": 3, "name": "Cricket", "icon": "🏏"},
    {"id": 4, "name": "Basketball", "icon": "🏀"},
    {"id": 5, "name": "Tennis", "icon": "🎾"},
]

_TURFS_BY_SPORT: dict[int, list[Turf]] = {
    1: [
        Turf(id=1, name="Green Field Arena", location="Koramangala, Bangalore", price_per_hour=1500, is_available=True),
        Turf(id=2, name="Kickoff Stadium", location="HSR Layout, Bangalore", price_per_hour=1800, is_available=True),
        Turf(id=3, name="Goal Zone", location="Indiranagar, Bangalore", price_per_hour=2000, is_available=False),
    ],
    2: [
        Turf(id=4, name="Smash Court", location="Whitefield, Bangalore", price_per_hour=800, is_available=True),
        Turf(id=5, name="Net Pro Arena", location="JP Nagar, Bangalore", price_per_hour=1000, is_available=True),
    ],
    3: [
        Turf(id=6, name="Willow Ground", location="MG Road, Bangalore", price_per_hour=2500, is_available=True),
        Turf(id=7, name="Boundary Line Turf", location="Electronic City, Bangalore", price_per_hour=2200, is_available=True),
        Turf(id=8, name="Six Arena", location="Marathahalli, Bangalore", price_per_hour=2000, is_available=False),
    ],
    4: [
        Turf(id=9, name="Dunk City", location="Koramangala, Bangalore", price_per_hour=1200, is_available=True),
    ],
    5: [
        Turf(id=10, name="Spin & Slice", location="Indiranagar, Bangalore", price_per_hour=900, is_available=True),
        Turf(id=11, name="Ace Court", location="HSR Layout, Bangalore", price_per_hour=1100, is_available=False),
    ],
}

# --- Service Functions ---


def get_all_sports() -> list[Sport]:
    return [
        Sport(
            id=s["id"],
            name=s["name"],
            icon=s["icon"],
            available_turfs_count=sum(1 for t in _TURFS_BY_SPORT.get(s["id"], []) if t.is_available),
        )
        for s in _SPORTS_DATA
    ]


def get_turfs_for_sport(sport_id: int) -> tuple[str, list[Turf]] | None:
    sport = next((s for s in _SPORTS_DATA if s["id"] == sport_id), None)
    if sport is None:
        return None
    turfs = _TURFS_BY_SPORT.get(sport_id, [])
    return sport["name"], turfs

def get_message_info(message: str):
    """It will return string either yes/no"""

    if message == "CONFIRM" or message == "confirm":
        return "Yes"
        
    else:
        return "No"
