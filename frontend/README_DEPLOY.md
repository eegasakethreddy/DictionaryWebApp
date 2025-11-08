# Deploy notes (local -> production)

## Frontend (Vite)
- Set env var `VITE_API_BASE` to your backend URL (example: https://your-api.example.com)
- Build:
  npm run build
- Deploy the `dist/` folder to Netlify, Vercel, or any static host.
- When deploying to Vercel / Netlify, set the environment variable `VITE_API_BASE` via their dashboard.

## Backend (FastAPI)
- Ensure `requirements.txt` contains: fastapi, uvicorn[standard], httpx, python-dotenv
- Use a service like Railway, Render, or Fly:
  - Create a project, set Python 3.11+, and set startup command:
    uvicorn app.main:app --host 0.0.0.0 --port $PORT
  - Set any environment variables (if you add keys).
- If using a custom domain, update the frontend `VITE_API_BASE` to point to the backend URL and redeploy.

## CORS
- In development, `main.py` already whitelists localhost:5173.
- In production, update CORS origins in FastAPI to include your deployed frontend domain.

