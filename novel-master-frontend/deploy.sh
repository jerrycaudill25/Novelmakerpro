#!/bin/bash
# deploy.sh — Novel Master Unified Deployment Script
# Run on EC2 Ubuntu 22.04 LTS

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  NOVEL MASTER — UNIFIED DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════════"

# ─── Configuration ─────────────────────────────────────────────────────────
DOMAIN="${DOMAIN:-yourdomain.com}"
EMAIL="${EMAIL:-your-email@example.com}"
FRONTEND_DIR="${FRONTEND_DIR:-/home/ubuntu/Novelmakerpro/novel-master-frontend}"
BACKEND_DIR="${BACKEND_DIR:-/home/ubuntu/Novelmakerpro/novel-master-frontend}"
WEB_ROOT="/var/www/novel-master"

# ─── System Update ─────────────────────────────────────────────────────────
echo "[1/8] Updating system..."
sudo apt update && sudo apt upgrade -y

# ─── Install Dependencies ──────────────────────────────────────────────────
echo "[2/8] Installing dependencies..."
sudo apt install -y     docker.io     docker-compose     nginx     certbot     python3-certbot-nginx     git     curl     ufw

# ─── Docker Setup ──────────────────────────────────────────────────────────
echo "[3/8] Configuring Docker..."
sudo usermod -aG docker $USER
sudo systemctl enable docker
sudo systemctl start docker

# ─── Firewall ──────────────────────────────────────────────────────────────
echo "[4/8] Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable

# ─── Frontend Setup ────────────────────────────────────────────────────────
echo "[5/8] Setting up frontend..."
sudo mkdir -p $WEB_ROOT

# Build frontend (if building on server) or copy pre-built dist/
if [ -d "$FRONTEND_DIR/dist" ]; then
    echo "Copying pre-built frontend..."
    sudo cp -r $FRONTEND_DIR/dist/* $WEB_ROOT/
else
    echo "Building frontend on server..."
    cd $FRONTEND_DIR
    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
    npm install
    npm run build
    sudo cp -r dist/* $WEB_ROOT/
fi

sudo chown -R www-data:www-data $WEB_ROOT
sudo chmod -R 755 $WEB_ROOT

# ─── Backend Setup ─────────────────────────────────────────────────────────
echo "[6/8] Setting up backend..."
cd $BACKEND_DIR

# Generate SECRET_KEY if not set
if [ -z "$SECRET_KEY" ]; then
    echo "Generating SECRET_KEY..."
    export SECRET_KEY=$(openssl rand -hex 32)
    echo "SECRET_KEY=$SECRET_KEY" >> .env
fi

# Update ALLOWED_ORIGINS with actual domain
sed -i "s/yourdomain.com/$DOMAIN/g" .env

docker-compose up --build -d

# ─── Nginx Setup ───────────────────────────────────────────────────────────
echo "[7/8] Configuring nginx..."

# Create certbot directory for Let's Encrypt
sudo mkdir -p /var/www/certbot

# Copy nginx configs
sudo cp nginx-unified.conf /etc/nginx/nginx.conf
sudo mkdir -p /etc/nginx/conf.d
sudo cp novel-master-locations.conf /etc/nginx/conf.d/

# Test and reload nginx
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx

# ─── SSL Certificate ─────────────────────────────────────────────────────────
echo "[8/8] Setting up SSL (Let's Encrypt)..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL || true

# Enable HTTPS in nginx (uncomment SSL server block)
sudo sed -i 's/# server {/server {/' /etc/nginx/nginx.conf
sudo sed -i 's/#     listen 443/listen 443/' /etc/nginx/nginx.conf
sudo sed -i 's/#     server_name/server_name/' /etc/nginx/nginx.conf
sudo sed -i 's/#     ssl_certificate/ssl_certificate/' /etc/nginx/nginx.conf
sudo sed -i 's/#     include/include/' /etc/nginx/nginx.conf
sudo sed -i 's/# }/}/' /etc/nginx/nginx.conf

# Remove HTTP server or add redirect
sudo sed -i 's/# return 301/return 301/' /etc/nginx/nginx.conf

sudo nginx -t && sudo systemctl reload nginx

# ─── Verification ────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  DEPLOYMENT COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Frontend:  https://$DOMAIN"
echo "Backend:   https://$DOMAIN/api/health"
echo "WebSocket: wss://$DOMAIN/socket.io/"
echo ""
echo "Verify health:"
echo "  curl https://$DOMAIN/api/health"
echo ""
echo "View logs:"
echo "  docker-compose -f $BACKEND_DIR/docker-compose.yml logs -f web"
echo ""
echo "═══════════════════════════════════════════════════════════════"
