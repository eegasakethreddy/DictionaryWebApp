from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import httpx
import os

app = FastAPI(title='Dictionary Web App')

# CORS - include local dev and likely prod domain (add your Render URL if known)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://dictionarywebapp.onrender.com"  # replace with your real domain if different
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/api/lookup/{word}')
async def lookup_word(word: str):
    url = f'https://api.dictionaryapi.dev/api/v2/entries/en/{word}'
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, timeout=10)
    if resp.status_code == 200:
        return JSONResponse(content=resp.json())
    elif resp.status_code == 404:
        raise HTTPException(status_code=404, detail='Word not found')
    else:
        raise HTTPException(status_code=resp.status_code, detail='Upstream API error')

# --- serve static frontend ---
# Try repo_root/frontend/dist first (when Render or CI builds frontend)
# Fallback to backend/frontend_dist if it exists (legacy)
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
frontend_dist_candidate = os.path.join(repo_root, 'frontend', 'dist')
legacy_backend_dist = os.path.join(os.path.dirname(__file__), '..', 'frontend_dist')

if os.path.isdir(frontend_dist_candidate):
    app.mount('/', StaticFiles(directory=frontend_dist_candidate, html=True), name='frontend')
elif os.path.isdir(legacy_backend_dist):
    app.mount('/', StaticFiles(directory=legacy_backend_dist, html=True), name='frontend')

@app.get('/health')
def health():
    return {'status': 'ok'}
