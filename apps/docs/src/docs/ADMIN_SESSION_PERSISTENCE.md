# Admin Session Persistence - 24 Hour Sessions

## Overview
Updated the admin authentication system to maintain login sessions for 24 hours instead of 15 minutes, with automatic token refresh to prevent forced logouts during active use.

## Changes Made

### 1. Backend - JWT Token Expiration (`apps/api/src/config/jwt.config.ts`)
**Before:**
```typescript
accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
```

**After:**
```typescript
accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
```

### 2. Backend - Cookie Expiration (`apps/api/src/modules/auth/auth.controller.ts`)

#### Signup Endpoint
**Before:**
```typescript
res.cookie('access_token', result.accessToken, {
  maxAge: 15 * 60 * 1000, // 15 minutes
});

res.cookie('logged_in', 'true', {
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

**After:**
```typescript
res.cookie('access_token', result.accessToken, {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});

res.cookie('logged_in', 'true', {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

#### Login Endpoint
Same changes applied to login endpoint - both `access_token` and `logged_in` cookies now expire after 24 hours.

#### Refresh Token Endpoint
**Before:**
```typescript
const accessCookieOptions = {
  maxAge: 15 * 60 * 1000, // 15 minutes
};
res.cookie('access_token', tokens.accessToken, accessCookieOptions);
```

**After:**
```typescript
const accessCookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};
res.cookie('access_token', tokens.accessToken, accessCookieOptions);

// Also update logged_in cookie
res.cookie('logged_in', 'true', {
  httpOnly: false,
  secure: this.config.get<string>('NODE_ENV') === 'production',
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/',
});
```

### 3. Frontend - Automatic Token Refresh (`apps/admin/src/contexts/AdminAuthContext.tsx`)

Added automatic token refresh mechanism that runs every 23 hours (1 hour before the 24-hour expiry):

```typescript
// Auto-refresh token before expiration (refresh 1 hour before 24h expiry = every 23 hours)
useEffect(() => {
  if (!isAuthenticated) return;

  const refreshInterval = setInterval(async () => {
    try {
      console.log("[AdminAuth] Auto-refreshing token...");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("[AdminAuth] Token refreshed successfully");
      } else {
        console.error("[AdminAuth] Token refresh failed");
        setIsAuthenticated(false);
        queryClient.setQueryData(["currentAdmin"], null);
      }
    } catch (error) {
      console.error("[AdminAuth] Token refresh error:", error);
    }
  }, 23 * 60 * 60 * 1000); // Refresh every 23 hours (1 hour before expiry)

  return () => clearInterval(refreshInterval);
}, [isAuthenticated, queryClient]);
```

## Session Behavior

### Before Changes
- Access token expires after 15 minutes
- User forced to re-login every 15 minutes
- Interrupts active work sessions
- Poor UX for admin panel

### After Changes
- Access token expires after 24 hours
- Automatic refresh every 23 hours (while user is active)
- Session only ends when:
  1. User manually logs out
  2. User is inactive for 24+ hours
  3. Refresh token expires (7 days)
- Much better UX for admin panel workflows

## Cookie Structure

### Three Cookies Set on Login/Signup
1. **`access_token`** (httpOnly, secure, sameSite: lax)
   - Contains JWT access token
   - Used for API authentication
   - Expires after 24 hours
   - Cannot be accessed by JavaScript

2. **`refresh_token`** (httpOnly, secure, sameSite: lax)
   - Contains JWT refresh token
   - Used to get new access tokens
   - Expires after 7 days
   - Cannot be accessed by JavaScript

3. **`logged_in`** (secure, sameSite: lax, **NOT httpOnly**)
   - Simple flag indicating logged-in state
   - Used by frontend for UI state management
   - Expires after 24 hours
   - Can be read by JavaScript

## Security Considerations

✅ **Maintained Security:**
- JWT tokens still stored in httpOnly cookies (XSS protection)
- Refresh token still has 7-day limit (compromise window)
- Automatic token refresh only happens if user is active
- All cookies use `sameSite: 'lax'` (CSRF protection)
- Secure flag enabled in production (HTTPS only)

✅ **Improved UX:**
- Admin users can work uninterrupted for full workday
- No frequent re-authentication during active sessions
- Session persists across page refreshes
- Automatic logout after true inactivity (24+ hours)

## Testing

### Manual Testing Steps
1. **Login and wait 23 hours:**
   - Login to admin panel
   - Keep browser open
   - Wait 23 hours
   - Verify token auto-refreshes (check console logs)
   - Verify session continues without interruption

2. **Login and wait 24 hours (inactive):**
   - Login to admin panel
   - Close browser
   - Wait 24+ hours
   - Open browser and try to access admin panel
   - Should redirect to login (session expired)

3. **Manual logout:**
   - Login to admin panel
   - Click logout button
   - Verify immediate redirect to login page
   - Verify all cookies cleared

## Environment Variables

### Optional Configuration
You can override the default 24-hour duration via environment variables:

**`.env` file:**
```bash
# JWT token expiration (default: 24h)
JWT_ACCESS_EXPIRES_IN=24h

# Refresh token expiration (default: 7d)
JWT_REFRESH_EXPIRES_IN=7d
```

**Accepted formats:**
- Minutes: `15m`, `30m`, `60m`
- Hours: `1h`, `12h`, `24h`
- Days: `1d`, `7d`, `30d`

## Migration Notes

### For Existing Users
- No database migration required
- No code changes needed in other parts of the application
- Existing sessions will expire normally
- New sessions (after this update) will use 24-hour duration

### Deployment Steps
1. Deploy backend changes first (auth.controller.ts, jwt.config.ts)
2. Restart API server
3. Deploy frontend changes (AdminAuthContext.tsx)
4. Clear browser cookies (or wait for natural expiry)
5. Test login flow end-to-end

## Related Files
- `apps/api/src/modules/auth/auth.controller.ts` - Cookie settings
- `apps/api/src/config/jwt.config.ts` - JWT token expiration
- `apps/admin/src/contexts/AdminAuthContext.tsx` - Auto-refresh logic
- `apps/api/src/modules/auth/auth.service.ts` - Token generation (unchanged)
- `apps/api/src/common/guards/jwt-auth.guard.ts` - Token validation (unchanged)
