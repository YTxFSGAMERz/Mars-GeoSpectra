# Environment Configuration & Security Policy

**MARS-GEOSPECTRA — Environment Variables and Secrets Handling**

---

## Security Policy: Zero Secret Leaks

1. **No Client Secrets**: Private API keys must NEVER be prefixed with `VITE_` or embedded into client-side bundles.
2. **Server-Side AI Abstraction**: External LLM keys (such as `GEMINI_API_KEY`) remain strictly on server-side proxies or backend APIs.
3. **Deterministic Fallback**: The client-side AI Mission Scientist contains an integrated grounded heuristic reasoning engine, guaranteeing complete functionality without requiring an active external API key.

---

## Environment Variables Specification

| Variable | Environment | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Frontend | `http://localhost:8000` | Optional backend API base URL for external data sync. |
| `VITE_NASA_API_KEY` | Frontend | `DEMO_KEY` | Optional NASA Open API key for increased rate limits on public endpoints. |
| `VITE_MISSION_MODE` | Frontend | `demo` | `"demo"` (100% offline-safe deterministic fixtures) or `"live"` (remote WMTS). |
| `GEMINI_API_KEY` | Backend Only | `unset` | Google Gemini API key for server-side generative analysis. |
