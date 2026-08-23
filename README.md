# reset — Restablecer contraseña (profesionales)

Frontend standalone para el flujo de reset de **usuarios profesionales** (`POST /forgot-password` → email con link).

## Marca

- UI **Kinecat** (BrandLogo, theme oscuro)
- Soporte: `kinecatkinesiologia@gmail.com`

## Desarrollo local

```bash
npm install
npm start
```

Abrí `http://localhost:3000/reset-password?token=...&id=...` (token válido del email).

## Variables (.env)

Ver `.env.example`:

- `REACT_APP_API_URL` — backend (`https://kinapp-api.vercel.app/`)
- `REACT_APP_WEB_APP_URL` — login post-reset (`https://gestion-baskin.vercel.app/login`)
- `REACT_APP_WEB_APP_FORGOT_URL` — volver a solicitar reset
- `REACT_APP_SUPPORT_EMAIL`

## Deploy

Producción: `https://reset-mu.vercel.app/`

Repo: `https://github.com/ferbassino/reset.git`

Documentación del ecosistema: [`docs/RESET_PASSWORD.md`](../docs/RESET_PASSWORD.md) en el workspace.
