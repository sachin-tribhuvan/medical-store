# MedVault architecture notes

- **Monolithic 3-tier**: React (Nginx) -> Express API -> MongoDB. Backend is layered (routes -> controllers -> services -> models) so it can later be split by domain.
- **Status is computed** in `backend/src/services/status.js` (never stored).
- **Browser networking**: the browser only talks to the frontend origin. Nginx proxies `/api/` to the backend Service, so no internal address ever reaches the browser.
- **Config**: backend via env (`PORT`, `MONGO_URI`, `CORS_ORIGIN`, `NODE_ENV`, `AUTO_SEED`); frontend via runtime `config.js` generated at container start from `API_URL`.
