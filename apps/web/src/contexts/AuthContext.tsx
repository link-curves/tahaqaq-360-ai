import { apiClient, LoginRequest, RegisterRequest, User } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Check if user is logged in by checking cookie
const isLoggedInFromCookie = (): boolean => {
  return document.cookie.includes("logged_in=true");
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    isLoggedInFromCookie()
  );
  const queryClient = useQueryClient();

  // Query to get current user - runs on mount if cookie exists
  const {
    data: userData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiClient.getCurrentUser(),
    enabled: isAuthenticated, // Only run if we think user is authenticated
    retry: false, // Don't retry to avoid rate limiting
    staleTime: Infinity, // Never consider data stale automatically
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - don't garbage collect
    refetchOnWindowFocus: false, // Don't refetch on every window focus
    refetchOnMount: false, // Don't automatically refetch on mount
    refetchInterval: false, // Disable automatic refetching
  });

  // Check cookie on mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const hasAuthCookie = isLoggedInFromCookie();
      if (hasAuthCookie && !isAuthenticated) {
        setIsAuthenticated(true);
        refetch(); // Fetch user data if cookie exists but we're not authenticated
      } else if (!hasAuthCookie && isAuthenticated) {
        setIsAuthenticated(false);
        queryClient.setQueryData(["currentUser"], null);
      }
    };

    // Check on mount
    checkAuth();

    // Check less frequently (every 5 minutes instead of 30 seconds)
    const interval = setInterval(checkAuth, 300000);

    return () => clearInterval(interval);
  }, [isAuthenticated, queryClient, refetch]);

  // Update authentication state when query result changes
  useEffect(() => {
    if (isError) {
      // Only clear if cookie is also missing
      if (!isLoggedInFromCookie()) {
        setIsAuthenticated(false);
        queryClient.setQueryData(["currentUser"], null);
      }
    } else if (userData?.user) {
      setIsAuthenticated(true);
    }
  }, [userData, isError, queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: async (data) => {
      console.log("[AUTH] Login response data:", data);
      console.log("[AUTH] User data from login:", data.user);
      console.log("[AUTH] Cookies after login:", document.cookie);

      // CRITICAL: Set query data BEFORE setting isAuthenticated
      // This ensures the data is in cache when the query becomes enabled
      queryClient.setQueryData(["currentUser"], { user: data.user });

      // Now enable the query
      setIsAuthenticated(true);

      toast.success(`مرحباً ${data.user.firstName}! تم تسجيل الدخول بنجاح`);
    },
    onError: (error: Error) => {
      console.error("[AUTH] Login error:", error);
      toast.error(`خطأ في تسجيل الدخول: ${error.message}`);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
    onSuccess: async (data) => {
      console.log("[AUTH] Register response data:", data);

      // Set query data BEFORE setting isAuthenticated
      queryClient.setQueryData(["currentUser"], { user: data.user });

      // Now enable the query
      setIsAuthenticated(true);

      toast.success(`مرحباً ${data.user.firstName}! تم إنشاء حسابك بنجاح`);
    },
    onError: (error: Error) => {
      console.error("[AUTH] Register error:", error);
      toast.error(`خطأ في إنشاء الحساب: ${error.message}`);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.clear(); // Clear all cached data
      // Clear the currentUser query specifically
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      toast.success("تم تسجيل الخروج بنجاح!");
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local state
      setIsAuthenticated(false);
      queryClient.clear();
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      toast.error(`خطأ في تسجيل الخروج: ${error.message}`);
    },
  });

  // Auth actions
  const login = async (credentials: LoginRequest) => {
    console.log("[AUTH] login() called with:", { email: credentials.email });
    try {
      await loginMutation.mutateAsync(credentials);
      console.log("[AUTH] login() completed successfully");
    } catch (error) {
      console.error("[AUTH] login() failed:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    console.log("[AUTH] register() called");
    try {
      await registerMutation.mutateAsync(userData);
      console.log("[AUTH] register() completed successfully");
    } catch (error) {
      console.error("[AUTH] register() failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    console.log("[AUTH] logout() called");
    try {
      await logoutMutation.mutateAsync();
      console.log("[AUTH] logout() completed successfully");
    } catch (error) {
      console.error("[AUTH] logout() failed:", error);
      throw error;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = apiClient.getGoogleAuthUrl();
  };

  // Debug logging
  console.log("AuthContext state:", {
    userData,
    user: userData?.user,
    isAuthenticated,
    isLoading,
  });

  const value: AuthContextType = {
    user: userData?.user || null,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Higher-order component for protected routes
interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = <div>يرجى تسجيل الدخول للوصول إلى هذه الصفحة</div>,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
