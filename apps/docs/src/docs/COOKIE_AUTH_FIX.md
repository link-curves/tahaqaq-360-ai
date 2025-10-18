# Cookie-Based Authentication Fix

## Problem

After login, the user information was not displaying in the navbar, and the `/auth/me` endpoint was returning 401 Unauthorized errors.

### Root Cause

The `login` and `signup` endpoints were returning JWT tokens in the response body but **NOT setting HTTP-only cookies**. This meant:

1. ✅ Login succeeded and returned user data
2. ✅ Frontend stored user in React Query cache
3. ❌ No authentication cookies were set
4. ❌ Subsequent `/auth/me` request failed with 401 because no JWT cookie was present

### Error Logs

```
GET http://localhost:5000/api/v1/auth/me 401 (Unauthorized)
API request failed: Error: Invalid or expired token
```

## Solution

Updated both `login` and `signup` endpoints in `apps/api/src/modules/auth/auth.controller.ts` to set three cookies:

### 1. `access_token` (HTTP-only)
- Contains JWT access token
- Used for authenticating API requests
- Expires in 15 minutes
- **httpOnly: true** - Cannot be accessed by JavaScript

### 2. `refresh_token` (HTTP-only)
- Contains JWT refresh token
- Used to get new access tokens
- Expires in 7 days
- **httpOnly: true** - Cannot be accessed by JavaScript

### 3. `logged_in` (Readable by JS)
- Simple flag cookie set to "true"
- Used by frontend to check authentication state
- Expires in 15 minutes
- **httpOnly: false** - Can be read by JavaScript

## Changes Made

### Backend: `auth.controller.ts`

**Before (login endpoint):**
```typescript
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

**After (login endpoint):**
```typescript
@Post('login')
async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const result = await this.authService.login(loginDto);
  
  // Set httpOnly JWT cookies
  res.cookie('access_token', result.accessToken, {
    httpOnly: true,
    secure: this.config.get<string>('NODE_ENV') === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  res.cookie('refresh_token', result.refreshToken, {
    httpOnly: true,
    secure: this.config.get<string>('NODE_ENV') === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  res.cookie('logged_in', 'true', {
    httpOnly: false,
    secure: this.config.get<string>('NODE_ENV') === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });

  return { user: result.user };
}
```

Same pattern applied to the `signup` endpoint.

## How It Works

### Authentication Flow

1. **User logs in** → POST `/api/v1/auth/login`
2. **Backend validates credentials** → Generates JWT tokens
3. **Backend sets cookies** → `access_token`, `refresh_token`, `logged_in`
4. **Frontend receives response** → Gets user data
5. **Frontend checks auth** → Calls GET `/api/v1/auth/me`
6. **JWT Strategy extracts token** → From `access_token` cookie
7. **Backend validates JWT** → Returns user profile
8. **Navbar displays user info** → Shows firstName, lastName, avatar

### Cookie Extraction in JWT Strategy

The `JwtStrategy` is already configured to extract tokens from cookies:

```typescript
jwtFromRequest: ExtractJwt.fromExtractors([
  ExtractJwt.fromAuthHeaderAsBearerToken(), // Try Authorization header first
  (request: Request) => request?.cookies?.access_token, // Then try cookie
]),
```

## Security Features

- **HTTP-only cookies**: JavaScript cannot access the JWT tokens (prevents XSS attacks)
- **SameSite: lax**: Cookies only sent with same-site requests (prevents CSRF attacks)
- **Secure flag**: Cookies only sent over HTTPS in production
- **Credentials: include**: Frontend sends cookies with every request

## Testing

After restarting the API server:

1. Go to login page
2. Enter credentials and submit
3. Check browser DevTools → Application → Cookies
4. You should see three cookies: `access_token`, `refresh_token`, `logged_in`
5. Navbar should display user name and avatar
6. Network tab should show `/auth/me` returning 200 OK (not 401)

## Related Files

- `apps/api/src/modules/auth/auth.controller.ts` - Cookie setting logic
- `apps/api/src/modules/auth/strategies/jwt.strategy.ts` - Cookie extraction logic
- `apps/web/src/contexts/AuthContext.tsx` - Frontend auth state management
- `apps/web/src/lib/api.ts` - API client with `credentials: 'include'`

## Notes

- The Google OAuth flow already had cookie setting implemented - we aligned login/signup to match it
- Frontend API client already had `credentials: 'include'` configured
- JWT strategy already had cookie extraction logic - no changes needed there
- The `@Res({ passthrough: true })` decorator allows NestJS to handle the response while still letting us set cookies
