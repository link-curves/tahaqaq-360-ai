# Authentication System Guide - Tahaqaq 360

## Overview

The Tahaqaq 360 application uses a **cookie-based session authentication** system that keeps users logged in across browser sessions until they explicitly log out or clear their cookies.

## How It Works

### 1. **Session Persistence**

- Authentication state is maintained via HTTP-only cookies (`logged_in=true`)
- The backend sets secure cookies that contain the session token
- User stays logged in even after:
  - Closing the browser tab
  - Navigating away from the site
  - Refreshing the page
  - Restarting the browser (until cookies expire or are cleared)

### 2. **Authentication Flow**

#### **Login Process:**
1. User enters credentials on `/login` page
2. `AuthContext` calls `apiClient.login(credentials)`
3. Backend validates credentials and sets HTTP-only cookies
4. Frontend receives user data and stores it in React Query cache
5. User is automatically redirected to home page (`/`)
6. Navbar displays user's name, avatar, and dropdown menu

#### **Session Check on Page Load:**
1. `AuthContext` checks for `logged_in=true` cookie
2. If cookie exists, automatically calls `/auth/me` endpoint
3. Backend validates session cookie and returns user data
4. User data is displayed in navbar (name, email, avatar)
5. Login button is hidden, user menu is shown

#### **Logout Process:**
1. User clicks "تسجيل الخروج" in navbar dropdown
2. `AuthContext` calls `apiClient.logout()`
3. Backend clears session cookies
4. Frontend clears all React Query cache
5. User is redirected to home page (`/`)
6. Navbar shows login button again

### 3. **User Information Display**

The navbar shows different UI based on authentication state:

#### **Authenticated User (Desktop):**
- Avatar with initials or uploaded image
- Dropdown menu with:
  - User's full name
  - User's email
  - إرسال محتوى (Submit Content)
  - طلباتي (My Submissions)
  - الملف الشخصي (Profile)
  - الإعدادات (Settings)
  - لوحة الإدارة (Admin Dashboard - for admins only)
  - تسجيل الخروج (Logout)

#### **Authenticated User (Mobile):**
- Same information in mobile-optimized layout
- Avatar and user info shown at top of menu
- All menu items stacked vertically

#### **Not Authenticated:**
- "تسجيل الدخول" (Login) button shown
- Clicking navigates to `/login` page

## Key Features

### ✅ **Persistent Sessions**
- Users remain logged in across browser sessions
- Session only ends when:
  - User explicitly logs out
  - Browser cookies are cleared
  - Session expires on backend (configurable timeout)

### ✅ **Automatic Session Validation**
- Checks cookie every 30 seconds
- Refetches user data on page mount
- Handles session expiration gracefully

### ✅ **User Context Available Everywhere**
- `useAuth()` hook available in any component
- Access to: `user`, `isAuthenticated`, `isLoading`, `login`, `logout`, etc.
- User data cached for 1 hour to reduce API calls

### ✅ **Security Features**
- HTTP-only cookies (not accessible via JavaScript)
- Credentials included in all API requests
- CORS configured on backend
- Automatic token refresh (if implemented on backend)

## Developer Usage

### Using Auth in Components

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      Welcome, {user?.firstName} {user?.lastName}!
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}
```

### Protected Routes

```typescript
import { ProtectedRoute } from "@/contexts/AuthContext";

<ProtectedRoute fallback={<Navigate to="/login" />}>
  <MyProtectedComponent />
</ProtectedRoute>
```

### Manual Login/Logout

```typescript
const { login, logout } = useAuth();

// Login
await login({ email: "user@example.com", password: "password" });

// Logout
await logout();
```

## User Object Structure

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // "user" | "admin" | "moderator"
  avatar?: string; // Optional profile image URL
}
```

## Configuration

### Cookie Settings (Backend)
Located in `apps/api/src/config/` - ensure:
- `httpOnly: true` - Prevents JavaScript access
- `secure: true` - Only sent over HTTPS (production)
- `sameSite: 'lax'` - CSRF protection
- `maxAge` - Session duration (e.g., 7 days)

### Environment Variables (Frontend)
- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:5000/api/v1`)

## Troubleshooting

### User not staying logged in?
1. Check browser cookies - ensure `logged_in=true` exists
2. Check backend cookie settings - `maxAge` should be set
3. Check CORS settings - frontend domain must be allowed
4. Check if cookies are being sent - `credentials: 'include'` in API client

### User info not showing in navbar?
1. Check if `useAuth()` returns user object
2. Check browser DevTools > Application > Cookies
3. Check network tab for `/auth/me` request
4. Verify backend returns user data correctly

### Session expires too quickly?
1. Increase `maxAge` in backend cookie settings
2. Increase `staleTime` in React Query config (currently 1 hour)
3. Consider implementing refresh token mechanism

## Files Modified

### Frontend (`apps/web/src/`)
- ✅ `contexts/AuthContext.tsx` - Enhanced session persistence
- ✅ `components/Navbar.tsx` - User display and logout redirect
- ✅ `lib/api.ts` - Fixed environment variable usage

### Backend (`apps/api/src/`)
- Backend already configured with cookie-based sessions
- No changes needed (already working correctly)

## Next Steps (Optional Enhancements)

1. **Refresh Token Flow** - Automatically refresh expired sessions
2. **Remember Me** - Checkbox to extend session duration
3. **Activity Timeout** - Auto-logout after inactivity
4. **Multiple Sessions** - Track active sessions across devices
5. **Two-Factor Authentication** - Add 2FA for extra security

---

**Last Updated:** October 18, 2025  
**Status:** ✅ Fully Implemented and Working
