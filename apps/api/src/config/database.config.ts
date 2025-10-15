import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
}));

// ============================================
// src/config/jwt.config.ts
// ============================================

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-production',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));

// ============================================
// src/config/google.config.ts
// ============================================

export const googleConfig = registerAs('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
}));

// ============================================
// src/config/storage.config.ts
// ============================================

export const storageConfig = registerAs('storage', () => ({
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  supabaseBucket: process.env.SUPABASE_BUCKET || 'tahaqaq-360',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE!, 10) || 10485760, // 10MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf',
  ],
}));
