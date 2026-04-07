# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack e-commerce + forum app with an Angular 19 frontend and Express.js backend, using MongoDB Atlas and Socket.IO for real-time chat.

## Commands

### Backend (port 3000)
```bash
cd backend
npm install
node src/server.js      # start server
```

### Frontend (port 4200)
```bash
cd frontend
npm install
npm start               # ng serve with proxy to localhost:3000
npm run build           # production build → dist/frontend/
ng test                 # Karma/Jasmine unit tests
ng test --include='**/foo.component.spec.ts'  # single test file
```

Both must run simultaneously for the app to work — the Angular dev server proxies `/auth`, `/shop`, `/forum`, `/check-auth`, and `/socket.io` to `localhost:3000`.

## Architecture

### Backend (`backend/src/`)
- **`server.js`** — Express + HTTP + Socket.IO setup, MongoDB connection via Mongoose, CORS configured for `localhost:4200`
- **`routes/`** — `auth.js` (register/login/logout), `shop.js` (basket/order), `forum.js` (message list/delete)
- **`middleware/`** — `auth.js` (session guard), `session.js` (express-session config)
- **`models/`** — Mongoose schemas: `User`, `Order`, `Message`

Sessions are cookie-based (express-session). The `/check-auth` endpoint is the canonical way to verify session status from the frontend.

### Frontend (`frontend/src/app/`)
- Angular 19 standalone components (no NgModules)
- **`services/`** — API calls (HttpClient) and Socket.IO integration; services are the single source of truth for backend communication
- **`components/features/`** — `auth/` (login, register), `shop/`, `basket/`, `forum/`, `home/`
- **`components/layout/`** — navbar, footer (shared across pages)
- **`guards/`** — `AuthGuard` protecting `/shop` and `/basket` routes
- **`app.routes.ts`** — route definitions
- **`app.config.ts`** — providers: `provideHttpClient()`, `provideRouter()`, Socket.IO config pointing to `localhost:3000` with credentials

Socket.IO is configured with `withCredentials: true` so the session cookie is sent on socket connections.

### Data Flow
- Auth: session cookie set on login → `AuthGuard` calls `/check-auth` → guards protected routes
- Shop: products are hardcoded in the frontend; basket state lives in pending `Order` documents in MongoDB tied to the username
- Forum: messages sent via Socket.IO → Huffman-encoded before MongoDB storage; decoded on retrieval with manual fallback

## Environment

Backend requires a `.env` file in `backend/`:
```
MONGODB_URI=<MongoDB Atlas connection string>
SESSION_SECRET=<optional, defaults to 'ganja'>
NODE_ENV=<optional, 'production' enables secure cookies>
```

## Key Implementation Details

- **Products** are hardcoded in the frontend shop component — no product collection in MongoDB
- **Message encoding**: forum messages are Huffman-compressed (using `huffman-javascript`) before storage; the `Message` model stores both `encodedMessage` and `codes` (the Huffman tree map)
- **Password hashing**: bcryptjs with salt rounds = 10
- **Basket**: implemented as an `Order` document with `status: 'pending'`; confirming an order updates status to `'confirmed'` and adds shipping/billing info
