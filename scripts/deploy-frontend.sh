#!/bin/bash
set -e

echo "[INFO] Deploying frontend..."

sudo mkdir -p /var/www/html/browser
sudo find /var/www/html/browser -mindepth 1 -delete
sudo cp -r /home/mraihanghani/faasri-career/frontend/dist/frontend/browser/* /var/www/html/browser/
sudo systemctl reload nginx

echo "[OK] Frontend deployed."
