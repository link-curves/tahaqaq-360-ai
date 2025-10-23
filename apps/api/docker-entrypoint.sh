#!/bin/sh
set -e

echo "Starting API container..."

# Run database migrations
echo "Running database migrations..."
if ! npx prisma migrate deploy --schema=src/prisma/schema.prisma; then
  echo "⚠️  Migration failed — continuing startup"
fi

# Check if database is seeded and run seed if needed
echo "Checking if database needs seeding..."

# Create a simple check script and run it
node <<'CHECKSCRIPT'
const { PrismaClient } = require('@prisma/client');

async function checkAndSeed() {
  const prisma = new PrismaClient();
  
  try {
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in database`);
    
    if (userCount === 0) {
      console.log('Database is empty. Needs seeding.');
      process.exit(1); // Exit with code 1 to trigger seeding
    } else {
      console.log('Database already seeded. Skipping seed.');
      process.exit(0); // Exit with code 0 to skip seeding
    }
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(0); // Skip seeding on error to avoid blocking startup
  } finally {
    await prisma.$disconnect();
  }
}

checkAndSeed();
CHECKSCRIPT

# If check script returned exit code 1, run seeding
if [ $? -eq 1 ]; then
  echo "Installing ts-node for seeding..."
  npm install -g ts-node typescript @types/node
  
  echo "Running seed script..."
  ts-node src/prisma/seed/arabic.seed.ts
  
  echo "Seeding completed!"
fi

echo "Environment variables at runtime:"
env | grep -E "PORT|DATABASE|NODE_ENV"

# Start the application
echo "Starting NestJS application..."
exec node dist/main.js
