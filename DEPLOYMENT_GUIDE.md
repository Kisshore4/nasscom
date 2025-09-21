# NASCOM Document Redaction System - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the NASCOM Document Redaction System in various environments, from development to production.

## Deployment Options

1. **Local Development**: Single machine setup for testing
2. **Production Server**: Enterprise deployment on dedicated server
3. **Docker Deployment**: Containerized deployment
4. **Cloud Deployment**: AWS, Azure, or GCP deployment

## Prerequisites

### System Requirements

**Minimum Hardware:**
- CPU: 2 cores, 2.0 GHz
- RAM: 4GB
- Storage: 10GB free space
- Network: 100 Mbps

**Recommended Hardware:**
- CPU: 4+ cores, 3.0+ GHz
- RAM: 8GB+
- Storage: 50GB+ SSD
- Network: 1 Gbps

**Operating System:**
- Windows 10/11 or Windows Server 2019+
- Ubuntu 18.04+ or CentOS 7+
- macOS 10.15+

### Software Dependencies

**Required:**
- Python 3.11+ 
- Node.js 18+
- npm 8+
- Git
- Tesseract OCR

**Optional:**
- Docker 20.10+
- Nginx (for production)
- PM2 (for process management)

## Local Development Deployment

### Step 1: Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd "nascom document redaction"

# Verify Python version
python --version  # Should be 3.11+

# Verify Node.js version  
node --version    # Should be 18+
npm --version     # Should be 8+
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\Activate

# Activate virtual environment (Linux/Mac)
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies
pip install fastapi uvicorn python-multipart pillow pytesseract spacy pdfplumber PyPDF2 reportlab websockets

# Download spaCy model
python -m spacy download en_core_web_sm

# Create data directories
mkdir data
mkdir redacted_files
```

### Step 3: Tesseract OCR Installation

**Windows:**
1. Download installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to: `C:\Program Files\Tesseract-OCR\`
3. Add to system PATH or update `main.py`:

```python
# In backend/main.py
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install tesseract-ocr
sudo apt install tesseract-ocr-eng  # English language pack
```

**macOS:**
```bash
brew install tesseract
```

### Step 4: Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Verify installation
npm run build  # Should complete without errors
```

### Step 5: Configuration

**Backend Configuration:**
Create `backend/.env` file:
```bash
# Optional environment variables
TESSERACT_PATH=/usr/bin/tesseract  # Linux/Mac
# TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe  # Windows
DATA_DIR=./data
CORS_ORIGINS=http://localhost:8080
```

**Frontend Configuration:**
Update `vite.config.ts` if needed:
```typescript
export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

### Step 6: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\Activate  # Windows
# source venv/bin/activate  # Linux/Mac
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Verify Deployment:**
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Production Server Deployment

### Step 1: Server Preparation

**Update System:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

**Install Dependencies:**
```bash
# Ubuntu/Debian
sudo apt install python3.11 python3.11-venv python3-pip nodejs npm nginx git tesseract-ocr -y

# CentOS/RHEL  
sudo yum install python3.11 python3-pip nodejs npm nginx git tesseract -y
```

### Step 2: User and Directory Setup

```bash
# Create application user
sudo useradd -m -s /bin/bash nascom-redaction

# Create application directory
sudo mkdir -p /opt/nascom-redaction
sudo chown nascom-redaction:nascom-redaction /opt/nascom-redaction

# Switch to application user
sudo su - nascom-redaction
cd /opt/nascom-redaction
```

### Step 3: Application Deployment

```bash
# Clone application
git clone <repository-url> .

# Backend setup
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install fastapi uvicorn python-multipart pillow pytesseract spacy pdfplumber PyPDF2 reportlab websockets gunicorn
python -m spacy download en_core_web_sm

# Create data directories
mkdir -p data redacted_files
chmod 755 data redacted_files

