#!/bin/bash

# ==================================
# Deploy to Production Server
# ==================================
# This script pulls images from Docker Hub and starts the services

set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-alitraboulsi96}"
VERSION="${VERSION:-latest}"

echo "🚀 Deploying Tahaqaq-360"
echo "========================"
echo "Version: $VERSION"
echo ""

# Check if .env.dev exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Pull latest images
echo "⬇️  Pulling images from Docker Hub..."
docker pull $DOCKER_USERNAME/tahaqaq-api:$VERSION
docker pull $DOCKER_USERNAME/tahaqaq-web:$VERSION

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.dev.yml --env-file .env down

# Start services
echo "▶️  Starting services..."
docker-compose -f docker-compose.dev.yml --env-file .env up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Services:"
echo "  🌐 Web:    http://localhost:${WEB_PORT:-3000}"
echo "  🔌 API:    http://localhost:${API_PORT:-5000}"
echo "  🗄️  Database: localhost:${POSTGRES_PORT:-5432}"
echo ""
echo "Useful commands:"
echo "  View logs:     docker-compose -f docker-compose.dev.yml logs -f"
echo "  Stop services: docker-compose -f docker-compose.dev.yml down"
echo "  Restart:       docker-compose -f docker-compose.dev.yml restart"
