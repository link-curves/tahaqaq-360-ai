import { registerAs } from "@nestjs/config";

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