# Frontend setup
cd ..
npm install
npm run build
```

### Step 4: Environment Configuration

**Create production environment file:**
```bash
# backend/.env
ENVIRONMENT=production
TESSERACT_PATH=/usr/bin/tesseract
DATA_DIR=/opt/nascom-redaction/backend/data
CORS_ORIGINS=https://yourdomain.com,http://localhost:8080
LOG_LEVEL=info
MAX_FILE_SIZE=52428800  # 50MB
```

### Step 5: Process Management with systemd

**Create systemd service file:**
```bash
sudo nano /etc/systemd/system/nascom-redaction.service
```

**Service configuration:**
```ini
[Unit]
Description=NASCOM Document Redaction Backend
After=network.target

[Service]
Type=notify
User=nascom-redaction
Group=nascom-redaction
WorkingDirectory=/opt/nascom-redaction/backend
Environment=PATH=/opt/nascom-redaction/backend/venv/bin
ExecStart=/opt/nascom-redaction/backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and start service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable nascom-redaction
sudo systemctl start nascom-redaction
sudo systemctl status nascom-redaction
```

### Step 6: Nginx Configuration

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/nascom-redaction
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL configuration (obtain certificates first)
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Frontend static files
    location / {
        root /opt/nascom-redaction/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket support
    location /ws {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # File upload size limit
    client_max_body_size 50M;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/nascom-redaction /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate Setup

**Using Let's Encrypt (free):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Using custom certificate:**
- Place certificate files in `/etc/ssl/certs/`
- Update Nginx configuration paths
- Restart Nginx

### Step 8: Firewall Configuration

```bash
# Ubuntu (UFW)
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable

# CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http  
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Docker Deployment

### Step 1: Create Dockerfiles

**Backend Dockerfile (`backend/Dockerfile`):**
```dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

# Copy application code
COPY . .

# Create data directories
RUN mkdir -p data redacted_files

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile (`Dockerfile`):**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create requirements.txt

**Create `backend/requirements.txt`:**
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pillow==10.0.1
pytesseract==0.3.10
spacy==3.7.2
pdfplumber==0.10.3
PyPDF2==3.0.1
reportlab==4.0.7
websockets==12.0
```

### Step 3: Docker Compose Setup

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./backend/data:/app/data
      - ./backend/redacted_files:/app/redacted_files
    environment:
      - TESSERACT_PATH=/usr/bin/tesseract
      - DATA_DIR=/app/data
      - CORS_ORIGINS=http://localhost:8080,https://yourdomain.com
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/dashboard"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  data:
  redacted_files:

networks:
  default:
    driver: bridge
```

### Step 4: Deploy with Docker Compose

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Scale backend if needed
docker-compose up -d --scale backend=3

# Stop services
docker-compose down

# Update and restart
git pull
docker-compose build
docker-compose up -d
```

## Cloud Deployment (AWS Example)

### Step 1: EC2 Instance Setup

**Launch EC2 instance:**
- Instance type: t3.medium (minimum) or t3.large (recommended)
- Operating System: Ubuntu 22.04 LTS
- Storage: 20GB+ EBS volume
- Security Group: Allow ports 22, 80, 443

**Connect and setup:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker ubuntu
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 2: Application Deployment

```bash
# Clone repository
git clone <repository-url>
cd nascom-document-redaction

# Deploy with Docker Compose
docker-compose up -d

# Setup SSL with Let's Encrypt
sudo apt install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Step 3: Load Balancer Setup (Optional)

**Create Application Load Balancer:**
- Target Group: EC2 instances running the application
- Health Check: `/api/dashboard`
- SSL Certificate: Upload or use ACM

### Step 4: Database Setup (Optional)

**For production with database:**
- Use RDS for PostgreSQL/MySQL
- Update application configuration
- Migrate from JSON storage

## Monitoring and Maintenance

### Log Management

**View application logs:**
```bash
# systemd service logs
sudo journalctl -u nascom-redaction -f

