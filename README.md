# Ecommerce Admin React App

Admin pages require a server-verified administrator login. The access token stays
in memory only, is checked by the API on every request, and the admin role is
re-validated when navigating between protected pages. A full page reload
requires signing in again.

Set `VITE_API_ORIGIN` in a local `.env` file to point at the API origin when
developing against a different backend. The default is `https://api.niorra.eu`.

The cloud backend must be configured with `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
and a randomly generated `JWT_SECRET` of at least 32 bytes. Admin API routes
reject requests without a valid admin token. Tokens expire after 15 minutes by
default; `JWT_EXPIRATION_MS` can override that value.