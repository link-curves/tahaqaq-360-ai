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

  // Query to get current user
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => apiClient.getCurrentUser(),
    enabled: isAuthenticated, // Only run if we think user is authenticated
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update authentication state when query result changes
  useEffect(() => {
    if (isError) {
      setIsAuthenticated(false);
      queryClient.setQueryData(["currentUser"], null);
    } else if (userData?.user) {
      setIsAuthenticated(true);
    }
  }, [userData, isError, queryClient]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => apiClient.login(credentials),
    onSuccess: (data) => {
      setIsAuthenticated(true);
      queryClient.setQueryData(["currentUser"], { user: data.user });
      toast.success("تم تسجيل الدخول بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(`خطأ في تسجيل الدخول: ${error.message}`);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => apiClient.register(userData),
    onSuccess: (data) => {
      setIsAuthenticated(true);
      queryClient.setQueryData(["currentUser"], { user: data.user });
      toast.success("تم إنشاء الحساب بنجاح!");
    },
    onError: (error: Error) => {
      toast.error(`خطأ في إنشاء الحساب: ${error.message}`);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiClient.logout(),
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.clear(); // Clear all cached data
      toast.success("تم تسجيل الخروج بنجاح!");
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local state
      setIsAuthenticated(false);
      queryClient.clear();
      toast.error(`خطأ في تسجيل الخروج: ${error.message}`);
    },
  });

  // Auth actions
  const login = async (credentials: LoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterRequest) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const loginWithGoogle = () => {
    window.location.href = apiClient.getGoogleAuthUrl();
  };

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
