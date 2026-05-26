sudo docker logs novel-master-web
sed -i '98s/""""/"""/' payment_routes.py
sudo docker compose down
sudo docker compose build --no-cache
sudo docker compose up -d
sed -i '/^version:/d' docker-compose.yml
curl http://localhost:5000/api/health
sudo docker ps --all
sudo docker logs novel-master-web --tail 20
sed -n '50,65p' payment_routes.py
sed -n '50,100p' payment_routes.py
sed -i 's/^    """$/    """)/' payment_routes.py
sed -n '94,98p' payment_routes.py
sudo docker compose down
sudo docker compose build --no-cache
sudo docker compose up -d
sudo docker logs novel-master-web --tail 20
# Check how much space you have
df -h
# Clean up old Docker junk (images, containers, caches)
sudo docker system prune -a -f
# Check space again
df -h
sudo docker logs novel-master-web --tail 20
sudo docker compose down
sudo docker compose build --no-cache
sudo docker compose up -d
# Check how much space you have
df -h
# Clean up old Docker junk (images, containers, caches)
sudo docker system prune -a -f
# Check space again
df -h
cd novelmasterpro
cd
cd novelmasterpro
ls
cd novel_master_frontend_production
ls
cd-
cd -
ls
cd novel_master_pro_backend
ls
rm novelmasterpro
rmdir novelmasterpro
rm -f noevelmasterpro
ls
rm -rf [directory

ls
rm -rf novelmasterpro.zip
ls
# Health check
curl http://your-ec2-ip/api/health
# Register a test user
curl -X POST http://your-ec2-ip/api/auth/register   -H "Content-Type: application/json"   -d '{"username":"testuser","email":"test@example.com","password":"testpass123","display_name":"Test User"}'
# Login
curl -X POST http://your-ec2-ip/api/auth/login   -H "Content-Type: application/json"   -d '{"username":"testuser","password":"testpass123"}'
# Create a project (use token from login)
curl -X POST http://your-ec2-ip/api/projects   -H "Authorization: Bearer YOUR_TOKEN"   -H "Content-Type: application/json"   -d '{"title":"Test Novel","format_type":"novel"}'
sart dockerfile
start dockerfile
run dockerfile
start dockerfiledocker build -t 
docker build -f app.dev.Dockerfile -t docke
docker build -f app.dev.Dockerfile -t # From your local machine (replace with your actual key and IP)
scp -i your-key.pem ~/Downloads/app.py ~/Downloads/access_control.py ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/novel-master/
# Then SSH in and rebuild
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd ~/novel-master
docker-compose down
docker-compose up --build -d
# From your local machine (replace with your actual key and IP)
scp -i your-key.pem ~/Downloads/app.py ~/Downloads/access_control.py ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/novel-master/
# Then SSH in and rebuild
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd ~/novel-master
docker-compose down
docker-compose up --build -d
# On your EC2 instance, run:
curl -s http://checkip.amazonaws.com
# 1. Health check (use localhost since you're SSH'd in)
curl http://localhost:5000/api/health
# 2. Or use your actual public IP (replace with yours)
curl http://YOUR_ACTUAL_PUBLIC_IP/api/health
# 3. Register test user
curl -X POST http://localhost:5000/api/auth/register   -H "Content-Type: application/json"   -d '{"username":"testuser","email":"test@example.com","password":"testpass123","display_name":"Test User"}'
# 4. Login
curl -X POST http://localhost:5000/api/auth/login   -H "Content-Type: application/json"   -d '{"username":"testuser","password":"testpass123"}'
# 5. Create project (replace YOUR_TOKEN with actual token from login response)
curl -X POST http://localhost:5000/api/projects   -H "Authorization: Bearer YOUR_TOKEN"   -H "Content-Type: application/json"   -d '{"title":"Test Novel","format_type":"novel"}'
# Check if containers are running
docker-compose ps
# Check logs
docker-compose logs -f web
# If not running, start them
cd ~/novel-master
docker-compose up --build -d
#!/bin/bash
echo "=== Novel Master Diagnostic ==="
echo "Public IP: $(curl -s http://checkip.amazonaws.com)"
echo "Docker status: $(docker ps --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null || echo 'Docker not running')"
echo ""
echo "=== Testing localhost ==="
curl -s http://localhost:5000/api/health | head -c 500
echo ""
echo "=== Container logs (last 20 lines) ==="
docker-compose logs --tail=20 web 2>/dev/null || echo "No web container found"
# From your local machine (replace with your actual key and IP)
scp -i your-key.pem ~/Downloads/app.py ~/Downloads/access_control.py ubuntu@YOUR_EC2_PUBLIC_IP:/home/ubuntu/novel-master/
# Then SSH in and rebuild
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd ~/novel-master
docker-compose down
docker-compose up --build -d
source venv/bin/activate
ls
source venv/bin/activate
ls
openssl rand -hex 32
# Novel Master Production Environment
FLASK_ENV=production
SECRET_KEY=your-64-char-hex-key-here-openssl-rand-hex-32
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
DB_PATH=/app/continuity/novel_master.db
STORAGE_ROOT=/app/storage
JWT_EXPIRY_DAYS=7
REDIS_URL=redis://redis:6379/0
# Optional: AWS S3 (uncomment when ready)
# S3_BUCKET=your-novelmaster-bucket
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# Optional: Payment provider (uncomment when ready)
# PAYMENT_PROVIDER=stripe
# PAYMENT_SECRET_KEY=sk_test_...
# PAYMENT_PUBLISHABLE_KEY=pk_test_...
# PAYMENT_WEBHOOK_SECRET=whsec_...
ls
openssl rand -hex 32
# 1. Update system
sudo apt update && sudo apt upgrade -y
# 2. Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
# Health check
curl http://your-ec2-ip/api/health
# Register a test user
curl -X POST http://your-ec2-ip/api/auth/register   -H "Content-Type: application/json"   -d '{"username":"testuser","email":"test@example.com","password":"testpass123","display_name":"Test User"}'
# Login
curl -X POST http://your-ec2-ip/api/auth/login   -H "Content-Type: application/json"   -d '{"username":"testuser","password":"testpass123"}'
# Create a project (use token from login)
curl -X POST http://your-ec2-ip/api/projects   -H "Authorization: Bearer YOUR_TOKEN"   -H "Content-Type: application/json"   -d '{"title":"Test Novel","format_type":"novel"}'
ls
source venv/bin/activate
ls
# 1. Update system
sudo apt update && sudo apt upgrade -y
# 2. Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
# 3. Create project directory
mkdir -p ~/novel-master
#!/bin/bash
# entrypoint.sh — Novel Master Startup Script
set -e
echo "[Novel Master] Starting up..."
# Ensure storage directories exist
mkdir -p /app/storage /app/continuity /app/continuity/backups
ls
unzip back.zip
ls
unzip front.zip
ls
#!/bin/bash
echo "=== Novel Master Diagnostic ==="
echo "Public IP: $(curl -s http://checkip.amazonaws.com)"
echo "Docker status: $(docker ps --format 'table {{.Names}}\t{{.Status}}' 2>/dev/null || echo 'Docker not running')"
echo ""
echo "=== Testing localhost ==="
curl -s http://localhost:5000/api/health | head -c 500
echo ""
echo "=== Container logs (last 20 lines) ==="
docker-compose logs --tail=20 web 2>/dev/null || echo "No web container found"
# On your EC2 instance, run:
curl -s http://checkip.amazonaws.com
# 1. Update system
sudo apt update && sudo apt upgrade -y
# 2. Install Docker & Docker Compose
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
# 3. Create project directory
mkdir -p ~/novel-master
cd ~/novel-master
# 4. Upload all files (from your local machine)
# scp -i your-key.pem -r ./novel-master/* ubuntu@your-ec2-ip:/home/ubuntu/novel-master/
# 5. Set permissions
chmod +x entrypoint.sh
# 6. Build and start
docker-compose up --build -d
# 7. Check logs
docker-compose logs -f web
# 8. Verify health
curl http://localhost:5000/api/health
ls
cd
ls
source venv/bin/activate
ls
cd
cd-
ls
# On your EC2 Ubuntu 22.04 instance:
chmod +x deploy.sh
sudo DOMAIN=yourdomain.com EMAIL=you@email.com ./deploy.sh
unzip novel master pro front end
unzip novel_master_pro_frontend
unzip novel master pro frontend.zip
unzip front.zip
ls
unzip back.zip
ls
# On your EC2 Ubuntu 22.04 instance:
chmod +x deploy.sh
sudo DOMAIN=yourdomain.com EMAIL=you@email.com ./deploy.sh
cd /front
ls
cd /novelmasterprofront
ls
cd /home/ubuntu/novelmasterprofront
# On your EC2 Ubuntu 22.04 instance:
chmod +x deploy.sh
sudo DOMAIN=yourdomain.com EMAIL=you@email.com ./deploy.sh
ls
unzip front.zip
ls
# On your EC2 Ubuntu 22.04 instance:
chmod +x deploy.sh
sudo DOMAIN=yourdomain.com EMAIL=you@email.com ./deploy.sh
ls
nano
ls
# On your EC2 Ubuntu 22.04 instance:
chmod +x deploy.sh
sudo DOMAIN=yourdomain.com EMAIL=you@email.com ./deploy.sh
ls
unzip novel-master-frontend.zip
ls
cd novel-master-frontend.zip
cd novel-master-frontend
ls
cd
unzip novel-master-backend.zip
ls
unzip novel-master-backend.zip
ls
cd novel-master-frontend
ls
cd /home/ubuntu/novel-master-frontend && npm install && npm run build 
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Create all subdirectories
mkdir -p src/{components/{editor,feed,layout,lorebook,settings,ui},pages,services,store,types,hooks}
# 3. Move flat files to proper locations
mv services_api.ts src/services/api.ts
mv services_websocket.ts src/services/websocket.ts
mv store_useStore.ts src/store/useStore.ts
mv types_index.ts src/types/index.ts
mv useAuth.ts src/hooks/useAuth.ts
mv App.tsx src/App.tsx
mv main.tsx src/main.tsx
mv index.css src/index.css
# 4. Move components
mv components_editor_AISidebar.tsx src/components/editor/AISidebar.tsx
mv components_editor_FullScreenEditor.tsx src/components/editor/FullScreenEditor.tsx
mv components_lorebook_CharacterCard.tsx src/components/lorebook/CharacterCard.tsx
mv components_lorebook_LorebookPanel.tsx src/components/lorebook/LorebookPanel.tsx
mv components_lorebook_WorldLoreCard.tsx src/components/lorebook/WorldLoreCard.tsx
mv components_settings_AISettingsSection.tsx src/components/settings/AISettingsSection.tsx
mv components_settings_StyleProfileViewer.tsx src/components/settings/StyleProfileViewer.tsx
# 5. Move pages
mv pages_SettingsPage.tsx src/pages/SettingsPage.tsx
mv AuthPage.tsx src/pages/AuthPage.tsx
mv HomePage.tsx src/pages/HomePage.tsx
mv LibraryPage.tsx src/pages/LibraryPage.tsx
mv ProfilePage.tsx src/pages/ProfilePage.tsx
# 6. Move layout & UI
mv AppLayout.tsx src/components/layout/AppLayout.tsx
mv MobileNav.tsx src/components/layout/MobileNav.tsx
mv Sidebar.tsx src/components/layout/Sidebar.tsx
mv TopBar.tsx src/components/layout/TopBar.tsx
mv FeedTabs.tsx src/components/feed/FeedTabs.tsx
mv PostCard.tsx src/components/feed/PostCard.tsx
mv Avatar.tsx src/components/ui/Avatar.tsx
mv Badge.tsx src/components/ui/Badge.tsx
mv Button.tsx src/components/ui/Button.tsx
mv Card.tsx src/components/ui/Card.tsx
mv Input.tsx src/components/ui/Input.tsx
mv Skeleton.tsx src/components/ui/Skeleton.tsx
# 7. Fix package.json — add "type": "module"
nano package.json
# Add this line right after the opening { :
#   "type": "module",
# 8. Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
# 9. Copy to nginx web root
sudo mkdir -p /var/www/novel-master
sudo cp -r dist/* /var/www/novel-master/
sudo chown -R www-data:www-data /var/www/novel-master
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Clean everything and reinstall
rm -rf node_modules package-lock.json
npm install
# 3. Verify @tanstack/react-query is installed
ls node_modules/@tanstack/react-query
# 4. If that folder exists, rebuild
npm run build
# 5. If build succeeds, copy to nginx
sudo mkdir -p /var/www/novel-master
sudo cp -r dist/* /var/www/novel-master/
sudo chown -R www-data:www-data /var/www/novel-master
# 1. Make sure you're in the frontend directory
cd /home/ubuntu/novel-master-frontend
npm install 
npm audit fix --force
ls
node_modules/@tanstack/react-query
# If it already finished, check if node_modules exists:
ls node_modules/@tanstack/react-query
# 1. Check if frontend.zip has real code
unzip -l frontend.zip 2>/dev/null | head -10 || echo "No frontend.zip here"
a# 2. Check what's ACTUALLY in your src/ now
find src -type f | sort
src/main.tsx
ls
cd novel-master-frontend
ls
cd /home/ubuntu/novel-master-frontend
# Check if src is empty
ls src/
# If empty, you need to re-upload properly from your local machine
# OR extract from frontend.zip and organize
cd /home/ubuntu/novel-master-frontend
# Install ALL dependencies explicitly
npm install react react-dom @tanstack/react-query react-router-dom zustand framer-motion lucide-react axios socket.io-client react-hot-toast
# Install dev dependencies
npm install -D @vitejs/plugin-react vite typescript tailwindcss postcss autoprefixer @tailwindcss/typography
# Fix vite config name
mv vite.config.txt vite.config.ts 2>/dev/null || true
# Build
rm -rf node_modules/.vite dist
npm run build
# Deploy
sudo mkdir -p /var/www/novel-master
sudo cp -r dist/* /var/www/novel-master/
sudo chown -R www-data:www-data /var/www/novel-master
# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Fix nginx port conflict
# ═══════════════════════════════════════════════════════════════════════════
# Find what's using port 80
sudo lsof -i :80
sudo ss -tlnp | grep :80
# Kill whatever is using port 80 (probably apache2 or another nginx)
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo pkill apache2
sudo pkill nginx
# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default
# Start nginx fresh
sudo nginx -t
sudo systemctl start nginx
sudo systemctl status nginx
# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Fix nginx port conflict
# ═══════════════════════════════════════════════════════════════════════════
# Find what's using port 80
sudo lsof -i :80
sudo ss -tlnp | grep :80
# Kill whatever is using port 80 (probably apache2 or another nginx)
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo pkill apache2
sudo pkill nginx
# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default
# Start nginx fresh
sudo nginx -t
sudo systemctl start nginx
sudo systemctl status nginx
install apache
# Update the package list
sudo apt update -y
# Install the Apache2 package
sudo apt install apache2 -y
# Start and enable the service
sudo systemctl start apache2
sudo systemctl enable apache2
# ═══════════════════════════════════════════════════════════════════════════
# STEP 1: Fix nginx port conflict
# ═══════════════════════════════════════════════════════════════════════════
# Find what's using port 80
sudo lsof -i :80
sudo ss -tlnp | grep :80
# Kill whatever is using port 80 (probably apache2 or another nginx)
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo pkill apache2
sudo pkill nginx
# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default
# Start nginx fresh
sudo nginx -t
sudo systemctl start nginx
sudo systemctl status nginx
ls
# ═══════════════════════════════════════════════════════════════════════════
# STEP 2: Fix npm dependency conflict (Vite version)
# ═══════════════════════════════════════════════════════════════════════════
cd /home/ubuntu/novel-master-frontend
# Clean everything
rm -rf node_modules package-lock.json
# Install with legacy peer deps to bypass version conflict
npm install --legacy-peer-deps
# If that fails, use force
# npm install --force
# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Fix vite.config.txt → vite.config.ts
# ═══════════════════════════════════════════════════════════════════════════
mv vite.config.txt vite.config.ts
ls
# ═══════════════════════════════════════════════════════════════════════════
# STEP 3: Fix vite.config.txt → vite.config.ts
# ═══════════════════════════════════════════════════════════════════════════
mv vite.config.txt vite.config.ts
ls
# ═══════════════════════════════════════════════════════════════════════════
# STEP 4: Build
# ═══════════════════════════════════════════════════════════════════════════
npm run build
ls
# 1. Where is everything?
ls -la /home/ubuntu/
# 2. Where is your frontend package.json?
find /home/ubuntu -maxdepth 3 -name "package.json" 2>/dev/null
# 3. What is using port 80?
sudo lsof -i :80
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Check if @tanstack/react-query is in package.json
ls
nano package.json 
# 2. Check if @tanstack/react-query is in package.json
cat package.json | grep -A 5 "dependencies"
# 3. If it's missing from package.json, install it explicitly
npm install @tanstack/react-query
# 4. Also ensure all other deps are present
npm install react react-dom react-router-dom zustand framer-motion lucide-react axios socket.io-client react-hot-toast
# 5. Install dev dependencies
npm install -D @vitejs/plugin-react vite typescript tailwindcss postcss autoprefixer @tailwindcss/typography
# 6. Fix vite.config.txt → vite.config.ts
mv vite.config.txt vite.config.ts 2>/dev/null || true
# 7. Clear cache and rebuild
rm -rf node_modules/.vite dist
npm run build
# 3. Install @tanstack/react-query explicitly
cd /home/ubuntu/novel-master-frontend
npm install @tanstack/react-query
# 4. Verify it installed
ls node_modules/@tanstack/react-query
# 5. If it exists, rebuild
rm -rf dist
npm run build
cd /home/ubuntu/novel-master-frontend
# Wipe everything
rm -rf node_modules package-lock.json
# Install ALL dependencies fresh (including the missing one)
npm install react react-dom @tanstack/react-query react-router-dom zustand framer-motion lucide-react axios socket.io-client react-hot-toast react-intersection-observer
# Install dev dependencies
npm install -D @vitejs/plugin-react vite typescript tailwindcss postcss autoprefixer @tailwindcss/typography @types/react @types/react-dom
# Build
npm run build
# 3. Add @tanstack/react-query to package.json explicitly
npm install @tanstack/react-query --force
# 4. Verify it installed
ls node_modules/@tanstack/react-query/package.json
# 5. If it exists, rebuild
rm -rf dist
npm run build
npm run fund
npm run
update npm
pupdate npm
sudo apt install pbuilder-scripts
clear memory
# clear memory
ls
rm -rf package-lock.json
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Check what's ACTUALLY in package.json
cat package.json
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Replace package.json with correct dependencies
cat > package.json << 'EOF'
{
  "name": "novel-master-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "@tanstack/react-query": "^5.64.0",
    "autoprefixer": "^10.4.16",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.460.0",
    "postcss": "^8.4.32",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-intersection-observer": "^9.5.3",
    "react-router-dom": "^6.20.0",
    "react-virtualized": "^9.22.5",
    "socket.io-client": "^4.7.4",
    "tailwindcss": "^3.3.6",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.4.0",
    "vite-plugin-pwa": "^0.21.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
EOF

# 3. Wipe and reinstall
rm -rf node_modules package-lock.json
npm install --force
# 4. Build
npm run build
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Find ALL files that still import from old "react-query"
grep -r "from 'react-query'" src/
grep -r 'from "react-query"' src/
# 3. Replace all old imports with new TanStack Query v5 imports
# Old: import { useQuery, useMutation } from 'react-query'
# New: import { useQuery, useMutation } from '@tanstack/react-query'
# Use sed to replace in ALL files
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/from 'react-query'/from '@tanstack\/react-query'/g"
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/from "react-query"/from "@tanstack\/react-query"/g'
# 4. Also check for any remaining old imports
grep -r "react-query" src/ | grep -v "@tanstack"
# 5. Rebuild
rm -rf dist
npm run build
# 1. Deploy to nginx web root
sudo mkdir -p /var/www/novel-master
sudo cp -r dist/* /var/www/novel-master/
sudo chown -R www-data:www-data /var/www/novel-master
# 2. Fix nginx config if not already done
sudo rm -f /etc/nginx/sites-enabled/default
# 3. Copy the clean site config (if you haven't already)
sudo cp /home/ubuntu/novel-master-frontend/novel-master-site.conf /etc/nginx/sites-available/novel-master 2>/dev/null || echo "Config not found, using existing"
# 4. Enable the site
sudo ln -sf /etc/nginx/sites-available/novel-master /etc/nginx/sites-enabled/ 2>/dev/null || true
# 5. Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
# 1. Backup old config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.broken
# 2. Download and install clean config
sudo curl -o /etc/nginx/nginx.conf https://raw.githubusercontent.com/your-repo/nginx-clean.conf
# OR if you have the file locally:
# sudo cp /path/to/nginx-clean.conf /etc/nginx/nginx.conf
# 3. Remove broken site configs
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/conf.d/*
# 4. Test config
sudo nginx -t
# 5. If test passes, restart nginx
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
ls
# 1. Write clean nginx config directly
sudo tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        root /var/www/novel-master;
        index index.html;

        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        location / {
            try_files $uri $uri/ /index.html;
            
            location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
                access_log off;
            }
            
            location ~* \.html$ {
                expires 1h;
                add_header Cache-Control "public, must-revalidate";
            }
            
            location /sw.js {
                add_header Cache-Control "no-cache, no-store, must-revalidate";
                expires off;
            }
        }

        location /api/ {
            limit_req zone=api burst=50 nodelay;
            proxy_pass http://localhost:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 120s;
            proxy_read_timeout 120s;
            proxy_buffering off;
        }

        location /api/auth/ {
            limit_req zone=auth burst=10 nodelay;
            proxy_pass http://localhost:5000/api/auth/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /socket.io/ {
            proxy_pass http://localhost:5000/socket.io/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
            proxy_buffering off;
        }

        location /api/health {
            proxy_pass http://localhost:5000/api/health;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            access_log off;
        }
    }
}
EOF

# 2. Remove broken includes
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/conf.d/*
# 3. Test and restart
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
# 1. Write clean nginx config directly
sudo tee /etc/nginx/nginx.conf > /dev/null << 'EOF'
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;

    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        root /var/www/novel-master;
        index index.html;

        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;

        location / {
            try_files $uri $uri/ /index.html;
            
            location ~* \.(?:js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
                access_log off;
            }
            
            location ~* \.html$ {
                expires 1h;
                add_header Cache-Control "public, must-revalidate";
            }
            
            location /sw.js {
                add_header Cache-Control "no-cache, no-store, must-revalidate";
                expires off;
            }
        }

        location /api/ {
            limit_req zone=api burst=50 nodelay;
            proxy_pass http://localhost:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 30s;
            proxy_send_timeout 120s;
            proxy_read_timeout 120s;
            proxy_buffering off;
        }

        location /api/auth/ {
            limit_req zone=auth burst=10 nodelay;
            proxy_pass http://localhost:5000/api/auth/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /socket.io/ {
            proxy_pass http://localhost:5000/socket.io/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 86400;
            proxy_send_timeout 86400;
            proxy_buffering off;
        }

        location /api/health {
            proxy_pass http://localhost:5000/api/health;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            access_log off;
        }
    }
}
EOF

ls
# 2. Remove broken includes
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/conf.d/*
ls
# 3. Test and restart
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
# 1. Check what's actually in nginx.conf
sudo cat /etc/nginx/nginx.conf
# 2. Check file size
ls -la /etc/nginx/nginx.conf
# 3. Full error output
sudo nginx -t 2>&1
# 1. Fix the user in nginx.conf
sudo sed -i 's/user nginx;/user www-data;/' /etc/nginx/nginx.conf
# 2. Verify the change
sudo head -1 /etc/nginx/nginx.conf
# 3. Test nginx
sudo nginx -t
# 4. If test passes, restart nginx
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager
# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Fix package.json — downgrade Vite to v5 (stable, compatible)
sed -i 's/"vite": "\^8.0.14"/"vite": "^5.4.0"/' package.json
# 3. Verify the change
cat package.json | grep vite
# 4. Wipe and reinstall with legacy peer deps
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
# 5. Verify vite is installed
npx vite --version
# 6. Build
npm run build
cd /home/ubuntu/novel-master-frontend
rm -rf node_modules package-lock.json
npm install --force
npm run build
# 1. SSH to your EC2
ssh ubuntu@YOUR-EC2-IP
# 2. Create backend directory
mkdir -p ~/novel-master/backend && cd ~/novel-master/backend
# 3. Upload all files (scp from your local machine)
# Or: unzip the archive I generated
# 4. Create .env
cat > .env << 'EOF'
SECRET_KEY=$(openssl rand -hex 32)
FLASK_ENV=production
ALLOWED_ORIGINS=http://YOUR-EC2-PUBLIC-IP,https://yourdomain.com
DB_PATH=/app/continuity/novel_master.db
STORAGE_ROOT=/app/storage
JWT_EXPIRY_DAYS=7
REDIS_URL=redis://redis:6379/0
EOF

# 5. Build and start
docker-compose up -d --build
# 6. Verify
curl http://localhost:5000/api/health
ls
cd
ls
# 2. Create backend directory
mkdir -p ~/novel-master/backend && cd ~/novel-master/backend
ls
cd
ls
cd ~/novel-master/backend
# 3. Upload all files (scp from your local machine)
ls
cp path
cd
ls
cd ~/novel-master/backend
unzip novel-master-frontend.zip 
ls
unzip novel-master-backend.zip
ls
# 2.Create backend directory
mkdir -p ~/novel-master/backend && cd ~/novel-master/backend
# 3. Upload all files (scp from your local machine)
# Or: unzip the archive I generated
# 4. Create .env
cat > .env << 'EOF'
SECRET_KEY=$(openssl rand -hex 32)
FLASK_ENV=production
ALLOWED_ORIGINS=http://YOUR-EC2-PUBLIC-IP,https://yourdomain.com
DB_PATH=/app/continuity/novel_master.db
STORAGE_ROOT=/app/storage
JWT_EXPIRY_DAYS=7
REDIS_URL=redis://redis:6379/0
EOF

# 5. Build and start
docker-compose up -d --build
# 6. Verify
curl http://localhost:5000/api/health
cd ~/novel-master/backend && docker compose down && docker compose up -d
curl http://localhost:5000/api/health
location /api/ {
}
location /socket.io/ {
}
curl -fsSL https://pastebin.com/raw/XXXXXX | sudo bash
sudo nano /etc/nginx/sites-available/novel-master
ls
# Should return your React app HTML
curl -s http://YOUR-EC2-IP/ | head -5
# Should return {"status":"healthy"}
curl -s http://YOUR-EC2-IP/api/health
# Should return 400 (no WebSocket upgrade) — that's normal for curl
curl -s -o /dev/null -w "%{http_code}" http://YOUR-EC2-IP/socket.io/
// src/services/api.ts — Change from:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
// To:
const API_BASE_URL = '';  // Empty = relative to current domain
// So /api/health becomes http://YOUR-EC2-IP/api/health automatically
sudo bash -c '
FRONTEND_DIR="/var/www/novel-master"
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "EC2 IP: $EC2_IP"
echo "Patching JS files..."

find "$FRONTEND_DIR" -name "*.js" -exec sed -i "s|http://localhost:5000||g" {} +
find "$FRONTEND_DIR" -name "*.js" -exec sed -i "s|https://localhost:5000||g" {} +
find "$FRONTEND_DIR" -name "*.js" -exec sed -i "s|ws://localhost:5000|ws://$EC2_IP|g" {} +

echo "Done. Reloading Nginx..."
systemctl reload nginx
echo "Test: http://$EC2_IP/api/health"
'
EC2_IP="54.162.148.159"
echo "=== Patching frontend JS files ==="
sudo find /var/www/novel-master -name "*.js" -exec sed -i "s|http://localhost:5000||g" {} +
sudo find /var/www/novel-master -name "*.js" -exec sed -i "s|https://localhost:5000||g" {} +
sudo find /var/www/novel-master -name "*.js" -exec sed -i "s|ws://localhost:5000|ws://$EC2_IP|g" {} +
echo "=== Checking backend ==="
curl -s http://localhost:5000/api/health
echo "=== Reloading Nginx ==="
sudo nginx -t && sudo systemctl reload nginx
echo "=== Done. Test: http://$EC2_IP/api/health ==="
echo "=== 1. Backend direct ===" && curl -s http://localhost:5000/api/health
echo ""
echo "=== 2. Backend via Nginx ===" && curl -s http://54.162.148.159/api/health
echo ""
echo "=== 3. Nginx has /api proxy? ===" && grep -n "location /api" /etc/nginx/sites-available/* /etc/nginx/nginx.conf 2>/dev/null
echo ""
echo "=== 4. localhost still in JS? ===" && grep -r "localhost:5000" /var/www/novel-master/ 2>/dev/null | head -3
echo ""
echo "=== 5. CORS allowed origins ===" && cat ~/novel-master/backend/.env 2>/dev/null | grep ALLOWED
echo ""
echo "=== 6. Containers running? ===" && docker ps | grep novel-master
echo ""
echo "=== 7. Nginx errors ===" && sudo tail -3 /var/log/nginx/error.log
EC2_IP="54.162.148.159"
echo "=== 1. Fix CORS in backend .env ==="
cd ~/novel-master/backend
sed -i "s|ALLOWED_ORIGINS=.*|ALLOWED_ORIGINS=http://$EC2_IP|" .env
cat .env | grep ALLOWED
echo ""
echo "=== 2. Restart backend to pick up new CORS ==="
docker compose restart web
sleep 5
echo ""
echo "=== 3. Fix Nginx — remove duplicate /api from nginx.conf ==="
sudo sed -i '/location \/api\//,/}/d' /etc/nginx/nginx.conf
sudo sed -i '/location \/socket.io\//,/}/d' /etc/nginx/nginx.conf
echo ""
echo "=== 4. Verify only sites-available has the proxy ==="
grep -n "location /api" /etc/nginx/sites-available/novel-master
grep -n "location /api" /etc/nginx/nginx.conf || echo "No /api in nginx.conf (good)"
echo ""
echo "=== 5. Test Nginx config and reload ==="
sudo nginx -t && sudo systemctl reload nginx
echo ""
echo "=== 6. Final test ==="
curl -s -H "Origin: http://$EC2_IP" http://$EC2_IP/api/health
echo ""
echo "========================================"
echo "FIX COMPLETE"
echo "========================================"
echo "Now open http://$EC2_IP/ in browser"
echo "Click Sign In — it should work."
echo ""
echo "If buttons still do nothing, open DevTools (F12) → Console"
echo "and tell me what error you see."
echo "========================================"
ls
sudo bash -c '
EC2_IP="54.162.148.159"
BACKUP_DIR="/root/nginx-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "=== Backing up current config ==="
mkdir -p "$BACKUP_DIR"
cp /etc/nginx/nginx.conf "$BACKUP_DIR/nginx.conf.$TIMESTAMP"

echo "=== Removing conflicting site configs ==="
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/novel-master
rm -f /etc/nginx/sites-available/novel-master

echo "=== Writing clean nginx.conf ==="
cat > /etc/nginx/nginx.conf << NGINXEOF
user www-data;
worker_processes auto;
pid /run/nginx.pid;
error_log /var/log/nginx/error.log;

events {
    worker_connections 768;
}

http {
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    access_log /var/log/nginx/access.log;
    gzip on;

    server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;

        location / {
            root /var/www/novel-master/;
            try_files $uri $uri/ /index.html;
            index index.html;
        }

        location /api/ {
            proxy_pass http://localhost:5000/api/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            add_header Access-Control-Allow-Origin $http_origin always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, Origin" always;
            add_header Access-Control-Allow-Credentials "true" always;
            if ($request_method = OPTIONS) {
                return 204;
            }
            proxy_connect_timeout 120s;
            proxy_send_timeout 120s;
            proxy_read_timeout 120s;
        }

        location /socket.io/ {
            proxy_pass http://localhost:5000/socket.io/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_connect_timeout 60s;
            proxy_send_timeout 86400s;
            proxy_read_timeout 86400s;
            add_header Access-Control-Allow-Origin $http_origin always;
            add_header Access-Control-Allow-Credentials "true" always;
        }
    }
}
NGINXEOF

echo "=== Testing config ==="
nginx -t

echo "=== Reloading Nginx ==="
systemctl reload nginx

echo ""
echo "========================================"
echo "NGINX FIXED"
echo "========================================"
echo "Test: http://$EC2_IP/api/health"
echo "Test: http://$EC2_IP/ (frontend)"
echo ""
echo "If broken, restore with:"
echo "  sudo cp $BACKUP_DIR/nginx.conf.$TIMESTAMP /etc/nginx/nginx.conf"
echo "  sudo systemctl reload nginx"
echo "========================================"
'
"Test: http://$EC2_IP/ (frontend)"
echo ""
echo "If broken, restore with:"
echo "  sudo cp $BACKUP_DIR/nginx.conf.$TIMESTAMP /etc/nginx/nginx.conf"
echo "  sudo systemctl reload nginx"
echo "========================================"
'
=== Backing up current config ===
=== Removing conflicting site configs ===
=== Writing clean nginx.conf ===
=== Testing config ===
2026/05/25 19:02:58 [emerg] 367076#367076: invalid number of arguments in "proxy_set_header" directive in /etc/nginx/nginx.conf:33
nginx: configuration file /etc/nginx/nginx.conf test failed
=== Reloading Nginx ===
Job for nginx.service failed.
See "systemctl status nginx.service" and "journalctl -xeu nginx.service" for details.
========================================
NGINX FIXED
========================================
Test: http://54.162.148.159/api/health
Test: http://54.162.148.159/ (frontend)
sudo systemctl stop nginx
sudo apt-get install --reinstall nginx -y
sudo rm -f /etc/nginx/sites-enabled/*
sudo rm -f /etc/nginx/sites-available/*
sudo tee /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
events { worker_connections 768; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server {
        listen 80;
        location / { root /var/www/novel-master/; try_files $uri $uri/ /index.html; }
        location /api/ { proxy_pass http://localhost:5000/api/; }
        location /socket.io/ { proxy_pass http://localhost:5000/socket.io/; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; }
    }
}
EOF
sudo nginx -t && sudo systemctl start nginx


sudo cp /tmp/nginx.conf /etc/nginx/nginx.conf
sudo rm -f /etc/nginx/sites-enabled/*
sudo nginx -t && sudo systemctl restart nginx

sudo cp /tmp/nginx.conf /etc/nginx/nginx.conf
sudo rm -f /etc/nginx/sites-enabled/*
sudo nginx -t && sudo systemctl restart nginx


ls
sudo apt-get install --reinstall nginx -y && sudo rm -f /etc/nginx/sites-enabled/* && sudo cp /tmp/nginx.conf /etc/nginx/nginx.conf && sudo nginx -t && sudo systemctl restart nginx
sudo rm -f /etc/nginx/sites-enabled/* /etc/nginx/sites-available/*
sudo bash -c 'printf "%s\n" "user www-data;" "worker_processes auto;" "events { worker_connections 768; }" "http {" "  include /etc/nginx/mime.types;" "  default_type application/octet-stream;" "  server {" "    listen 80;" "    location / { root /var/www/novel-master/; try_files \$uri \$uri/ /index.html; }" "    location /api/ { proxy_pass http://localhost:5000/api/; }" "    location /socket.io/ { proxy_pass http://localhost:5000/socket.io/; proxy_http_version 1.1; proxy_set_header Upgrade \$http_upgrade; proxy_set_header Connection upgrade; }" "  }" "}" > /etc/nginx/nginx.conf'
sudo nginx -t && sudo systemctl restart nginx
curl http://54.162.148.159/api/health
EC2_IP="54.162.148.159"
echo "=== 1. CORS TEST ==="
curl -s -o /dev/null -w "%{http_code}" -X OPTIONS -H "Origin: http://$EC2_IP" -H "Access-Control-Request-Method: POST" http://$EC2_IP/api/auth/login
echo ""
echo "=== 2. LOGIN TEST ==="
curl -s -X POST http://$EC2_IP/api/auth/login -H "Content-Type: application/json" -d '{"username":"test","password":"test"}' | head -c 200
echo ""
echo "=== 3. CHECK FOR LOCALHOST IN FRONTEND ==="
grep -r "localhost" /var/www/novel-master/ 2>/dev/null | head -5 || echo "NONE FOUND"
echo ""
echo "=== 4. CHECK API URL PATTERN ==="
grep -o "http[^\"]*" /var/www/novel-master/assets/*.js 2>/dev/null | head -5
echo ""
echo "=== 5. NGINX ACCESS LOG ==="
sudo tail -3 /var/log/nginx/access.log
curl -X POST http://54.162.148.159/api/auth/login   -H "Content-Type: application/json"   -d '{"username":"testuser","password":"wrongpass"}'
cd src/services/
ls
/home/ubuntu/novel-master-frontend/src/services
cd /home/ubuntu/novel-master-frontend/src/services
nano api.ts
cd/home/ubuntu/novel-master-frontend/src/services
cd /home/ubuntu/novel-master-frontend/src/services
ls
import { useState } from 'react';
import { authApi } from '../services/api';
function SignIn() {   const [username, setUsername] = useState('');
}
agement:     https://landscape.canonical.com
ubuntu@ip-172-31-27-237:~/novel-master-frontend/src/services$ import { useState ubuntu@ip-172-31-27-237:~/novel-master-frontend/src/services$ import { useState
} from 'react';
import { authApi } from '../services/api';
function SignIn() {   const [username, setUsername] = useState('');
}
Command 'import' not found, but can be installed with:
sudo apt install imagemagick-7.q16      # version 8:7.1.2.18+dfsg1-1, or
sudo apt install imagemagick-7.q16hdri  # version 8:7.1.2.18+dfsg1-1
Command 'import' not found, but can be installed with:
sudo apt install imagemagick-7.q16      # version 8:7.1.2.18+dfsg1-1, or
sudo apt install imagemagick-7.q16hdri  # version 8:7.1.2.18+dfsg1-1
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `;'
Command 'try' not found, did you mean:
  command 'dry' from snap dry (v0.12.2+git10.af846a8e)
  command 'trs' from deb konwert (1.8-15build1)
  command 'tre' from deb tre-command (0.4.0-7)
  command 'trn' from deb trn4 (4.0-test77-19)
  command 'trf' from deb trf (4.09.1-6build1)
  command 'pry' from deb pry (0.15.2-1)
  command 'tr' from deb coreutils-from-gnu (0.0.0~ubuntu25)
  command 'tr' from deb coreutils-from-uutils (0.0.0~ubuntu25)
  command 'tr' from deb coreutils-from-busybox (0.0.0~ubuntu25)
  command 'tty' from deb coreutils-from-gnu (0.0.0~ubuntu25)
  command 'tty' from deb coreutils-from-uutils (0.0.0~ubuntu25)
  command 'tty' from deb coreutils-from-busybox (0.0.0~ubuntu25)
  command 'tty' from deb coreutils-from-toybox (0.0.0~ubuntu25)
See 'snap info <snapname>' for additional versions.
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `'nm_token','
window.location.href: command not found
-bash: //: Is a directory
-bash: syntax error near unexpected token `}'
-bash: syntax error near unexpected token `err.response?.data?.message'
-bash: syntax error near unexpected token `}'
-bash: syntax error near unexpected token `}'
-bash: syntax error near unexpected token `newline'
-bash: syntax error near unexpected token `newline'
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `newline'
-bash: syntax error near `style={{color:'red'}}>{error}<'
-bash: syntax error near unexpected token `newline'
-bash: syntax error near unexpected token `)'
-bash: syntax error near unexpected token `}'
ubuntu@ip-172-31-27-237:~/novel-master-frontend/src/services$

# 1. Go to frontend directory
cd /home/ubuntu/novel-master-frontend
# 2. Fix package.json — downgrade Vite to v5 (stable, compatible)
sed -i 's/"vite": "\^8.0.14"/"vite": "^5.4.0"/' package.json
# 3. Verify the change
cat package.json | grep vite
# 4. Wipe and reinstall with legacy peer deps
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
# 5. Verify vite is installed
npx vite --version
# 6. Build
npm run build
# 1. Check if frontend is served
curl -I http://localhost
# 2. Check if you can see the HTML
curl http://localhost | head -20
# 3. Check backend health (if docker is running)
curl http://localhost:5000/api/health
# 1. Install certbot
sudo apt install -y certbot python3-certbot-nginx
# 2. Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# 3. Follow prompts, choose redirect HTTP to HTTPS
# 1. SSH to your EC2
ssh ubuntu@YOUR-EC2-IP
# 2. Create backend directory
mkdir -p ~/novel-master/backend && cd ~/novel-master/backend
# 3. Upload all files (scp from your local machine)
# Or: unzip the archive I generated
# 4. Create .env
cat > .env << 'EOF'
SECRET_KEY=$(openssl rand -hex 32)
FLASK_ENV=production
ALLOWED_ORIGINS=http://YOUR-EC2-PUBLIC-IP,https://yourdomain.com
DB_PATH=/app/continuity/novel_master.db
STORAGE_ROOT=/app/storage
JWT_EXPIRY_DAYS=7
REDIS_URL=redis://redis:6379/0
EOF

# 5. Build and start
docker-compose up -d --build
# 6. Verify
curl http://localhost:5000/api/health
mkdir -p ~/novel-master/backend && cd ~/novel-master/backend
unzip novel-master-backend.zip 
unzip novel_master_pro_backend.zip
ls
unzip novel_master-pro.zip
ls
cd
ls
cat ~/novel-master-frontend/src/hooks/useAuth.ts
cat > ~/novel-master-frontend/src/services/api.ts << 'EOF'
import axios, { AxiosError, AxiosResponse } from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('nm_token'); if (token && config.headers) { config.headers.Authorization = `Bearer ${token}`; } return config; }, (error) => Promise.reject(error));
api.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => { if (error.response?.status === 401) { localStorage.removeItem('nm_token'); window.location.href = '/auth'; } return Promise.reject(error); });
api.login = (data: any) => api.post('/api/auth/login', data);
api.register = (data: any) => api.post('/api/auth/register', data);
api.getMe = () => api.get('/api/auth/me');
export const authApi = { login: api.login, register: api.register, me: api.getMe };
export const projectsApi = { list: () => api.get('/api/projects'), create: (data: any) => api.post('/api/projects', data), get: (id: number) => api.get(`/api/projects/${id}`), update: (id: number, data: any) => api.put(`/api/projects/${id}`, data), delete: (id: number) => api.delete(`/api/projects/${id}`), duplicate: (id: number) => api.post(`/api/projects/${id}/duplicate`) };
export const filesApi = { create: (projectId: number, data: any) => api.post(`/api/projects/${projectId}/files`, data), upload: (projectId: number, file: File, displayName?: string) => { const formData = new FormData(); formData.append('file', file); if (displayName) formData.append('display_name', displayName); return api.post(`/api/projects/${projectId}/files/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); }, getContent: (projectId: number, fileId: number) => api.get(`/api/projects/${projectId}/files/${fileId}/content`), updateContent: (projectId: number, fileId: number, content: string) => api.put(`/api/projects/${projectId}/files/${fileId}/content`, { content }), delete: (projectId: number, fileId: number) => api.delete(`/api/projects/${projectId}/files/${fileId}`) };
export const aiApi = { audit: (projectId: number) => api.post(`/api/projects/${projectId}/ai-audit`), exportProject: (projectId: number, format: 'txt' | 'md' | 'docx' = 'txt') => api.get(`/api/projects/${projectId}/export?format=${format}`, { responseType: 'blob' }) };
export const communityApi = { feed: (limit = 20, offset = 0) => api.get(`/api/community/feed?limit=${limit}&offset=${offset}`), createPost: (data: any) => api.post('/api/community/posts', data), react: (postId: number) => api.post(`/api/community/posts/${postId}/react`), getComments: (postId: number) => api.get(`/api/community/posts/${postId}/comments`) };
export const userApi = { getCharacters: (projectId: number) => api.get(`/api/user/projects/${projectId}/characters`), createCharacter: (projectId: number, data: any) => api.post(`/api/user/projects/${projectId}/characters`, data), getLore: (projectId: number) => api.get(`/api/user/projects/${projectId}/lore`), createLore: (projectId: number, data: any) => api.post(`/api/user/projects/${projectId}/lore`, data), getAiSettings: () => api.get('/api/user/me/ai-settings'), updateAiSettings: (data: any) => api.put('/api/user/me/ai-settings', data), recordLearning: (data: any) => api.post('/api/user/me/ai-settings/learning', data), getStyleProfile: () => api.get('/api/user/me/style-profile') };
export const storageApi = { quota: () => api.get('/api/storage/quota') };
export default api;
export { api };
EOF

cd ~/novel-master-frontend && npm run build && sudo cp -r dist/* /var/www/novel-master/ && sudo systemctl reload nginx
echo "=== 1. CORS check ===" && cat ~/novel-master/backend/.env | grep ALLOWED && echo "" && echo "=== 2. Test /api/projects ===" && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/projects | head -c 200 && echo "" && echo "=== 3. Test /api/user/me/ai-settings ===" && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings | head -c 200 && echo "" && echo "=== 4. Nginx errors ===" && sudo tail -5 /var/log/nginx/error.log
cd ~/novel-master/backend && docker compose exec web sqlite3 /app/continuity/novel_master.db "INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2);"
sudo rm -f /etc/nginx/sites-enabled/* && printf '%s\n' 'user www-data;' 'worker_processes auto;' 'events { worker_connections 768; }' 'http {' 'include /etc/nginx/mime.types;' 'default_type application/octet-stream;' 'server {' 'listen 80;' 'location / { root /var/www/novel-master/; try_files $uri $uri/ /index.html; }' 'location /api/ { proxy_pass http://localhost:5000/api/; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }' 'location /socket.io/ { proxy_pass http://localhost:5000/socket.io/; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection upgrade; }' '}' '}' > /etc/nginx/nginx.conf && sudo nginx -t && sudo systemctl restart nginx
docker ps --format "table {{.Names}}"
docker exec novel-master-web sqlite3 /app/continuity/novel_master.db "INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2);"
docker exec novel-master-web python3 -c "import sqlite3; conn = sqlite3.connect('/app/continuity/novel_master.db'); cursor = conn.cursor(); cursor.execute('INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2)'); conn.commit(); print(cursor.execute('SELECT * FROM ai_settings WHERE user_id = 2').fetchone()); conn.close()"
sudo bash -c 'cat > /etc/nginx/nginx.conf << EOF
user www-data;
worker_processes auto;
events { worker_connections 768; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server {
        listen 80;
        location / {
            root /var/www/novel-master/;
            try_files $uri $uri/ /index.html;
        }
        location /api/ {
            proxy_pass http://localhost:5000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        location /socket.io/ {
            proxy_pass http://localhost:5000/socket.io/;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection upgrade;
        }
    }
}
EOF'
sudo nginx -t && sudo systemctl restart nginx
curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings
sudo python3 -c '
import os, subprocess
nginx_conf = """user www-data;
worker_processes auto;
events {
    worker_connections 768;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server {
        listen 80;
        location / {
            root /var/www/novel-master/;
            try_files $uri $uri/ /index.html;
        }
        location /api/ {
            proxy_pass http://localhost:5000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        location /socket.io/ {
            proxy_pass http://localhost:5000/socket.io/;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection upgrade;
        }
    }
}
"""
with open("/etc/nginx/nginx.conf", "w") as f: f.write(nginx_conf)
print("Nginx config written")
subprocess.run(["docker", "exec", "novel-master-web", "python3", "-c", "import sqlite3; conn = sqlite3.connect('/app/continuity/novel_master.db'); cursor = conn.cursor(); cursor.execute('INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2)'); conn.commit(); print(cursor.execute('SELECT * FROM ai_settings WHERE user_id = 2').fetchone()); conn.close()"])
os.system("nginx -t && systemctl restart nginx")
'

ode      generateSW
precache  5 entries (561.41 KiB)
files generated
  dist/sw.js
  dist/workbox-c29d39ba.js
ubuntu@ip-172-31-27-237:~/novel-master-frontend$ echo "=== 1. CORS check ===" && cat ~/novel-master/backend/.env | grep ALLOWED && echo "" && echo "=== 2. Test
/api/projects ===" && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/projects | head -c 200 && echo "" && echo "=== 3. Test /api/user/me/ai-settings ===" && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings
| head -c 200 && echo "" && echo "=== 4. Nginx errors ===" && sudo tail -5 /var/log/nginx/error.log
=== 1. CORS check ===
ALLOWED_ORIGINS=http://54.162.148.159
=== 2. Test /api/projects ===
{"count":0,"projects":[]}
=== 3. Test /api/user/me/ai-settings ===
<!doctype html>
<html lang=en>
<title>500 Internal Server Error</title>
<h1>Internal Server Error</h1>
<p>The server encountered an internal error and was unable to complete your request. Either the s
=== 4. Nginx errors ===
2026/05/25 18:55:55 [error] 365301#365301: *41 open() "/var/www/novel-master/favicon.ico" failed (2: No such file or directory), client: 66.132.172.137, server: _, request: "GET /favicon.ico HTTP/1.1", host: "54.162.148.159"
2026/05/25 18:56:38 [warn] 365866#365866: 2048 worker_connections exceed open file resource limit: 1024
2026/05/25 18:56:38 [warn] 341939#341939: 2048 worker_connections exceed open file resource limit: 1024
2026/05/25 19:16:51 [notice] 369756#369756: using inherited sockets from "5;6;"
2026/05/25 19:16:51 [emerg] 369756#369756: invalid number of arguments in "proxy_set_header" directive in /etc/nginx/nginx.conf:33
ubuntu@ip-172-31-27-237:~/novel-master-frontend$ cd ~/novel-master/backend && docker compose exec web sqlite3 /app/continuity/novel_master.db "INSERT OR IGNORE
INTO ai_settings (user_id) VALUES (2);"
WARN[0000] /home/ubuntu/novel-master/backend/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion
service "web" is not running
ubuntu@ip-172-31-27-237:~/novel-master/backend$ sudo rm -f /etc/nginx/sites-enabled/* && printf '%s\n' 'user www-data;' 'worker_processes auto;' 'events { worker_connections 768; }' 'http {' 'include /etc/nginx/mime.types;' 'default_type application/octet-stream;' 'server {' 'listen 80;' 'location / { root /var/www/novel-master/; try_files $uri $uri/ /index.html; }' 'location /api/ { proxy_pass http://localhost:5000/api/; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; }' 'location /socket.io/ { proxy_pass http://localhost:5000/socket.io/; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection upgrade; }' '}' '}' > /etc/nginx/nginx.conf && sudo nginx -t && sudo systemctl restart nginx
-bash: /etc/nginx/nginx.conf: Permission denied
ubuntu@ip-172-31-27-237:~/novel-master/backend$ docker ps --format "table {{.Names}}"
NAMES
novel-master-web
novel-master-redis
ubuntu@ip-172-31-27-237:~/novel-master/backend$ docker exec novel-master-web sqlite3 /app/continuity/novel_master.db "INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2);"
OCI runtime exec failed: exec failed: unable to start container process: exec: "sqlite3": executable file not found in $PATH
ubuntu@ip-172-31-27-237:~/novel-master/backend$ docker exec novel-master-web python3 -c "import sqlite3; conn = sqlite3.connect('/app/continuity/novel_master.db'); cursor = conn.cursor(); cursor.execute('INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2)'); conn.commit(); print(cursor.execute('SELECT * FROM ai_settings WHERE user_id = 2').fetchone()); conn.close()"
(2, '[]', '2026-05-25 20:42:38')
ubuntu@ip-172-31-27-237:~/novel-master/backend$ sudo bash -c 'cat > /etc/nginx/nginx.conf << EOF
user www-data;
worker_processes auto;
events { worker_connections 768; }
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server {
        listen 80;
        location / {
            root /var/www/novel-master/;
            try_files $uri $uri/ /index.html;
        }
ubuntu@ip-172-31-27-237:~/novel-master/backend$ sudo python3 -c '
import os, subprocess
nginx_conf = """user www-data;
worker_processes auto;
events {
    worker_connections 768;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server {
        listen 80;
        location / {
            root /var/www/novel-master/;
            try_files $uri $uri/ /index.html;
        }
        location /api/ {
            proxy_pass http://localhost:5000/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        location /socket.io/ {
            proxy_pass http://localhost:5000/socket.io/;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection upgrade;
        }
    }
}
"""
with open("/etc/nginx/nginx.conf", "w") as f: f.write(nginx_conf)
print("Nginx config written")
subprocess.run(["docker", "exec", "novel-master-web", "python3", "-c", "import sqlite3; conn = sqlite3.connect('/app/continuity/novel_master.db'); cursor = conn.cursor(); cursor.execute('INSERT OR IGNORE INTO ai_settings (user_id) VALUES (2)'); conn.commit(); print(cursor.execute('SELECT * FROM ai_settings WHERE user_id = 2').fetchone()); conn.close()"])
os.system("nginx -t && systemctl restart nginx")
'
-bash: syntax error near unexpected token `('
-bash: syntax error near unexpected token `"nginx -t && systemctl restart nginx"'
>
echo 'user www-data; worker_processes auto; events { worker_connections 768; } http { include /etc/nginx/mime.types; default_type application/octet-stream; server { listen 80; location / { root /var/www/novel-master/; try_files $uri $uri/ /index.html; } location /api/ { proxy_pass http://localhost:5000/api/; proxy_set_header Host $host; proxy_set_header X-Real-IP $remote_addr; } location /socket.io/ { proxy_pass http://localhost:5000/socket.io/; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection upgrade; } } }' | sudo tee /etc/nginx/nginx.conf > /dev/null && sudo nginx -t && sudo systemctl restart nginx

cd src/services/
cd/home/ubuntu/novel-master-frontend/src/
ls
cd/home/ubuntu/novel-master-frontend/src/services
cd /home/ubuntu/novel-master-frontend/src/services
cat > ~/novel-master-frontend/src/services/api.ts << 'EOF'
import axios, { AxiosError, AxiosResponse } from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' }, timeout: 30000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('nm_token'); if (token && config.headers) { config.headers.Authorization = `Bearer ${token}`; } return config; }, (error) => Promise.reject(error));
api.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => { if (error.response?.status === 401) { localStorage.removeItem('nm_token'); window.location.href = '/auth'; } return Promise.reject(error); });
export default api;
export const authApi = { register: (data: any) => api.post('/api/auth/register', data), login: (data: any) => api.post('/api/auth/login', data), me: () => api.get('/api/auth/me') };
export const projectsApi = { list: () => api.get('/api/projects'), create: (data: any) => api.post('/api/projects', data), get: (id: number) => api.get(`/api/projects/${id}`), update: (id: number, data: any) => api.put(`/api/projects/${id}`, data), delete: (id: number) => api.delete(`/api/projects/${id}`), duplicate: (id: number) => api.post(`/api/projects/${id}/duplicate`) };
export const filesApi = { create: (projectId: number, data: any) => api.post(`/api/projects/${projectId}/files`, data), upload: (projectId: number, file: File, displayName?: string) => { const formData = new FormData(); formData.append('file', file); if (displayName) formData.append('display_name', displayName); return api.post(`/api/projects/${projectId}/files/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); }, getContent: (projectId: number, fileId: number) => api.get(`/api/projects/${projectId}/files/${fileId}/content`), updateContent: (projectId: number, fileId: number, content: string) => api.put(`/api/projects/${projectId}/files/${fileId}/content`, { content }), delete: (projectId: number, fileId: number) => api.delete(`/api/projects/${projectId}/files/${fileId}`) };
export const aiApi = { audit: (projectId: number) => api.post(`/api/projects/${projectId}/ai-audit`), exportProject: (projectId: number, format: 'txt' | 'md' | 'docx' = 'txt') => api.get(`/api/projects/${projectId}/export?format=${format}`, { responseType: 'blob' }) };
export const communityApi = { feed: (limit = 20, offset = 0) => api.get(`/api/community/feed?limit=${limit}&offset=${offset}`), createPost: (data: any) => api.post('/api/community/posts', data), react: (postId: number) => api.post(`/api/community/posts/${postId}/react`), getComments: (postId: number) => api.get(`/api/community/posts/${postId}/comments`) };
export const userApi = { getCharacters: (projectId: number) => api.get(`/api/user/projects/${projectId}/characters`), createCharacter: (projectId: number, data: any) => api.post(`/api/user/projects/${projectId}/characters`, data), getLore: (projectId: number) => api.get(`/api/user/projects/${projectId}/lore`), createLore: (projectId: number, data: any) => api.post(`/api/user/projects/${projectId}/lore`, data), getAiSettings: () => api.get('/api/user/me/ai-settings'), updateAiSettings: (data: any) => api.put('/api/user/me/ai-settings', data), recordLearning: (data: any) => api.post('/api/user/me/ai-settings/learning', data), getStyleProfile: () => api.get('/api/user/me/style-profile') };
export const storageApi = { quota: () => api.get('/api/storage/quota') };
EOF

head -5 ~/novel-master-frontend/src/services/api.ts
cd ~/novel-master-frontend && npm run build
# Upload dist to /var/www/novel-master/
sed -i 's/export default api;/export default api;\nexport { api };/' ~/novel-master-frontend/src/services/api.ts && cd ~/novel-master-frontend && npm run build
sudo cp -r ~/novel-master-frontend/dist/* /var/www/novel-master/ && sudo systemctl reload nginx
# On EC2, test the API directly
curl -X POST http://54.162.148.159/api/auth/register   -H "Content-Type: application/json"   -d '{"username":"testuser123","email":"test@test.com","password":"password123","display_name":"Test"}'
# Then login
curl -X POST http://54.162.148.159/api/auth/login   -H "Content-Type: application/json"   -d '{"username":"testuser123","password":"password123"}'
echo "=== auth/login references ===" && grep -o "auth/login" /var/www/novel-master/assets/*.js | wc -l && echo "" && echo "=== api.post calls ===" && grep -o "api.post" /var/www/novel-master/assets/*.js | wc -l && echo "" && echo "=== broken POST string ===" && grep -o "POST /api/auth/login" /var/www/novel-master/assets/*.js | wc -l
sudo cp -r ~/novel-master-frontend/dist/* /var/www/novel-master/ && sudo systemctl reload nginx
docker logs novel-master-web --tail 20
curl -s http://54.162.148.159/api/health
vite.config.txt
ls
cd novel-master-frontend 
ls
vite.config.txt
rm vite.config.txt
nano vite.config.txt
ls
nano package.json
ls
cd novel-master-frontend
ls
nano tsconfig.json
ls
cd src
ls
nano main.tsx
ls
cd services
ls
nano api.ts 
ls
nano websoket.ts
docker cp /mnt/agents/output/user_routes_fixed.py novel-master-web:/app/user_routes.py && docker restart novel-master-web && sleep 3 && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings
sudo python3 /dev/stdin << 'PYEOF'
import base64
import subprocess

data = base64.b64decode("IiIidXNlcl9yb3V0ZXMucHkg4oCUIE5vdmVsIE1hc3RlciBVc2VyICYgTG9yZWJvb2sgUm91dGVzIiIiCmZyb20gZmxhc2sgaW1wb3J0IEJsdWVwcmludCwgcmVxdWVzdCwganNvbmlmeSwgZwpmcm9tIGZ1bmN0b29scyBpbXBvcnQgd3JhcHMKaW1wb3J0IGpzb24KaW1wb3J0IHNxbGl0ZTMKaW1wb3J0IGxvZ2dpbmcKCmxvZ2dlciA9IGxvZ2dpbmcuZ2V0TG9nZ2VyKF9fbmFtZV9fKQp1c2VyX2JwID0gQmx1ZXByaW50KCd1c2VyJywgX19uYW1lX18pCgpmcm9tIGFwcCBpbXBvcnQgdG9rZW5fcmVxdWlyZWQKCkB1c2VyX2JwLnJvdXRlKCcvcHJvamVjdHMvPGludDpwcm9qZWN0X2lkPi9jaGFyYWN0ZXJzJywgbWV0aG9kcz1bJ0dFVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGdldF9jaGFyYWN0ZXJzKHByb2plY3RfaWQpOgogICAgZGIgPSBnLmRiCiAgICBwcm9qZWN0ID0gZGIuZXhlY3V0ZSgiU0VMRUNUIDEgRlJPTSBwcm9qZWN0cyBXSEVSRSBwcm9qZWN0X2lkID0gPyBBTkQgdXNlcl9pZCA9ID8iLCAocHJvamVjdF9pZCwgZy5jdXJyZW50X3VzZXJbJ3VzZXJfaWQnXSkpLmZldGNob25lKCkKICAgIGlmIG5vdCBwcm9qZWN0OgogICAgICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdQcm9qZWN0IG5vdCBmb3VuZCd9KSwgNDA0CiAgICBjaGFycyA9IGRiLmV4ZWN1dGUoIlNFTEVDVCAqIEZST00gY2hhcmFjdGVycyBXSEVSRSBwcm9qZWN0X2lkID0gPyBPUkRFUiBCWSBjcmVhdGVkX2F0IiwgKHByb2plY3RfaWQsKSkuZmV0Y2hhbGwoKQogICAgcmV0dXJuIGpzb25pZnkoeydjaGFyYWN0ZXJzJzogW2RpY3QoYykgZm9yIGMgaW4gY2hhcnNdfSkKCkB1c2VyX2JwLnJvdXRlKCcvcHJvamVjdHMvPGludDpwcm9qZWN0X2lkPi9jaGFyYWN0ZXJzJywgbWV0aG9kcz1bJ1BPU1QnXSkKQHRva2VuX3JlcXVpcmVkCmRlZiBjcmVhdGVfY2hhcmFjdGVyKHByb2plY3RfaWQpOgogICAgZGF0YSA9IHJlcXVlc3QuZ2V0X2pzb24oKQogICAgbmFtZSA9IGRhdGEuZ2V0KCduYW1lJywgJycpLnN0cmlwKCkKICAgIGlmIG5vdCBuYW1lOgogICAgICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdDaGFyYWN0ZXIgbmFtZSByZXF1aXJlZCd9KSwgNDAwCiAgICBkYiA9IGcuZGIKICAgIHByb2plY3QgPSBkYi5leGVjdXRlKCJTRUxFQ1QgMSBGUk9NIHByb2plY3RzIFdIRVJFIHByb2plY3RfaWQgPSA/IEFORCB1c2VyX2lkID0gPyIsIChwcm9qZWN0X2lkLCBnLmN1cnJlbnRfdXNlclsndXNlcl9pZCddKSkuZmV0Y2hvbmUoKQogICAgaWYgbm90IHByb2plY3Q6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ1Byb2plY3Qgbm90IGZvdW5kJ30pLCA0MDQKICAgIGN1cnNvciA9IGRiLmV4ZWN1dGUoIklOU0VSVCBJTlRPIGNoYXJhY3RlcnMgKHByb2plY3RfaWQsIG5hbWUsIHJvbGVfdHlwZSwgcmF3X2RhdGEsIHBoeXNpY2FsX3RyYWl0cywgcGVyc29uYWxpdHlfdHJhaXRzLCBiYWNrc3RvcnksIGdvYWxzLCByZWxhdGlvbnNoaXBzKSBWQUxVRVMgKD8sID8sID8sID8sID8sID8sID8sID8sID8pIiwgKHByb2plY3RfaWQsIG5hbWUsIGRhdGEuZ2V0KCdyb2xlX3R5cGUnLCAnc3VwcG9ydGluZycpLCBkYXRhLmdldCgncmF3X2RhdGEnLCAnJyksIGRhdGEuZ2V0KCdwaHlzaWNhbF90cmFpdHMnLCAnJyksIGRhdGEuZ2V0KCdwZXJzb25hbGl0eV90cmFpdHMnLCAnJyksIGRhdGEuZ2V0KCdiYWNrc3RvcnknLCAnJyksIGRhdGEuZ2V0KCdnb2FscycsICcnKSwganNvbi5kdW1wcyhkYXRhLmdldCgncmVsYXRpb25zaGlwcycsIFtdKSkpKQogICAgZGIuY29tbWl0KCkKICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdDaGFyYWN0ZXIgY3JlYXRlZCcsICdjaGFyYWN0ZXJfaWQnOiBjdXJzb3IubGFzdHJvd2lkfSksIDIwMQoKQHVzZXJfYnAucm91dGUoJy9wcm9qZWN0cy88aW50OnByb2plY3RfaWQ+L2xvcmUnLCBtZXRob2RzPVsnR0VUJ10pCkB0b2tlbl9yZXF1aXJlZApkZWYgZ2V0X2xvcmUocHJvamVjdF9pZCk6CiAgICBkYiA9IGcuZGIKICAgIHByb2plY3QgPSBkYi5leGVjdXRlKCJTRUxFQ1QgMSBGUk9NIHByb2plY3RzIFdIRVJFIHByb2plY3RfaWQgPSA/IEFORCB1c2VyX2lkID0gPyIsIChwcm9qZWN0X2lkLCBnLmN1cnJlbnRfdXNlclsndXNlcl9pZCddKSkuZmV0Y2hvbmUoKQogICAgaWYgbm90IHByb2plY3Q6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ1Byb2plY3Qgbm90IGZvdW5kJ30pLCA0MDQKICAgIGxvcmUgPSBkYi5leGVjdXRlKCJTRUxFQ1QgKiBGUk9NIHdvcmxkX2xvcmUgV0hFUkUgcHJvamVjdF9pZCA9ID8gT1JERVIgQlkgaW1wb3J0YW5jZSBERVNDLCBjcmVhdGVkX2F0IiwgKHByb2plY3RfaWQsKSkuZmV0Y2hhbGwoKQogICAgcmV0dXJuIGpzb25pZnkoeydsb3JlJzogW2RpY3QobCkgZm9yIGwgaW4gbG9yZV19KQoKQHVzZXJfYnAucm91dGUoJy9wcm9qZWN0cy88aW50OnByb2plY3RfaWQ+L2xvcmUnLCBtZXRob2RzPVsnUE9TVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGNyZWF0ZV9sb3JlKHByb2plY3RfaWQpOgogICAgZGF0YSA9IHJlcXVlc3QuZ2V0X2pzb24oKQogICAgdGl0bGUgPSBkYXRhLmdldCgndGl0bGUnLCAnJykuc3RyaXAoKQogICAgY2F0ZWdvcnkgPSBkYXRhLmdldCgnY2F0ZWdvcnknLCAnaGlzdG9yeScpCiAgICBpZiBub3QgdGl0bGU6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ0xvcmUgdGl0bGUgcmVxdWlyZWQnfSksIDQwMAogICAgaWYgY2F0ZWdvcnkgbm90IGluIFsnbWFnaWNfc3lzdGVtJywgJ2dlb2dyYXBoeScsICdoaXN0b3J5JywgJ2N1bHR1cmUnLCAndGVjaG5vbG9neScsICdydWxlcycsICd0aW1lbGluZSddOgogICAgICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdJbnZhbGlkIGNhdGVnb3J5J30pLCA0MDAKICAgIGRiID0gZy5kYgogICAgcHJvamVjdCA9IGRiLmV4ZWN1dGUoIlNFTEVDVCAxIEZST00gcHJvamVjdHMgV0hFUkUgcHJvamVjdF9pZCA9ID8gQU5EIHVzZXJfaWQgPSA/IiwgKHByb2plY3RfaWQsIGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10pKS5mZXRjaG9uZSgpCiAgICBpZiBub3QgcHJvamVjdDoKICAgICAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnUHJvamVjdCBub3QgZm91bmQnfSksIDQwNAogICAgY3Vyc29yID0gZGIuZXhlY3V0ZSgiSU5TRVJUIElOVE8gd29ybGRfbG9yZSAocHJvamVjdF9pZCwgY2F0ZWdvcnksIHRpdGxlLCBjb250ZW50LCBpbXBvcnRhbmNlKSBWQUxVRVMgKD8sID8sID8sID8sID8pIiwgKHByb2plY3RfaWQsIGNhdGVnb3J5LCB0aXRsZSwgZGF0YS5nZXQoJ2NvbnRlbnQnLCAnJyksIGRhdGEuZ2V0KCdpbXBvcnRhbmNlJywgMSkpKQogICAgZGIuY29tbWl0KCkKICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdMb3JlIGVudHJ5IGNyZWF0ZWQnLCAnbG9yZV9pZCc6IGN1cnNvci5sYXN0cm93aWR9KSwgMjAxCgpAdXNlcl9icC5yb3V0ZSgnL21lL2FpLXNldHRpbmdzJywgbWV0aG9kcz1bJ0dFVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGdldF9haV9zZXR0aW5ncygpOgogICAgZGIgPSBnLmRiCiAgICBzZXR0aW5ncyA9IGRiLmV4ZWN1dGUoIlNFTEVDVCAqIEZST00gYWlfc2V0dGluZ3MgV0hFUkUgdXNlcl9pZCA9ID8iLCAoZy5jdXJyZW50X3VzZXJbJ3VzZXJfaWQnXSwpKS5mZXRjaG9uZSgpCiAgICBpZiBub3Qgc2V0dGluZ3M6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydsZWFybmluZ19lbmFibGVkJzogVHJ1ZSwgJ2Jhbm5lZF93b3JkX292ZXJyaWRlcyc6IFtdLCAncHJvc2Vfc3R5bGVfcHJvZmlsZSc6ICcnLCAndXBkYXRlZF9hdCc6IE5vbmV9KQogICAgb3ZlcnJpZGVzID0gW10KICAgIGlmIHNldHRpbmdzWydiYW5uZWRfd29yZF9vdmVycmlkZXMnXToKICAgICAgICB0cnk6CiAgICAgICAgICAgIG92ZXJyaWRlcyA9IGpzb24ubG9hZHMoc2V0dGluZ3NbJ2Jhbm5lZF93b3JkX292ZXJyaWRlcyddKQogICAgICAgIGV4Y2VwdDoKICAgICAgICAgICAgcGFzcwogICAgcmV0dXJuIGpzb25pZnkoeydsZWFybmluZ19lbmFibGVkJzogYm9vbChzZXR0aW5nc1snbGVhcm5pbmdfZW5hYmxlZCddKSwgJ2Jhbm5lZF93b3JkX292ZXJyaWRlcyc6IG92ZXJyaWRlcywgJ3Byb3NlX3N0eWxlX3Byb2ZpbGUnOiBzZXR0aW5nc1sncHJvc2Vfc3R5bGVfcHJvZmlsZSddLCAndXBkYXRlZF9hdCc6IHNldHRpbmdzWyd1cGRhdGVkX2F0J119KQoKQHVzZXJfYnAucm91dGUoJy9tZS9haS1zZXR0aW5ncycsIG1ldGhvZHM9WydQVVQnXSkKQHRva2VuX3JlcXVpcmVkCmRlZiB1cGRhdGVfYWlfc2V0dGluZ3MoKToKICAgIGRhdGEgPSByZXF1ZXN0LmdldF9qc29uKCkKICAgIGRiID0gZy5kYgogICAgdXBkYXRlcyA9IFtdCiAgICBwYXJhbXMgPSBbXQogICAgaWYgJ2xlYXJuaW5nX2VuYWJsZWQnIGluIGRhdGE6CiAgICAgICAgdXBkYXRlcy5hcHBlbmQoJ2xlYXJuaW5nX2VuYWJsZWQgPSA/JykKICAgICAgICBwYXJhbXMuYXBwZW5kKDEgaWYgZGF0YVsnbGVhcm5pbmdfZW5hYmxlZCddIGVsc2UgMCkKICAgIGlmICdiYW5uZWRfd29yZF9vdmVycmlkZXMnIGluIGRhdGE6CiAgICAgICAgdXBkYXRlcy5hcHBlbmQoJ2Jhbm5lZF93b3JkX292ZXJyaWRlcyA9ID8nKQogICAgICAgIHBhcmFtcy5hcHBlbmQoanNvbi5kdW1wcyhkYXRhWydiYW5uZWRfd29yZF9vdmVycmlkZXMnXSkpCiAgICBpZiAncHJvc2Vfc3R5bGVfcHJvZmlsZScgaW4gZGF0YToKICAgICAgICB1cGRhdGVzLmFwcGVuZCgncHJvc2Vfc3R5bGVfcHJvZmlsZSA9ID8nKQogICAgICAgIHBhcmFtcy5hcHBlbmQoZGF0YVsncHJvc2Vfc3R5bGVfcHJvZmlsZSddKQogICAgaWYgbm90IHVwZGF0ZXM6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ05vIGZpZWxkcyB0byB1cGRhdGUnfSksIDQwMAogICAgdXBkYXRlcy5hcHBlbmQoJ3VwZGF0ZWRfYXQgPSBDVVJSRU5UX1RJTUVTVEFNUCcpCiAgICBwYXJhbXMuYXBwZW5kKGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10pCiAgICBkYi5leGVjdXRlKGYiVVBEQVRFIGFpX3NldHRpbmdzIFNFVCB7JywgJy5qb2luKHVwZGF0ZXMpfSBXSEVSRSB1c2VyX2lkID0gPyIsIHBhcmFtcykKICAgIGRiLmNvbW1pdCgpCiAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnQUkgc2V0dGluZ3MgdXBkYXRlZCd9KQoKQHVzZXJfYnAucm91dGUoJy9tZS9haS1zZXR0aW5ncy9sZWFybmluZycsIG1ldGhvZHM9WydQT1NUJ10pCkB0b2tlbl9yZXF1aXJlZApkZWYgcG9zdF9sZWFybmluZygpOgogICAgZGF0YSA9IHJlcXVlc3QuZ2V0X2pzb24oKQogICAgb3JpZ2luYWwgPSBkYXRhLmdldCgnb3JpZ2luYWxfYWlfdGV4dCcsICcnKQogICAgZWRpdGVkID0gZGF0YS5nZXQoJ3VzZXJfZWRpdGVkX3RleHQnLCAnJykKICAgIHByb2plY3RfaWQgPSBkYXRhLmdldCgncHJvamVjdF9pZCcpCiAgICBpZiBub3Qgb3JpZ2luYWwgb3Igbm90IGVkaXRlZDoKICAgICAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnQm90aCBvcmlnaW5hbF9haV90ZXh0IGFuZCB1c2VyX2VkaXRlZF90ZXh0IHJlcXVpcmVkJ30pLCA0MDAKICAgIGZyb20gbGVhcm5pbmdfc2VydmljZSBpbXBvcnQgcmVjb3JkX2xlYXJuaW5nCiAgICBwcmVmX2lkID0gcmVjb3JkX2xlYXJuaW5nKGcuZGIsIGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10sIG9yaWdpbmFsLCBlZGl0ZWQsIHByb2plY3RfaWQpCiAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnTGVhcm5pbmcgcmVjb3JkZWQnLCAncHJlZmVyZW5jZV9pZCc6IHByZWZfaWR9KQoKQHVzZXJfYnAucm91dGUoJy9tZS9zdHlsZS1wcm9maWxlJywgbWV0aG9kcz1bJ0dFVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGdldF9zdHlsZV9wcm9maWxlKCk6CiAgICBmcm9tIGxlYXJuaW5nX3NlcnZpY2UgaW1wb3J0IGdldF9zdHlsZV9wcm9maWxlCiAgICBwcmVmcyA9IGdldF9zdHlsZV9wcm9maWxlKGcuZGIsIGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10sIGxpbWl0PTUwKQogICAgcmV0dXJuIGpzb25pZnkoeyd1c2VyX2lkJzogZy5jdXJyZW50X3VzZXJbJ3VzZXJfaWQnXSwgJ3ByZWZlcmVuY2VzX2NvdW50JzogbGVuKHByZWZzKSwgJ3ByZWZlcmVuY2VzJzogcHJlZnN9KQo=")
with open("/tmp/user_routes.py", "wb") as f:
    f.write(data)

subprocess.run(["docker", "cp", "/tmp/user_routes.py", "novel-master-web:/app/user_routes.py"])
subprocess.run(["docker", "restart", "novel-master-web"])
print("Fixed user_routes.py installed and container restarted")

PYEOF

curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings
docker exec novel-master-web head -20 /app/user_routes.py && echo "=== SYNTAX CHECK ===" && docker exec novel-master-web python3 -m py_compile /app/user_routes.py 2>&1 && echo "=== LOGS ===" && docker logs novel-master-web --tail 10
docker stop novel-master-web && docker start novel-master-web && sleep 5 && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings
docker logs novel-master-web --tail 30 | grep -A 15 "GET /api/user/me/ai-settings"
sudo python3 /dev/stdin << 'PYEOF'
import base64, subprocess
data = base64.b64decode("IiIidXNlcl9yb3V0ZXMucHkg4oCUIE5vdmVsIE1hc3RlciBVc2VyICYgTG9yZWJvb2sgUm91dGVzIiIiCmZyb20gZmxhc2sgaW1wb3J0IEJsdWVwcmludCwgcmVxdWVzdCwganNvbmlmeSwgZwpmcm9tIGZ1bmN0b29scyBpbXBvcnQgd3JhcHMKaW1wb3J0IGpzb24KaW1wb3J0IHNxbGl0ZTMKaW1wb3J0IGxvZ2dpbmcKCmxvZ2dlciA9IGxvZ2dpbmcuZ2V0TG9nZ2VyKF9fbmFtZV9fKQp1c2VyX2JwID0gQmx1ZXByaW50KCd1c2VyJywgX19uYW1lX18pCgpmcm9tIGFwcCBpbXBvcnQgdG9rZW5fcmVxdWlyZWQKCkB1c2VyX2JwLnJvdXRlKCcvcHJvamVjdHMvPGludDpwcm9qZWN0X2lkPi9jaGFyYWN0ZXJzJywgbWV0aG9kcz1bJ0dFVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGdldF9jaGFyYWN0ZXJzKHByb2plY3RfaWQpOgogICAgZGIgPSBnLmRiCiAgICBwcm9qZWN0ID0gZGIuZXhlY3V0ZSgiU0VMRUNUIDEgRlJPTSBwcm9qZWN0cyBXSEVSRSBwcm9qZWN0X2lkID0gPyBBTkQgdXNlcl9pZCA9ID8iLCAocHJvamVjdF9pZCwgZy5jdXJyZW50X3VzZXJbJ3VzZXJfaWQnXSkpLmZldGNob25lKCkKICAgIGlmIG5vdCBwcm9qZWN0OgogICAgICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdQcm9qZWN0IG5vdCBmb3VuZCd9KSwgNDA0CiAgICBjaGFycyA9IGRiLmV4ZWN1dGUoIlNFTEVDVCAqIEZST00gY2hhcmFjdGVycyBXSEVSRSBwcm9qZWN0X2lkID0gPyBPUkRFUiBCWSBjcmVhdGVkX2F0IiwgKHByb2plY3RfaWQsKSkuZmV0Y2hhbGwoKQogICAgcmV0dXJuIGpzb25pZnkoeydjaGFyYWN0ZXJzJzogW2RpY3QoYykgZm9yIGMgaW4gY2hhcnNdfSkKCkB1c2VyX2JwLnJvdXRlKCcvcHJvamVjdHMvPGludDpwcm9qZWN0X2lkPi9jaGFyYWN0ZXJzJywgbWV0aG9kcz1bJ1BPU1QnXSkKQHRva2VuX3JlcXVpcmVkCmRlZiBjcmVhdGVfY2hhcmFjdGVyKHByb2plY3RfaWQpOgogICAgZGF0YSA9IHJlcXVlc3QuZ2V0X2pzb24oKQogICAgbmFtZSA9IGRhdGEuZ2V0KCduYW1lJywgJycpLnN0cmlwKCkKICAgIGlmIG5vdCBuYW1lOgogICAgICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdDaGFyYWN0ZXIgbmFtZSByZXF1aXJlZCd9KSwgNDAwCiAgICBkYiA9IGcuZGIKICAgIHByb2plY3QgPSBkYi5leGVjdXRlKCJTRUxFQ1QgMSBGUk9NIHByb2plY3RzIFdIRVJFIHByb2plY3RfaWQgPSA/IEFORCB1c2VyX2lkID0gPyIsIChwcm9qZWN0X2lkLCBnLmN1cnJlbnRfdXNlclsndXNlcl9pZCddKSkuZmV0Y2hvbmUoKQogICAgaWYgbm90IHByb2plY3Q6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ1Byb2plY3Qgbm90IGZvdW5kJ30pLCA0MDQKICAgIGN1cnNvciA9IGRiLmV4ZWN1dGUoIklOU0VSVCBJTlRPIGNoYXJhY3RlcnMgKHByb2plY3RfaWQsIG5hbWUsIHJvbGVfdHlwZSwgcmF3X2RhdGEsIHBoeXNpY2FsX3RyYWl0cywgcGVyc29uYWxpdHlfdHJhaXRzLCBiYWNrc3RvcnksIGdvYWxzLCByZWxhdGlvbnNoaXBzKSBWQUxVRVMgKD8sID8sID8sID8sID8sID8sID8sID8sID8pIiwgKHByb2plY3RfaWQsIG5hbWUsIGRhdGEuZ2V0KCdyb2xlX3R5cGUnLCAnc3VwcG9ydGluZycpLCBkYXRhLmdldCgncmF3X2RhdGEnLCAnJyksIGRhdGEuZ2V0KCdwaHlzaWNhbF90cmFpdHMnLCAnJyksIGRhdGEuZ2V0KCdwZXJzb25hbGl0eV90cmFpdHMnLCAnJyksIGRhdGEuZ2V0KCdiYWNrc3RvcnknLCAnJyksIGRhdGEuZ2V0KCdnb2FscycsICcnKSwganNvbi5kdW1wcyhkYXRhLmdldCgncmVsYXRpb25zaGlwcycsIFtdKSkpKQogICAgZGIuY29tbWl0KCkKICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdDaGFyYWN0ZXIgY3JlYXRlZCcsICdjaGFyYWN0ZXJfaWQnOiBjdXJzb3IubGFzdHJvd2lkfSksIDIwMQoKQHVzZXJfYnAucm91dGUoJy9wcm9qZWN0cy88aW50OnByb2plY3RfaWQ+L2xvcmUnLCBtZXRob2RzPVsnR0VUJ10pCkB0b2tlbl9yZXF1aXJlZApkZWYgZ2V0X2xvcmUocHJvamVjdF9pZCk6CiAgICBkYiA9IGcuZGIKICAgIHByb2plY3QgPSBkYi5leGVjdXRlKCJTRUxFQ1QgMSBGUk9NIHByb2plY3RzIFdIRVJFIHByb2plY3RfaWQgPSA/IEFORCB1c2VyX2lkID0gPyIsIChwcm9qZWN0X2lkLCBnLmN1cnJlbnRfdXNlclsndXNlcl9pZCddKSkuZmV0Y2hvbmUoKQogICAgaWYgbm90IHByb2plY3Q6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ1Byb2plY3Qgbm90IGZvdW5kJ30pLCA0MDQKICAgIGxvcmUgPSBkYi5leGVjdXRlKCJTRUxFQ1QgKiBGUk9NIHdvcmxkX2xvcmUgV0hFUkUgcHJvamVjdF9pZCA9ID8gT1JERVIgQlkgaW1wb3J0YW5jZSBERVNDLCBjcmVhdGVkX2F0IiwgKHByb2plY3RfaWQsKSkuZmV0Y2hhbGwoKQogICAgcmV0dXJuIGpzb25pZnkoeydsb3JlJzogW2RpY3QobCkgZm9yIGwgaW4gbG9yZV19KQoKQHVzZXJfYnAucm91dGUoJy9wcm9qZWN0cy88aW50OnByb2plY3RfaWQ+L2xvcmUnLCBtZXRob2RzPVsnUE9TVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGNyZWF0ZV9sb3JlKHByb2plY3RfaWQpOgogICAgZGF0YSA9IHJlcXVlc3QuZ2V0X2pzb24oKQogICAgdGl0bGUgPSBkYXRhLmdldCgndGl0bGUnLCAnJykuc3RyaXAoKQogICAgY2F0ZWdvcnkgPSBkYXRhLmdldCgnY2F0ZWdvcnknLCAnaGlzdG9yeScpCiAgICBpZiBub3QgdGl0bGU6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ0xvcmUgdGl0bGUgcmVxdWlyZWQnfSksIDQwMAogICAgaWYgY2F0ZWdvcnkgbm90IGluIFsnbWFnaWNfc3lzdGVtJywgJ2dlb2dyYXBoeScsICdoaXN0b3J5JywgJ2N1bHR1cmUnLCAndGVjaG5vbG9neScsICdydWxlcycsICd0aW1lbGluZSddOgogICAgICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdJbnZhbGlkIGNhdGVnb3J5J30pLCA0MDAKICAgIGRiID0gZy5kYgogICAgcHJvamVjdCA9IGRiLmV4ZWN1dGUoIlNFTEVDVCAxIEZST00gcHJvamVjdHMgV0hFUkUgcHJvamVjdF9pZCA9ID8gQU5EIHVzZXJfaWQgPSA/IiwgKHByb2plY3RfaWQsIGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10pKS5mZXRjaG9uZSgpCiAgICBpZiBub3QgcHJvamVjdDoKICAgICAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnUHJvamVjdCBub3QgZm91bmQnfSksIDQwNAogICAgY3Vyc29yID0gZGIuZXhlY3V0ZSgiSU5TRVJUIElOVE8gd29ybGRfbG9yZSAocHJvamVjdF9pZCwgY2F0ZWdvcnksIHRpdGxlLCBjb250ZW50LCBpbXBvcnRhbmNlKSBWQUxVRVMgKD8sID8sID8sID8sID8pIiwgKHByb2plY3RfaWQsIGNhdGVnb3J5LCB0aXRsZSwgZGF0YS5nZXQoJ2NvbnRlbnQnLCAnJyksIGRhdGEuZ2V0KCdpbXBvcnRhbmNlJywgMSkpKQogICAgZGIuY29tbWl0KCkKICAgIHJldHVybiBqc29uaWZ5KHsnbWVzc2FnZSc6ICdMb3JlIGVudHJ5IGNyZWF0ZWQnLCAnbG9yZV9pZCc6IGN1cnNvci5sYXN0cm93aWR9KSwgMjAxCgpAdXNlcl9icC5yb3V0ZSgnL21lL2FpLXNldHRpbmdzJywgbWV0aG9kcz1bJ0dFVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGdldF9haV9zZXR0aW5ncygpOgogICAgZGIgPSBnLmRiCiAgICByb3cgPSBkYi5leGVjdXRlKCJTRUxFQ1QgKiBGUk9NIGFpX3NldHRpbmdzIFdIRVJFIHVzZXJfaWQgPSA/IiwgKGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10sKSkuZmV0Y2hvbmUoKQoKICAgICMgQ1JJVElDQUwgRklYOiBDb252ZXJ0IHRvIGRpY3Qgc2FmZWx5LCBoYW5kbGUgbWlzc2luZyByb3cgb3IgY29sdW1ucwogICAgaWYgcm93OgogICAgICAgIHNldHRpbmdzID0gZGljdChyb3cpCiAgICBlbHNlOgogICAgICAgIHNldHRpbmdzID0ge30KCiAgICBvdmVycmlkZXMgPSBbXQogICAgcmF3X292ZXJyaWRlcyA9IHNldHRpbmdzLmdldCgnYmFubmVkX3dvcmRfb3ZlcnJpZGVzJywgJ1tdJykKICAgIGlmIHJhd19vdmVycmlkZXM6CiAgICAgICAgdHJ5OgogICAgICAgICAgICBvdmVycmlkZXMgPSBqc29uLmxvYWRzKHJhd19vdmVycmlkZXMpCiAgICAgICAgZXhjZXB0OgogICAgICAgICAgICBwYXNzCgogICAgcmV0dXJuIGpzb25pZnkoewogICAgICAgICdsZWFybmluZ19lbmFibGVkJzogYm9vbChzZXR0aW5ncy5nZXQoJ2xlYXJuaW5nX2VuYWJsZWQnLCBUcnVlKSksCiAgICAgICAgJ2Jhbm5lZF93b3JkX292ZXJyaWRlcyc6IG92ZXJyaWRlcywKICAgICAgICAncHJvc2Vfc3R5bGVfcHJvZmlsZSc6IHNldHRpbmdzLmdldCgncHJvc2Vfc3R5bGVfcHJvZmlsZScsICcnKSwKICAgICAgICAndXBkYXRlZF9hdCc6IHNldHRpbmdzLmdldCgndXBkYXRlZF9hdCcpCiAgICB9KQoKQHVzZXJfYnAucm91dGUoJy9tZS9haS1zZXR0aW5ncycsIG1ldGhvZHM9WydQVVQnXSkKQHRva2VuX3JlcXVpcmVkCmRlZiB1cGRhdGVfYWlfc2V0dGluZ3MoKToKICAgIGRhdGEgPSByZXF1ZXN0LmdldF9qc29uKCkKICAgIGRiID0gZy5kYgogICAgdXBkYXRlcyA9IFtdCiAgICBwYXJhbXMgPSBbXQogICAgaWYgJ2xlYXJuaW5nX2VuYWJsZWQnIGluIGRhdGE6CiAgICAgICAgdXBkYXRlcy5hcHBlbmQoJ2xlYXJuaW5nX2VuYWJsZWQgPSA/JykKICAgICAgICBwYXJhbXMuYXBwZW5kKDEgaWYgZGF0YVsnbGVhcm5pbmdfZW5hYmxlZCddIGVsc2UgMCkKICAgIGlmICdiYW5uZWRfd29yZF9vdmVycmlkZXMnIGluIGRhdGE6CiAgICAgICAgdXBkYXRlcy5hcHBlbmQoJ2Jhbm5lZF93b3JkX292ZXJyaWRlcyA9ID8nKQogICAgICAgIHBhcmFtcy5hcHBlbmQoanNvbi5kdW1wcyhkYXRhWydiYW5uZWRfd29yZF9vdmVycmlkZXMnXSkpCiAgICBpZiAncHJvc2Vfc3R5bGVfcHJvZmlsZScgaW4gZGF0YToKICAgICAgICB1cGRhdGVzLmFwcGVuZCgncHJvc2Vfc3R5bGVfcHJvZmlsZSA9ID8nKQogICAgICAgIHBhcmFtcy5hcHBlbmQoZGF0YVsncHJvc2Vfc3R5bGVfcHJvZmlsZSddKQogICAgaWYgbm90IHVwZGF0ZXM6CiAgICAgICAgcmV0dXJuIGpzb25pZnkoeydtZXNzYWdlJzogJ05vIGZpZWxkcyB0byB1cGRhdGUnfSksIDQwMAogICAgdXBkYXRlcy5hcHBlbmQoJ3VwZGF0ZWRfYXQgPSBDVVJSRU5UX1RJTUVTVEFNUCcpCiAgICBwYXJhbXMuYXBwZW5kKGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10pCiAgICBkYi5leGVjdXRlKGYiVVBEQVRFIGFpX3NldHRpbmdzIFNFVCB7JywgJy5qb2luKHVwZGF0ZXMpfSBXSEVSRSB1c2VyX2lkID0gPyIsIHBhcmFtcykKICAgIGRiLmNvbW1pdCgpCiAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnQUkgc2V0dGluZ3MgdXBkYXRlZCd9KQoKQHVzZXJfYnAucm91dGUoJy9tZS9haS1zZXR0aW5ncy9sZWFybmluZycsIG1ldGhvZHM9WydQT1NUJ10pCkB0b2tlbl9yZXF1aXJlZApkZWYgcG9zdF9sZWFybmluZygpOgogICAgZGF0YSA9IHJlcXVlc3QuZ2V0X2pzb24oKQogICAgb3JpZ2luYWwgPSBkYXRhLmdldCgnb3JpZ2luYWxfYWlfdGV4dCcsICcnKQogICAgZWRpdGVkID0gZGF0YS5nZXQoJ3VzZXJfZWRpdGVkX3RleHQnLCAnJykKICAgIHByb2plY3RfaWQgPSBkYXRhLmdldCgncHJvamVjdF9pZCcpCiAgICBpZiBub3Qgb3JpZ2luYWwgb3Igbm90IGVkaXRlZDoKICAgICAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnQm90aCBvcmlnaW5hbF9haV90ZXh0IGFuZCB1c2VyX2VkaXRlZF90ZXh0IHJlcXVpcmVkJ30pLCA0MDAKICAgIGZyb20gbGVhcm5pbmdfc2VydmljZSBpbXBvcnQgcmVjb3JkX2xlYXJuaW5nCiAgICBwcmVmX2lkID0gcmVjb3JkX2xlYXJuaW5nKGcuZGIsIGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10sIG9yaWdpbmFsLCBlZGl0ZWQsIHByb2plY3RfaWQpCiAgICByZXR1cm4ganNvbmlmeSh7J21lc3NhZ2UnOiAnTGVhcm5pbmcgcmVjb3JkZWQnLCAncHJlZmVyZW5jZV9pZCc6IHByZWZfaWR9KQoKQHVzZXJfYnAucm91dGUoJy9tZS9zdHlsZS1wcm9maWxlJywgbWV0aG9kcz1bJ0dFVCddKQpAdG9rZW5fcmVxdWlyZWQKZGVmIGdldF9zdHlsZV9wcm9maWxlKCk6CiAgICBmcm9tIGxlYXJuaW5nX3NlcnZpY2UgaW1wb3J0IGdldF9zdHlsZV9wcm9maWxlCiAgICBwcmVmcyA9IGdldF9zdHlsZV9wcm9maWxlKGcuZGIsIGcuY3VycmVudF91c2VyWyd1c2VyX2lkJ10sIGxpbWl0PTUwKQogICAgcmV0dXJuIGpzb25pZnkoeyd1c2VyX2lkJzogZy5jdXJyZW50X3VzZXJbJ3VzZXJfaWQnXSwgJ3ByZWZlcmVuY2VzX2NvdW50JzogbGVuKHByZWZzKSwgJ3ByZWZlcmVuY2VzJzogcHJlZnN9KQo=")
with open("/tmp/user_routes.py", "wb") as f:
    f.write(data)
subprocess.run(["docker", "cp", "/tmp/user_routes.py", "novel-master-web:/app/user_routes.py"])
subprocess.run(["docker", "restart", "novel-master-web"])
print("Done")
PYEOF

sleep 5 && curl -s -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6InRlc3R1c2VyMTIzIiwidGllciI6ImZyZWUiLCJyb2xlIjoiYmFzaWMiLCJleHAiOjE3ODAzNDM4ODl9.q7s2r5Zc4xGAY2u2FMEq8OLxH7WIh_pj8rbjwDX6p_0" http://54.162.148.159/api/user/me/ai-settings
cd novel-master-frontend 
ls
nano nginx.conf
nano
ls
nano
ls
rm -rf node_modules
rm package-lock.json
npm install
npm run build
sudo apt update
sudo apt install nginx -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pm2
sudo su sudo apt update
sudo apt install nginx -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g pm2
ls
rm index.html
ls
nano
s
ls
rm -rf node_modules
rm package-lock.json
npm install
npm run build
find . -name "main.tsx"
ls
nano index.html
npm run build
find src -maxdepth 3 -type f
cd novel_master_frontend
ls
cd novel-master-frontend 
ls
find src -maxdepth 3 -type f
cat src/components/layout/AppLayout.tsx
cat src/App.tsx
cat src/components/layout/Sidebar.tsx
grep -rn "LeftSidebar\|RightSidebar\|AISidebar" src/
grep -rn "websoket" src/
cat src/store/useStore.ts
cat src/components/layout/TopBar.tsx
cat src/hooks/useAuth.ts
cat src/index.css
ls
cd src
list
ls
nano index.css
~/novel-master-frontend
mkdir -p src/components/layout
mkdir -p src/components/editor
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/services
mv App.tsx src/App.tsx
mv main.tsx src/main.tsx
mv AppLayout.tsx src/components/layout/AppLayout.tsx
mv Sidebar.tsx src/components/layout/Sidebar.tsx
mv MobileNav.tsx src/components/layout/MobileNav.tsx
mv TopBar.tsx src/components/layout/TopBar.tsx
mv components_editor_AISidebar.tsx src/components/editor/AISidebar.tsx
mv components_editor_FullScreenEditor.tsx src/components/editor/FullScreenEditor.tsx
mv HomePage.tsx src/pages/HomePage.tsx
mv AuthPage.tsx src/pages/AuthPage.tsx
mv LibraryPage.tsx src/pages/LibraryPage.tsx
mv ProfilePage.tsx src/pages/ProfilePage.tsx
mv SettingsPage.tsx src/pages/SettingsPage.tsx
mv useAuth.ts src/hooks/useAuth.ts
mv store_useStore.ts src/store/useStore.ts
mv services_api.ts src/services/api.ts
mv services_websocket.ts src/services/websocket.ts
cd novel_master_frontend_production 
ls
cd novel-master-frontend 
ls
nano 
ls
~/novel-master-frontend
mkdir -p src/components/layout
mkdir -p src/components/editor
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/services
mv App.tsx src/App.tsx
mv main.tsx src/main.tsx
mv AppLayout.tsx src/components/layout/AppLayout.tsx
mv Sidebar.tsx src/components/layout/Sidebar.tsx
mv MobileNav.tsx src/components/layout/MobileNav.tsx
mv TopBar.tsx src/components/layout/TopBar.tsx
mv components_editor_AISidebar.tsx src/components/editor/AISidebar.tsx
mv components_editor_FullScreenEditor.tsx src/components/editor/FullScreenEditor.tsx
mv HomePage.tsx src/pages/HomePage.tsx
mv AuthPage.tsx src/pages/AuthPage.tsx
mv LibraryPage.tsx src/pages/LibraryPage.tsx
mv ProfilePage.tsx src/pages/ProfilePage.tsx
mv SettingsPage.tsx src/pages/SettingsPage.tsx
mv useAuth.ts src/hooks/useAuth.ts
mv store_useStore.ts src/store/useStore.ts
mv services_api.ts src/services/api.ts
mv services_websocket.ts src/services/websocket.ts
ls
rm vite.config.txt
find src -maxdepth 3 -type f
ls
cd novel-master-frontend 
ls
cd src
ls
nano app.tsx
ls
nano app.tsk
ls
nano App.tsx
cat src/components/editor/FullScreenEditor.tsx
cat src/components/editor/AISidebar.tsx
cat src/components/layout/MobileNav.tsx
cat ~/novel-master-frontend/src/components/editor/FullScreenEditor.tsx
cat ~/novel-master-frontend/src/components/editor/AISidebar.tsx
cat ~/novel-master-frontend/src/components/layout/MobileNav.tsx
cd ~/novel-master-frontend && sed -i '/@media (max-width: 1024px)/,/^}/d' src/index.css
df -h
du -sh /* 2>/dev/null | sort -rh | head -20
du -sh /home/ubuntu/* 2>/dev/null | sort -rh | head -20
ip-172-31-27-237:~/novel-master-frontend$ df -h
Filesystem       Size  Used Avail Use% Mounted on
/dev/root        6.7G  6.6G     0 100% /
tmpfs            953M     0  953M   0% /dev/shm
tmpfs            382M   35M  347M  10% /run
efivarfs         128K  3.1K  120K   3% /sys/firmware/efi/efivars
tmpfs            953M  9.0M  944M   1% /tmp
none             1.0M     0  1.0M   0% /run/credentials/systemd-journald.servicenone             1.0M     0  1.0M   0% /run/credentials/systemd-resolved.service/dev/nvme0n1p13  989M   95M  828M  11% /boot
/dev/nvme0n1p15  105M  6.3M   99M   7% /boot/efi
none             1.0M     0  1.0M   0% /run/credentials/systemd-networkd.servicenone             1.0M     0  1.0M   0% /run/credentials/serial-getty@ttyS0.service
none             1.0M     0  1.0M   0% /run/credentials/getty@tty1.service
tmpfs            191M  8.0K  191M   1% /run/user/1000
ubuntu@ip-172-31-27-237:~/novel-master-frontend$ du -sh /* 2>/dev/null | sort -rh | head -20
3.1G    /usr
1.5G    /home
1.4G    /snap
917M    /var
94M     /boot
35M     /run
9.0M    /tmp
7.6M    /etc
16K     /lost+found
8.0K    /opt
4.0K    /srv
4.0K    /root
4.0K    /mnt
4.0K    /media
0       /sys
0       /sbin
0       /proc
0       /lib64
0       /lib
0       /dev
ubuntu@ip-172-31-27-237:~/novel-master-frontend$ du -sh /home/ubuntu/* 2>/dev/null | sort -rh | head -20
844M    /home/ubuntu/venv
224M    /home/ubuntu/novel-master-frontend
5.1M    /home/ubuntu/node_modules
188K    /home/ubuntu/novel-master
180K    /home/ubuntu/novel-master-frontend.zip
80K     /home/ubuntu/snap
32K     /home/ubuntu/src
32K     /home/ubuntu/novel-master-backend.zip
12K     /home/ubuntu/novelmasterpro
8.0K    /home/ubuntu/deploy.sh
4.0K    /home/ubuntu/package.json
ubuntu@ip-172-31-27-237:~/novel-master-frontend$
ls
rm -rf ~/venv
rm ~/novel-master-frontend.zip ~/novel-master-backend.zip
rm -rf ~/node_modules
rm -rf ~/src
sudo find /var/log/nginx -name "*.log" -exec truncate -s 0 {} \;
sudo snap list --all | awk '/disabled/{print $1, $3}' | while read snapname revision; do sudo snap remove "$snapname" --revision="$revision"; done
du -sh ~/novel-master-frontend/dist ~/novel-master-frontend/node_modules
df -h
rm -rf ~/node_modules
df -h
rm -rf ~/node_modules
rm -rf ~/src
rm -f ~/novel-master-frontend/frontend.zip
ls
df -h
sed -i '/@media (max-width: 1024px)/,/^}/d' ~/novel-master-frontend/src/index.css
grep -A4 "@media (max-width: 1024px)" ~/novel-master-frontend/src/index.css
cat > /tmp/fix_editor.py << 'PYEOF'
import re

with open('/home/ubuntu/novel-master-frontend/src/components/editor/FullScreenEditor.tsx', 'r') as f:
    content = f.read()

# Fix useQuery 1 - project files (v4 -> v5)
content = content.replace(
    """const { data: files, isLoading: filesLoading } = useQuery(
    ['project-files', pid],
    () => api.getProjectFiles(pid),
    { enabled: !!pid }
  );""",
    """const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: ['project-files', pid],
    queryFn: () => api.getProjectFiles(pid),
    enabled: !!pid,
  });"""
)

# Fix useQuery 2 - file content
content = content.replace(
    """const { data: fileData, isLoading: contentLoading } = useQuery(
    ['file-content', pid, currentFileId],
    () => api.getFileContent(pid, currentFileId!),
    { enabled: !!pid && !!currentFileId }
  );""",
    """const { data: fileData, isLoading: contentLoading } = useQuery({
    queryKey: ['file-content', pid, currentFileId],
    queryFn: () => api.getFileContent(pid, currentFileId!),
    enabled: !!pid && !!currentFileId,
  });"""
)

# Fix useMutation (v4 -> v5)
content = content.replace(
    """const saveMutation = useMutation(
    (data: { content: string; changeSummary?: string }) =>
      api.updateFileContent(pid, currentFileId!, data.content, data.changeSummary),
    {
      onSuccess: () => {
        toast.success('Saved');
        queryClient.invalidateQueries(['file-content', pid, currentFileId]);
      },
      onError: () => toast.error('Failed to save')
    }
  );""",
    """const saveMutation = useMutation({
    mutationFn: (data: { content: string; changeSummary?: string }) =>
      api.updateFileContent(pid, currentFileId!, data.content, data.changeSummary),
    onSuccess: () => {
      toast.success('Saved');
      queryClient.invalidateQueries({ queryKey: ['file-content', pid, currentFileId] });
    },
    onError: () => toast.error('Failed to save')
  });"""
)

# Fix isLoading -> isPending for mutation
content = content.replace(
    "isLoading={saveMutation.isLoading}",
    "isPending={saveMutation.isPending}"
)

# Fix LorebookQuickList useQuery
content = content.replace(
    """const { data: characters, isLoading } = useQuery(
    ['characters-quick', projectId],
    () => api.getCharacters(projectId),
    { enabled: !!projectId }
  );""",
    """const { data: characters, isLoading } = useQuery({
    queryKey: ['characters-quick', projectId],
    queryFn: () => api.getCharacters(projectId),
    enabled: !!projectId,
  });"""
)

with open('/home/ubuntu/novel-master-frontend/src/components/editor/FullScreenEditor.tsx', 'w') as f:
    f.write(content)

print('Fixed FullScreenEditor.tsx')
PYEOF

python3 /tmp/fix_editor.py
sed -i 's|path="/editor/new" element={<PrivateRoute><FullScreenEditor /></PrivateRoute>}|path="/editor/new" element={<PrivateRoute><Navigate to="/editor/0" replace /></PrivateRoute>}|' ~/novel-master-frontend/src/App.tsx
sed -i "s|path: '/editor'|path: '/editor/new'|" ~/novel-master-frontend/src/components/layout/MobileNav.tsx
echo "=== CSS check ===" && grep -c "@media (max-width: 1024px)" ~/novel-master-frontend/src/index.css || echo "CSS fixed (0 matches)"
echo "=== useQuery braces ===" && grep -c "useQuery(" ~/novel-master-frontend/src/components/editor/FullScreenEditor.tsx
echo "=== useMutation brace ===" && grep -c "useMutation({" ~/novel-master-frontend/src/components/editor/FullScreenEditor.tsx
echo "=== isPending ===" && grep -c "isPending" ~/novel-master-frontend/src/components/editor/FullScreenEditor.tsx
echo "=== App.tsx /editor/new ===" && grep "/editor/new" ~/novel-master-frontend/src/App.tsx
echo "=== MobileNav /editor/new ===" && grep "/editor/new" ~/novel-master-frontend/src/components/layout/MobileNav.tsx
grep -n -A4 "useQuery(" ~/novel-master-frontend/src/components/editor/FullScreenEditor.tsx
grep -n "isPending\|invalidateQueries({ queryKey" ~/novel-master-frontend/src/components/editor/FullScreenEditor.tsx
cd ~/novel-master-frontend && npm run build
sed -i 's/<<Route/<Route/g' ~/novel-master-frontend/src/App.tsx
grep -n "<Route" ~/novel-master-frontend/src/App.tsx | head -15
cd ~/novel-master-frontend && npm run build
cat > /tmp/fix_layout.py << 'PYEOF'
with open('/home/ubuntu/novel-master-frontend/src/components/layout/AppLayout.tsx', 'r') as f:
    content = f.read()

# Replace the desktop-only sidebar block with a responsive version
old = '''      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isAuthenticated && sidebarOpen && !isEditorPage && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="hidden lg:block w-[280px] flex-shrink-0"
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>'''

new = '''      {/* Sidebar — Desktop (spacer) + Mobile (overlay) */}
      <AnimatePresence>
        {isAuthenticated && sidebarOpen && !isEditorPage && (
          <>
            {/* Desktop: takes up layout space */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:block w-[280px] flex-shrink-0"
            >
              <Sidebar />
            </motion.div>
            {/* Mobile: fixed overlay with backdrop */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px]"
            >
              <Sidebar />
            </motion.div>
            {/* Mobile backdrop to close sidebar when tapping outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
          </>
        )}
      </AnimatePresence>'''

content = content.replace(old, new)

with open('/home/ubuntu/novel-master-frontend/src/components/layout/AppLayout.tsx', 'w') as f:
    f.write(content)

print('AppLayout.tsx fixed')
PYEOF

python3 /tmp/fix_layout.py
grep -c "lg:hidden fixed inset-y-0" ~/novel-master-frontend/src/components/layout/AppLayout.tsx
cat ~/novel-master-frontend/src/pages/AuthPage.tsx
# On your EC2 backend (if it's running)
curl -s http://localhost:5000/api/auth/google 2>/dev/null | head -20
python3 /tmp/fix_layout.py
grep -c "lg:hidden fixed inset-y-0" ~/novel-master-frontend/src/components/layout/AppLayout.tsx
cd ~/novel-master-frontend && npm run build
cat ~/novel-master-frontend/requirements.txt
ls ~/novel-master/
cat ~/novel-master/requirements.txt 2>/dev/null || echo "No requirements.txt in novel-master"
find ~/novel-master/backend -type f -name "*.py" | head -30
cat ~/novel-master/backend/app.py 2>/dev/null || cat ~/novel-master/backend/main.py 2>/dev/null || find ~/novel-master/backend -name "*.py" -exec grep -l "app = Flask\|create_app" {} \;
grep -rn "def login\|def register\|jwt\|auth" ~/novel-master/backend/ --include="*.py" | head -30
sed -n '420,490p' ~/novel-master/backend/app.py
sed -n '1,30p' ~/novel-master/backend/app.py
ubuntu@ip-172-31-27-237:~$ sed -n '1,30p' ~/novel-master/backend/app.py
import os
import re
import uuid
import hashlib
import sqlite3
import logging
import shutil
import signal
import sys
from datetime import datetime, timezone, timedelta
from functools import wraps
from flask import Flask, request, jsonify, send_file, g, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
# Phase 2+ imports
from ai_engine import analyze_prose, analyze_with_style_profile
from websocket_handlers import init_websockets, socketio
from export_service import compile_project_export
from access_control import check_permission
import storage_service
app = Flask(__name__)
# ============================================================================
# CRITICAL FIX: SECRET_KEY validation — fail hard in production
# ============================================================================
ubuntu@ip-172-31-27-237:~$
