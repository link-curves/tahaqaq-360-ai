#!/bin/bash

# ==================================
# Build and Push Docker Images to Docker Hub
# ==================================
# Usage: ./scripts/build-and-push.sh [version]
# Example: ./scripts/build-and-push.sh v1.0.0

set -e

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-yourusername}"
VERSION="${1:-latest}"
REGISTRY="docker.io"

echo "🚀 Building Tahaqaq-360 Docker Images"
echo "======================================"
echo "Version: $VERSION"
echo "Registry: $REGISTRY"
echo "Username: $DOCKER_USERNAME"
echo ""

# Build API image
echo "📦 Building API image..."
docker build \
  -f apps/api/Dockerfile.prod \
  -t $DOCKER_USERNAME/tahaqaq-api:$VERSION \
  -t $DOCKER_USERNAME/tahaqaq-api:latest \
  --platform linux/amd64 \
  .

echo "✅ API image built successfully"
echo ""

# Build Web image
echo "📦 Building Web image..."
docker build \
  -f apps/web/Dockerfile.prod \
  -t $DOCKER_USERNAME/tahaqaq-web:$VERSION \
  -t $DOCKER_USERNAME/tahaqaq-web:latest \
  --platform linux/amd64 \
  .

echo "✅ Web image built successfully"
echo ""

# Login to Docker Hub
echo "🔐 Logging in to Docker Hub..."
docker login -u $DOCKER_USERNAME

# Push images
echo "⬆️  Pushing API image to Docker Hub..."
docker push $DOCKER_USERNAME/tahaqaq-api:$VERSION
docker push $DOCKER_USERNAME/tahaqaq-api:latest

echo "⬆️  Pushing Web image to Docker Hub..."
docker push $DOCKER_USERNAME/tahaqaq-web:$VERSION
docker push $DOCKER_USERNAME/tahaqaq-web:latest

echo ""
echo "✨ All images pushed successfully!"
echo ""
echo "Pull commands:"
echo "  docker pull $DOCKER_USERNAME/tahaqaq-api:$VERSION"
echo "  docker pull $DOCKER_USERNAME/tahaqaq-web:$VERSION"
echo ""
echo "Docker Hub URLs:"
echo "  https://hub.docker.com/r/$DOCKER_USERNAME/tahaqaq-api"
echo "  https://hub.docker.com/r/$DOCKER_USERNAME/tahaqaq-web"
