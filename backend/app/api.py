from fastapi import APIRouter, HTTPException
import httpx
from starlette.responses import JSONResponse

router = APIRouter()

BASE = "https://api.dictionaryapi.dev/api/v2/entries/en"

@router.get("/lookup/{word}")
async def lookup_word(word: str):
    url = f"{BASE}/{word}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=10)
    if resp.status_code == 200:
        return JSONResponse(content=resp.json())
    elif resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Word not found")
    else:
        raise HTTPException(status_code=resp.status_code, detail="Upstream API error")
