FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends     gcc     libsqlite3-0     curl     && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create storage directories
RUN mkdir -p /app/storage /app/continuity

# Expose Flask port
EXPOSE 5000

# Production: use gunicorn with eventlet for WebSocket support
# Note: SQLite limits us to 1 worker. Scale Redis+Postgres later for multi-worker.
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "--bind", "0.0.0.0:5000", "--timeout", "120", "--keep-alive", "5", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
