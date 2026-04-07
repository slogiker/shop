#!/bin/bash

# Usage:
#   ./start.sh           — start backend + Angular dev server (browser)
#   ./start.sh electron  — start backend + Angular dev server + Electron window

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-web}"

cleanup() {
    echo ""
    echo "[stop] Stopping processes..."
    kill $BACKEND_PID $FRONTEND_PID $ELECTRON_PID 2>/dev/null
    wait $BACKEND_PID $FRONTEND_PID $ELECTRON_PID 2>/dev/null
    echo "[stop] Done."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo "[start] Starting backend..."
cd "$ROOT_DIR/backend"
node src/server.js &
BACKEND_PID=$!

echo "[start] Starting Angular dev server..."
cd "$ROOT_DIR/frontend"
npm start &
FRONTEND_PID=$!

if [ "$MODE" = "electron" ]; then
    echo "[start] Waiting for Angular dev server to be ready..."
    until curl -s http://localhost:4200 > /dev/null 2>&1; do
        sleep 1
    done
    echo "[start] Launching Electron..."
    cd "$ROOT_DIR/electron"
    NODE_ENV=development npx electron . &
    ELECTRON_PID=$!
fi

echo "[start] Running. Press Ctrl+C to stop."
wait
