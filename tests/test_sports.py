import pytest


@pytest.mark.asyncio
async def test_list_sports(client):
    res = await client.get("/api/v1/sports")
    assert res.status_code == 200
    data = res.json()
    assert "sports" in data
    assert len(data["sports"]) == 5
    sport = data["sports"][0]
    assert "id" in sport
    assert "name" in sport
    assert "icon" in sport
    assert "available_turfs_count" in sport


@pytest.mark.asyncio
async def test_list_sports_has_correct_names(client):
    res = await client.get("/api/v1/sports")
    names = {s["name"] for s in res.json()["sports"]}
    assert names == {"Football", "Badminton", "Cricket", "Basketball", "Tennis"}


@pytest.mark.asyncio
async def test_list_turfs_for_football(client):
    res = await client.get("/api/v1/sports/1/turfs")
    assert res.status_code == 200
    data = res.json()
    assert data["sport"] == "Football"
    assert len(data["turfs"]) == 3
    turf = data["turfs"][0]
    assert "id" in turf
    assert "name" in turf
    assert "location" in turf
    assert "price_per_hour" in turf
    assert "is_available" in turf


@pytest.mark.asyncio
async def test_list_turfs_not_found(client):
    res = await client.get("/api/v1/sports/999/turfs")
    assert res.status_code == 404
    assert res.json()["detail"] == "Sport not found"


@pytest.mark.asyncio
async def test_available_turfs_count(client):
    res = await client.get("/api/v1/sports")
    sports = {s["name"]: s["available_turfs_count"] for s in res.json()["sports"]}
    # Football has 2 available out of 3
    assert sports["Football"] == 2
    # Badminton has 2 available out of 2
    assert sports["Badminton"] == 2
    # Basketball has 1 available out of 1
    assert sports["Basketball"] == 1