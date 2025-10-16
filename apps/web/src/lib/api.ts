// API Configuration and Types
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Enums
export enum VeracityRating {
  TRUE = "TRUE",
  MOSTLY_TRUE = "MOSTLY_TRUE",
  HALF_TRUE = "HALF_TRUE",
  MOSTLY_FALSE = "MOSTLY_FALSE",
  FALSE = "FALSE",
  UNVERIFIABLE = "UNVERIFIABLE",
  SATIRE = "SATIRE",
  MISLEADING = "MISLEADING",
}

export enum EventType {
  WORKSHOP = "WORKSHOP",
  WEBINAR = "WEBINAR",
  EXHIBITION = "EXHIBITION",
  CONFERENCE = "CONFERENCE",
  TRAINING = "TRAINING",
}

export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  UNDER_REVIEW = "UNDER_REVIEW",
}

// Fact Check Types
export interface FactCheck {
  id: string;
  title: string;
  slug: string;
  claim: string;
  claimant?: string;
  claimDate?: string;
  verdict: VeracityRating;
  summary: string;
  fullAnalysis: string;
  methodology?: string;
  sources: any[];
  mediaUrls: string[];
  tags: string[];
  views: number;
  shares: number;
  status: ContentStatus;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface FactCheckStats {
  totalFactChecks: number;
  trueFactChecks: number;
  falseFactChecks: number;
  misleadingFactChecks: number;
  recentFactChecks: number;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: EventType;
  status: EventStatus;
  coverImage?: string;
  startDate: string;
  endDate: string;
  location?: string;
  virtualLink?: string;
  isVirtual: boolean;
  maxAttendees?: number;
  speakers: any[];
  agenda: any[];
  requirements: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  registrations?: any[];
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FactCheckParams extends PaginationParams {
  verdict?: VeracityRating;
  status?: ContentStatus;
  search?: string;
  featured?: boolean;
}

export interface EventParams extends PaginationParams {
  type?: EventType;
  status?: EventStatus;
  upcoming?: boolean;
  search?: string;
}

// API Client with automatic cookie handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const config: RequestInit = {
      credentials: "include", // Always send cookies
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/auth/me");
  }

  async refreshToken(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/refresh", {
      method: "POST",
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  }

  // Google OAuth
  getGoogleAuthUrl(): string {
    return `${this.baseURL}/auth/google`;
  }

  // Fact Checks endpoints
  async getFactChecks(
    params?: FactCheckParams
  ): Promise<PaginatedResponse<FactCheck>> {
    const searchParams = new URLSearchParams();

    const queryString = searchParams.toString();
    const endpoint = `/fact-checks${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<FactCheck>>(endpoint);
  }

  async getFactCheck(slug: string): Promise<ApiResponse<FactCheck>> {
    return this.request<ApiResponse<FactCheck>>(`/fact-checks/${slug}`);
  }

  async getFactCheckStats(): Promise<ApiResponse<FactCheckStats>> {
    return this.request<ApiResponse<FactCheckStats>>("/fact-checks/stats");
  }

  async getRelatedFactChecks(slug: string): Promise<ApiResponse<FactCheck[]>> {
    return this.request<ApiResponse<FactCheck[]>>(
      `/fact-checks/${slug}/related`
    );
  }

  // Events endpoints
  async getEvents(params?: EventParams): Promise<PaginatedResponse<Event>> {
    const searchParams = new URLSearchParams();

    const queryString = searchParams.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<Event>>(endpoint);
  }

  async getEvent(slug: string): Promise<ApiResponse<Event>> {
    return this.request<ApiResponse<Event>>(`/events/${slug}`);
  }

  async registerForEvent(eventId: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(`/events/${eventId}/register`, {
      method: "POST",
    });
  }

  // Helper method for building query strings
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    return searchParams.toString();
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
