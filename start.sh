#!/bin/bash

# Usage:
#   ./start.sh web  — start backend + Angular dev server (browser at localhost:4200)
#   ./start.sh app  — build Angular + package as Linux AppImage (output: ~/Downloads/)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODE="${1:-}"

die() { echo "[error] $*" >&2; exit 1; }

ensure_deps() {
    local dir="$1"
    if [ ! -d "$dir/node_modules" ]; then
        echo "[setup] Installing dependencies in $dir..."
        (cd "$dir" && npm install) || die "npm install failed in $dir"
    fi
}

cleanup() {
    echo ""
    echo "[stop] Stopping processes..."
    kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
    wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null
    echo "[stop] Done."
    exit 0
}

if [ "$MODE" = "web" ]; then
    ensure_deps "$ROOT_DIR/backend"
    ensure_deps "$ROOT_DIR/frontend"

    trap cleanup SIGINT SIGTERM

    echo "[web] Starting backend..."
    cd "$ROOT_DIR/backend"
    node src/server.js &
    BACKEND_PID=$!

    echo "[web] Starting Angular dev server..."
    cd "$ROOT_DIR/frontend"
    npm start &
    FRONTEND_PID=$!

    echo "[web] Running at http://localhost:4200 — Press Ctrl+C to stop."
    wait

elif [ "$MODE" = "app" ]; then
    ensure_deps "$ROOT_DIR/backend"
    ensure_deps "$ROOT_DIR/frontend"
    ensure_deps "$ROOT_DIR/electron"

    echo "[app] Building Angular..."
    cd "$ROOT_DIR/frontend"
    npm run build -- --configuration electron || die "Angular build failed"

    echo "[app] Packaging AppImage..."
    cd "$ROOT_DIR/electron"
    node_modules/.bin/electron-builder --linux AppImage || die "electron-builder failed"

    echo "[app] Moving AppImage to ~/Downloads..."
    mv "$ROOT_DIR/electron/dist/"*.AppImage "$HOME/Downloads/" || die "Failed to move AppImage"

    echo "[app] Done. Launch from: ~/Downloads/Shop-1.0.0.AppImage"

else
    echo "Usage: $0 web|app"
    exit 1
fi
