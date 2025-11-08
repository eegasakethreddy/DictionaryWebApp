from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import httpx
import os

app = FastAPI(title="Dictionary Web App")

# --- CORS Middleware ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://dictionarywebapp.onrender.com"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API ROUTE ---
@app.get("/api/lookup/{word}")
async def lookup_word(word: str):
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    if resp.status_code == 200:
        return JSONResponse(content=resp.json())
    elif resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Word not found")
    else:
        raise HTTPException(status_code=resp.status_code, detail="Upstream API error")

# --- STATIC FRONTEND ---
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend_dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

@app.get("/health")
def health():
    return {"status": "ok"}
