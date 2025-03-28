#!/bin/bash

# OptiVista Frontend Deployment Script
# This script automates the installation and configuration of the OptiVista frontend

set -e  # Exit on error

# Log function
log() {
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if running as root
if [ "$(id -u)" != "0" ]; then
   log "This script must be run as root" 
   exit 1
fi

# Variables
INSTALL_DIR="/opt/optivista-frontend"
SOURCE_DIR="$(pwd)"
NGINX_CONF="/etc/nginx/nginx.conf"
SYSTEMD_SERVICE="/etc/systemd/system/optivista-frontend.service"

# 1. Install dependencies
log "Installing dependencies..."
apt-get update
apt-get install -y nginx nodejs npm
npm install -g serve
SERVE_PATH=$(which serve)
log "Serve installed at: ${SERVE_PATH}"

# 2. Create installation directory
log "Creating installation directory..."
mkdir -p ${INSTALL_DIR}

# 3. Copy frontend files
log "Copying frontend files..."
if [ -d "${SOURCE_DIR}/dist" ]; then
  cp -r ${SOURCE_DIR}/dist ${INSTALL_DIR}/
else
  log "Warning: dist directory not found."
  log "Creating a basic dist directory..."
  mkdir -p ${INSTALL_DIR}/dist
  
  # Copy HTML files if they exist in the source directory
  if [ -f "${SOURCE_DIR}/dist/index.html" ]; then
    cp ${SOURCE_DIR}/dist/index.html ${INSTALL_DIR}/dist/
  fi
  if [ -f "${SOURCE_DIR}/dist/404.html" ]; then
    cp ${SOURCE_DIR}/dist/404.html ${INSTALL_DIR}/dist/
  fi
  if [ -f "${SOURCE_DIR}/dist/50x.html" ]; then
    cp ${SOURCE_DIR}/dist/50x.html ${INSTALL_DIR}/dist/
  fi
  
  log "Note: You should build the frontend and deploy the dist folder for production."
fi

# 4. Copy configuration files
log "Copying configuration files..."
if [ -f "${SOURCE_DIR}/nginx.conf" ]; then
  cp ${SOURCE_DIR}/nginx.conf ${NGINX_CONF}
else
  log "Warning: nginx.conf not found. Nginx configuration not updated."
fi

# Update the service file with the correct serve path
if [ -f "${SOURCE_DIR}/optivista-frontend.service" ]; then
  log "Updating service file with serve path: ${SERVE_PATH}..."
  sed -i "s|ExecStart=.*|ExecStart=/usr/bin/env node ${SERVE_PATH} -s dist -l 3001|g" ${SOURCE_DIR}/optivista-frontend.service
  
  # Ensure MemoryMax is used instead of MemoryLimit
  log "Ensuring systemd service file uses up-to-date directives..."
  sed -i "s|MemoryLimit=|MemoryMax=|g" ${SOURCE_DIR}/optivista-frontend.service
  
  cp ${SOURCE_DIR}/optivista-frontend.service ${SYSTEMD_SERVICE}
else
  log "Warning: optivista-frontend.service not found. Service configuration not updated."
fi

if [ -f "${SOURCE_DIR}/healthcheck.sh" ]; then
  cp ${SOURCE_DIR}/healthcheck.sh ${INSTALL_DIR}/
  chmod +x ${INSTALL_DIR}/healthcheck.sh
else
  log "Warning: healthcheck.sh not found. Health checking not configured."
fi

# 5. Set correct permissions
log "Setting permissions..."
chown -R www-data:www-data ${INSTALL_DIR}
chmod -R 755 ${INSTALL_DIR}

# 6. Test Nginx configuration
log "Testing Nginx configuration..."
if nginx -t; then
  log "Nginx configuration test passed."
else
  log "Nginx configuration test failed. Please check the configuration."
  exit 1
fi

# 7. Reload systemd and restart services
log "Reloading systemd and restarting services..."
systemctl daemon-reload
systemctl enable optivista-frontend
systemctl restart nginx

# 8. Start frontend service
log "Starting frontend service..."
systemctl restart optivista-frontend

# 9. Set up health monitoring
log "Setting up health monitoring..."
if [ -f "${SOURCE_DIR}/crontab.txt" ]; then
  crontab ${SOURCE_DIR}/crontab.txt
  log "Crontab installed successfully."
else
  log "Warning: crontab.txt not found. Health monitoring not configured."
fi

# 10. Verify deployment
log "Verifying deployment..."
# Wait for service to start
sleep 5

# Check if service is running
if systemctl is-active --quiet optivista-frontend; then
  log "Frontend service is running."
else
  log "Warning: Frontend service failed to start. Check logs for details."
  systemctl status optivista-frontend
fi

# Check if Nginx is running
if systemctl is-active --quiet nginx; then
  log "Nginx is running."
else
  log "Warning: Nginx failed to start. Check logs for details."
  systemctl status nginx
fi

# Check if frontend is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)
if [ "$HTTP_STATUS" = "200" ]; then
  log "Frontend is accessible via HTTP."
else
  log "Warning: Frontend is not accessible via HTTP (status code: $HTTP_STATUS)."
fi

# Final message
log "Deployment completed successfully."
log "You can access the OptiVista Administrative Portal at http://your-server-ip"
log "Check the logs with: journalctl -u optivista-frontend"
log "For more information, see the README.md file." 