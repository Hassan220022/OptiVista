# OptiVista Administrative Portal Frontend

This is the frontend for the OptiVista Administrative Portal, which provides a web interface for managing the OptiVista system.

## System Requirements

- Node.js 16.x or higher
- Nginx
- systemd

## Deployment Architecture

The frontend is deployed with the following components:

1. **Static files** served from `/opt/optivista-frontend/dist/`
2. **Nginx** for serving the static files and proxying API requests
3. **systemd service** for process management and auto-restart
4. **Health check script** for monitoring and automatic recovery

## Installation

### 1. Install Dependencies

```bash
apt-get update
apt-get install -y nginx nodejs npm
npm install -g serve
```

### 2. Deploy Frontend Files

```bash
# Clone or copy the frontend files
mkdir -p /opt/optivista-frontend
cp -r /path/to/source/dist /opt/optivista-frontend/

# Set correct permissions
chown -R www-data:www-data /opt/optivista-frontend
chmod -R 755 /opt/optivista-frontend
```

### 3. Configure Nginx

```bash
# Copy the Nginx configuration
cp /opt/optivista-frontend/nginx.conf /etc/nginx/nginx.conf

# Test the configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 4. Configure systemd Service

```bash
# Copy the service file
cp /opt/optivista-frontend/optivista-frontend.service /etc/systemd/system/

# Reload systemd
systemctl daemon-reload

# Enable and start the service
systemctl enable optivista-frontend
systemctl start optivista-frontend
```

### 5. Set Up Health Monitoring

```bash
# Make the health check script executable
chmod +x /opt/optivista-frontend/healthcheck.sh

# Install the crontab
crontab /opt/optivista-frontend/crontab.txt
```

## Configuration

The frontend is configured with the following environment variables in the systemd service file:

- `NODE_ENV`: Set to `production` for production environments
- `PORT`: The port on which the frontend service will run (default: 3001)
- `VITE_API_URL`: The URL of the backend API (default: http://localhost:3000)

## Maintenance

### Logs

- Frontend service logs: `journalctl -u optivista-frontend`
- Health check logs: `/var/log/optivista-frontend-health.log`
- Performance metrics: `/var/log/optivista-frontend-metrics.log`
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`

### Updating the Frontend

To update the frontend:

1. Upload the new frontend files to `/opt/optivista-frontend/dist`
2. Restart the service:

```bash
systemctl restart optivista-frontend
```

### Troubleshooting

1. **Frontend not responding**:
   - Check if the service is running: `systemctl status optivista-frontend`
   - Check logs for errors: `journalctl -u optivista-frontend --no-pager`
   - Verify Nginx is running: `systemctl status nginx`

2. **API requests failing**:
   - Check backend service status: `systemctl status optivista-backend`
   - Verify API endpoint is accessible: `curl http://localhost:3000/api/health`
   - Check Nginx error logs: `tail /var/log/nginx/error.log`

3. **Performance issues**:
   - Check resource usage: `top -c | grep serve`
   - Review metrics log: `tail /var/log/optivista-frontend-metrics.log`
   - Check for excessive requests in Nginx logs: `grep -i "limit_req" /var/log/nginx/error.log`

## Security Considerations

1. The frontend service runs with limited privileges as the `www-data` user
2. The service has CPU and memory limits set to 30% to prevent resource exhaustion
3. Security-related headers are set in the Nginx configuration
4. Rate limiting is configured for API endpoints
5. systemd security features are enabled:
   - Private /tmp directory
   - Restricted filesystem access
   - No new privileges

## Backup and Recovery

The frontend consists of static files that can be backed up with simple file-based backup solutions:

```bash
# Example backup command
tar -czf optivista-frontend-backup-$(date +%Y%m%d).tar.gz /opt/optivista-frontend

# Restore from backup
tar -xzf optivista-frontend-backup-YYYYMMDD.tar.gz -C /
systemctl restart optivista-frontend
```

## Resource Management

The system is configured to use no more than 30% of server resources:

- CPU quota is limited to 30% in the systemd service
- Memory is limited to 30% in the systemd service
- Worker processes in Nginx are set to auto-scale based on available CPU cores

## Monitoring

The health check script at `/opt/optivista-frontend/healthcheck.sh` runs every 5 minutes to:

1. Verify the frontend is responding correctly
2. Record CPU and memory usage metrics
3. Automatically restart the service if it's not responding
4. Send notifications (if configured with a Slack webhook URL)

## License

[Proprietary] 