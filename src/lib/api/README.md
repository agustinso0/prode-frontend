# API

API transport boundary.

Features should not call `fetch` directly. Feature data access should delegate to this boundary when real API integration is implemented.

See `docs/frontend-api-env.md` for the API client contract, error model, query conventions, and testing strategy.