# Docker logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Health Monitoring

**Setup health checks:**
```bash
# Create monitoring script
sudo nano /opt/nascom-redaction/health-check.sh
```

```bash
#!/bin/bash
# Health check script

# Check backend
if curl -f http://localhost:8000/api/dashboard > /dev/null 2>&1; then
    echo "Backend: OK"
else
    echo "Backend: FAILED"
    sudo systemctl restart nascom-redaction
fi

# Check frontend
if curl -f http://localhost:8080 > /dev/null 2>&1; then
    echo "Frontend: OK"  
else
    echo "Frontend: FAILED"
    sudo systemctl restart nginx
fi
```

**Setup cron job:**
```bash
sudo crontab -e
# Add: */5 * * * * /opt/nascom-redaction/health-check.sh
```

### Backup Strategy

**Create backup script:**
```bash
#!/bin/bash
# Backup script

BACKUP_DIR="/opt/backups/nascom-redaction"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup data files
tar -czf $BACKUP_DIR/data_$DATE.tar.gz /opt/nascom-redaction/backend/data/

# Backup configuration
cp -r /opt/nascom-redaction/backend/.env $BACKUP_DIR/config_$DATE.env

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### Updates and Maintenance

**Update process:**
```bash
# Stop services
sudo systemctl stop nascom-redaction
sudo systemctl stop nginx

# Backup current version
sudo cp -r /opt/nascom-redaction /opt/nascom-redaction.backup

# Pull updates
cd /opt/nascom-redaction
sudo -u nascom-redaction git pull

# Update dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Build frontend
cd ..
npm install
npm run build

# Restart services
sudo systemctl start nascom-redaction
sudo systemctl start nginx

# Verify deployment
curl http://localhost:8000/api/dashboard
```

## Security Considerations

### Production Security

**Server Hardening:**
- Keep system updated
- Use non-root users
- Configure firewall
- Disable unnecessary services
- Use SSH keys instead of passwords

**Application Security:**
- Enable HTTPS only
- Set secure headers
- Implement rate limiting
- Use strong file permissions
- Regular security updates

**Data Security:**
- Encrypt data at rest
- Secure file uploads
- Regular backups
- Access logging
- Data retention policies

### SSL/TLS Configuration

**Strong SSL configuration:**
```nginx
# In Nginx configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

## Troubleshooting

### Common Issues

**1. Backend won't start:**
```bash
# Check logs
sudo journalctl -u nascom-redaction -n 50

# Check Python environment
source /opt/nascom-redaction/backend/venv/bin/activate
python -c "import spacy; print('spaCy OK')"
python -c "import pytesseract; print('Tesseract OK')"
```

**2. Frontend build fails:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**3. Tesseract errors:**
```bash
# Verify installation
tesseract --version

# Check permissions
ls -la /usr/bin/tesseract
```

**4. WebSocket connection issues:**
```bash
# Check Nginx WebSocket configuration
sudo nginx -t
sudo systemctl reload nginx

# Test WebSocket directly
wscat -c ws://localhost:8000/ws
```

### Performance Issues

**Monitor system resources:**
```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Network connections
netstat -an | grep 8000
```

**Optimize performance:**
- Increase worker processes for high load
- Use SSD storage for better I/O
- Add more RAM for large file processing
- Consider horizontal scaling

## Support and Maintenance

### Regular Maintenance Tasks

**Daily:**
- Monitor logs for errors
- Check disk space
- Verify service status

**Weekly:**
- Review security logs
- Check backup integrity
- Update system packages

**Monthly:**
- Security updates
- Performance review
- Backup cleanup

### Contact Information

**Technical Support:**
- NASCOM Development Team
- Email: support@nascom.com
- Documentation: README.md, API_DOCUMENTATION.md

---

**Document Version**: 1.0.0  
**Last Updated**: September 12, 2025  
**Deployment Guide Version**: 1.0.0
