#!/bin/bash
set -e

echo ""
echo " =========================================="
echo "  SlokaNE Website - Setup and Start"
echo " =========================================="
echo ""

echo "[1/3] Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "[2/3] Installing backend dependencies..."
cd backend && npm install && cd ..

echo ""
echo "[3/3] Starting servers..."
echo ""
echo "  Backend  -> http://localhost:3001"
echo "  Frontend -> http://localhost:5173"
echo ""
echo "  Open http://localhost:5173 in your browser"
echo ""

# Start backend in background
cd backend && npm run dev &
BACKEND_PID=$!
cd ..

sleep 1

# Start frontend
cd frontend && npm run dev

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
