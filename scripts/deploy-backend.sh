#!/bin/bash
set -e

echo "[INFO] Deploying backend..."

pm2 restart faasri-backend || pm2 start backend/dist/index.js --name faasri-backend
pm2 save

echo "[OK] Backend deployed."
