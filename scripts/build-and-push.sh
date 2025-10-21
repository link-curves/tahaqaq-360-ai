#!/bin/bash

# ==================================
# Build and Push Docker Images to Docker Hub using Docker Compose
# ==================================
# Usage: ./scripts/build-and-push.sh [version]
# Example: ./scripts/build-and-push.sh v1.0.0

set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-alitraboulsi96}"
VERSION="${1:-latest}"
COMPOSE_FILE="docker-compose.dev.yml"

echo "🚀 Building Tahaqaq-360 Docker Images with Docker Compose"
echo "=========================================================="
echo "Version: $VERSION"
echo "Username: $DOCKER_USERNAME"
echo "Compose File: $COMPOSE_FILE"
echo ""

# Run pre-build checks and preparations
echo "🔧 Running pre-build preparations..."
if [ -f "scripts/pre-build.sh" ]; then
  chmod +x scripts/pre-build.sh
  ./scripts/pre-build.sh
else
  echo "⚠️  Warning: pre-build.sh not found, skipping preparation"
fi
echo ""

# Login to Docker Hub
echo "� Logging in to Docker Hub..."
docker login -u $DOCKER_USERNAME
echo ""

# Build all images using docker compose
echo "📦 Building all images with Docker Compose..."
docker compose -f $COMPOSE_FILE build \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  --progress=plain \
  api web admin

echo "✅ All images built successfully"
echo ""

# Tag images with version and latest
echo "🏷️  Tagging images..."

# Tag API
docker tag tahaqaq-360-api:latest $DOCKER_USERNAME/tahaqaq-api:$VERSION
docker tag tahaqaq-360-api:latest $DOCKER_USERNAME/tahaqaq-api:latest

# Tag Web
docker tag tahaqaq-360-web:latest $DOCKER_USERNAME/tahaqaq-web:$VERSION
docker tag tahaqaq-360-web:latest $DOCKER_USERNAME/tahaqaq-web:latest

# Tag Admin
docker tag tahaqaq-360-admin:latest $DOCKER_USERNAME/tahaqaq-admin:$VERSION
docker tag tahaqaq-360-admin:latest $DOCKER_USERNAME/tahaqaq-admin:latest

echo "✅ Images tagged successfully"
echo ""

# Push images to Docker Hub
echo "⬆️  Pushing images to Docker Hub..."
echo ""

echo "📤 Pushing API image..."
docker push $DOCKER_USERNAME/tahaqaq-api:$VERSION
docker push $DOCKER_USERNAME/tahaqaq-api:latest

echo "📤 Pushing Web image..."
docker push $DOCKER_USERNAME/tahaqaq-web:$VERSION
docker push $DOCKER_USERNAME/tahaqaq-web:latest

echo "📤 Pushing Admin image..."
docker push $DOCKER_USERNAME/tahaqaq-admin:$VERSION
docker push $DOCKER_USERNAME/tahaqaq-admin:latest

echo ""
echo "✨ All images pushed successfully!"
echo ""
echo "📋 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Pull commands:"
echo "  docker pull $DOCKER_USERNAME/tahaqaq-api:$VERSION"
echo "  docker pull $DOCKER_USERNAME/tahaqaq-web:$VERSION"
echo "  docker pull $DOCKER_USERNAME/tahaqaq-admin:$VERSION"
echo ""
echo "Docker Hub URLs:"
echo "  🔗 API:   https://hub.docker.com/r/$DOCKER_USERNAME/tahaqaq-api"
echo "  🔗 Web:   https://hub.docker.com/r/$DOCKER_USERNAME/tahaqaq-web"
echo "  🔗 Admin: https://hub.docker.com/r/$DOCKER_USERNAME/tahaqaq-admin"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
