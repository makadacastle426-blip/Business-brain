# Business Brain OpenRouter API

Requires Node.js 20.19 or newer. No npm dependencies are needed.

1. Copy backend/.env.example to backend/.env.
2. Set OPENROUTER_API_KEY in backend/.env. Never use a VITE_ variable for this key.
3. Optionally set OPENROUTER_MODEL to an exact model ID from your OpenRouter dashboard. If empty, OpenRouter uses your account default model.
4. In one terminal: cd backend, then npm start.
5. In another terminal: cd frontend, then npm run dev.
6. Sign in and send a question in Business Chat, such as: What should I prioritize today?

The key stays in the API process. Vite proxies /api/chat to port 3001. Messages and the sample task snapshot are sent to OpenRouter. Replies are advisory; no platform actions are executed. Completed-task state is not yet included in the snapshot.

The API binds only to 127.0.0.1 for local development. Before public deployment, add verified Firebase authentication, per-user quotas, and a same-origin HTTPS reverse proxy. Never expose this local unauthenticated service as a public paid proxy.

Run npm test in backend for request-validation and provider-response tests. A real model request still requires a valid key, credits, and model access.
