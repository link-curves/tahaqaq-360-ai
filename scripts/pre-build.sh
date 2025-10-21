#!/bin/bash

# Pre-build script to prepare for Docker builds
# Run this before building Docker images

set -e

echo "🔧 Preparing for Docker build..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Update pnpm lockfile
echo -e "${YELLOW}Updating pnpm lockfile...${NC}"
pnpm install

# 2. Verify all package.json files exist
echo -e "${YELLOW}Verifying package structure...${NC}"
required_files=(
  "package.json"
  "pnpm-lock.yaml"
  "pnpm-workspace.yaml"
  "turbo.json"
  "apps/api/package.json"
  "apps/web/package.json"
  "apps/admin/package.json"
)

missing_files=()
for file in "${required_files[@]}"; do
  if [ ! -f "$file" ]; then
    missing_files+=("$file")
  fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
  echo "❌ Missing required files:"
  printf '  - %s\n' "${missing_files[@]}"
  exit 1
fi

# 3. Clean any previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
rm -rf apps/api/dist apps/web/dist apps/admin/dist
rm -rf apps/api/node_modules/.cache apps/web/node_modules/.cache apps/admin/node_modules/.cache

# 4. Generate Prisma client
echo -e "${YELLOW}Generating Prisma client...${NC}"
cd apps/api
pnpm prisma generate --schema=src/prisma/schema.prisma
cd ../..

echo ""
echo -e "${GREEN}✓ Ready for Docker build!${NC}"
echo ""
echo "Now you can run:"
echo "  docker-compose build"
echo "  or"
echo "  ./scripts/build-and-push.sh"
