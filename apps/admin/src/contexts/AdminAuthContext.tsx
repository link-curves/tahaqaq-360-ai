import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "MODERATOR";
  avatar?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};

// Check if admin is authenticated via cookie
const isAdminAuthenticated = (): boolean => {
  const hasCookie = document.cookie.includes("logged_in=true");
  console.log("[isAdminAuthenticated] Checking cookie. Result:", hasCookie);
  console.log("[isAdminAuthenticated] All cookies:", document.cookie);
  return hasCookie;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({
  children,
}) => {
  console.log("[AdminAuthProvider] Component mounting/re-rendering");

  // Initialize isAuthenticated by checking cookie immediately (not in useEffect)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const hasAuthCookie = isAdminAuthenticated();
    console.log("[AdminAuth] Initial state - Has auth cookie:", hasAuthCookie);
    console.log("[AdminAuth] All cookies:", document.cookie);
    return hasAuthCookie;
  });
  const queryClient = useQueryClient();

  // Fetch current admin user - only when explicitly enabled
  const { data: adminData, isError } = useQuery({
    queryKey: ["currentAdmin"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/me`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const data = await response.json();

      // Verify user has admin or moderator role
      if (data.user.role !== "ADMIN" && data.user.role !== "MODERATOR") {
        throw new Error("Insufficient permissions");
      }

      return data.user as AdminUser;
    },
    enabled: false, // Disabled by default, only fetch when explicitly called
    retry: false,
    staleTime: Infinity, // Never consider data stale
    gcTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Handle errors
  useEffect(() => {
    if (isError) {
      setIsAuthenticated(false);
      queryClient.setQueryData(["currentAdmin"], null);
    }
  }, [isError, queryClient]);

  // Admin login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      console.log("[AdminAuth] Login response status:", response.status);

      if (!response.ok) {
        const error = await response.json();
        console.log("[AdminAuth] Login error:", error);
        throw new Error(error.message || "فشل تسجيل الدخول");
      }

      const data = await response.json();
      console.log("[AdminAuth] Login response data:", data);

      // Response is wrapped by TransformInterceptor: { success: true, data: { user: {...} } }
      const user = data?.data?.user || data?.user;

      // Check if response has user object
      if (!user) {
        console.error("[AdminAuth] Invalid response structure:", data);
        throw new Error("استجابة غير صالحة من الخادم");
      }

      // Verify admin/moderator role
      if (
        !user.role ||
        (user.role !== "ADMIN" &&
          user.role !== "MODERATOR" &&
          user.role !== "SUPER_ADMIN")
      ) {
        console.error(
          "[AdminAuth] Insufficient permissions. User role:",
          user.role
        );
        throw new Error("ليس لديك صلاحيات للوصول إلى لوحة التحكم");
      }

      console.log("[AdminAuth] Login successful for user:", user);
      return user;
    },
    onSuccess: async (user) => {
      console.log("[AdminAuth] Login successful, setting authenticated state");
      queryClient.setQueryData(["currentAdmin"], user);

      // Wait a bit for cookies to be set
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify cookie was set
      const hasCookie = isAdminAuthenticated();
      console.log("[AdminAuth] After login, has cookie:", hasCookie);

      setIsAuthenticated(true);
      toast.success(`مرحباً ${user.firstName}! تم تسجيل الدخول بنجاح`);
    },
    onError: (error: Error) => {
      console.error("[AdminAuth] Login error:", error);
      toast.error(error.message);
    },
  });

  // Admin logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("فشل تسجيل الخروج");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsAuthenticated(false);
      queryClient.setQueryData(["currentAdmin"], null);
      queryClient.clear();
      toast.success("تم تسجيل الخروج بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // No initialization guard - let components handle their own loading states
  return (
    <AdminAuthContext.Provider
      value={{
        admin: adminData || null,
        isLoading: false, // We're not loading by default
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

// Protected Admin Route Component
interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  console.log(
    "[ProtectedAdminRoute] isAuthenticated:",
    isAuthenticated,
    "isLoading:",
    isLoading
  );

  useEffect(() => {
    console.log(
      "[ProtectedAdminRoute] useEffect - isAuthenticated:",
      isAuthenticated,
      "isLoading:",
      isLoading
    );
    if (!isLoading && !isAuthenticated) {
      console.log("[ProtectedAdminRoute] Redirecting to /login");
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state
  if (isLoading) {
    console.log("[ProtectedAdminRoute] Showing loading state");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center" dir="rtl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show loading while redirecting
  if (!isAuthenticated) {
    console.log(
      "[ProtectedAdminRoute] Not authenticated, showing loading while redirecting"
    );
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center" dir="rtl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحويل...</p>
        </div>
      </div>
    );
  }

  console.log("[ProtectedAdminRoute] Rendering children");
  return <>{children}</>;
};
