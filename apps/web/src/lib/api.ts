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

// Enums - Using string literal unions for maximum compatibility
export type VeracityRatingValue =
  | "TRUE"
  | "MOSTLY_TRUE"
  | "HALF_TRUE"
  | "MOSTLY_FALSE"
  | "FALSE"
  | "UNVERIFIABLE"
  | "SATIRE"
  | "MISLEADING";

// Const object for accessing values at runtime
export const VeracityRating = {
  TRUE: "TRUE" as const,
  MOSTLY_TRUE: "MOSTLY_TRUE" as const,
  HALF_TRUE: "HALF_TRUE" as const,
  MOSTLY_FALSE: "MOSTLY_FALSE" as const,
  FALSE: "FALSE" as const,
  UNVERIFIABLE: "UNVERIFIABLE" as const,
  SATIRE: "SATIRE" as const,
  MISLEADING: "MISLEADING" as const,
};

export type EventTypeValue =
  | "WORKSHOP"
  | "WEBINAR"
  | "EXHIBITION"
  | "CONFERENCE"
  | "TRAINING";

export const EventType = {
  WORKSHOP: "WORKSHOP" as const,
  WEBINAR: "WEBINAR" as const,
  EXHIBITION: "EXHIBITION" as const,
  CONFERENCE: "CONFERENCE" as const,
  TRAINING: "TRAINING" as const,
};

export type EventStatusValue =
  | "UPCOMING"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

export const EventStatus = {
  UPCOMING: "UPCOMING" as const,
  ONGOING: "ONGOING" as const,
  COMPLETED: "COMPLETED" as const,
  CANCELLED: "CANCELLED" as const,
};

export type ContentStatusValue =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "UNDER_REVIEW";

export const ContentStatus = {
  DRAFT: "DRAFT" as const,
  PUBLISHED: "PUBLISHED" as const,
  ARCHIVED: "ARCHIVED" as const,
  UNDER_REVIEW: "UNDER_REVIEW" as const,
};

export type SubmissionTypeValue = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "LINK";

export const SubmissionType = {
  TEXT: "TEXT" as const,
  IMAGE: "IMAGE" as const,
  VIDEO: "VIDEO" as const,
  AUDIO: "AUDIO" as const,
  LINK: "LINK" as const,
};

export type SubmissionStatusValue =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export const SubmissionStatus = {
  PENDING: "PENDING" as const,
  UNDER_REVIEW: "UNDER_REVIEW" as const,
  APPROVED: "APPROVED" as const,
  REJECTED: "REJECTED" as const,
};

export type CourseDifficultyValue = "Beginner" | "Intermediate" | "Advanced";

export const CourseDifficulty = {
  BEGINNER: "Beginner" as const,
  INTERMEDIATE: "Intermediate" as const,
  ADVANCED: "Advanced" as const,
};

// Fact Check Types
export interface FactCheck {
  id: string;
  title: string;
  slug: string;
  claim: string;
  claimant?: string;
  claimDate?: string;
  verdict: VeracityRatingValue;
  summary: string;
  fullAnalysis: string;
  methodology?: string;
  sources: any[];
  mediaUrls: string[];
  tags: string[];
  views: number;
  shares: number;
  status: ContentStatusValue;
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
  type: EventTypeValue;
  status: EventStatusValue;
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

// Course Types (Media Literacy)
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  difficulty: CourseDifficultyValue;
  duration: number; // in minutes
  order: number;
  isPublished: boolean;
  prerequisites: string[];
  learningObjectives: string[];
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  _count?: {
    enrollments: number;
  };
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  resources: any[];
  courseId: string;
  createdAt: string;
  updatedAt: string;
  lessonProgress?: LessonProgress[];
}

export interface LessonProgress {
  id: string;
  isCompleted: boolean;
  completedAt?: string;
  userId: string;
  lessonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  id: string;
  isCompleted: boolean;
  completedAt?: string;
  progress: number;
  lastAccessedAt: string;
  userId: string;
  courseId: string;
  startedAt: string;
  updatedAt: string;
  course?: Course;
  completedLessons?: number;
  totalLessons?: number;
}

// Research Types
export interface Research {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fullContent: string;
  authors: string[];
  category: string;
  tags: string[];
  coverImage?: string;
  attachments: any[];
  status: ContentStatusValue;
  publishedAt?: string;
  views: number;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

// Certificate Types
export interface Certificate {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  userId: string;
  courseId: string;
  recipientName: string;
  issuedDate: string;
  expiryDate?: string;
  pdfUrl?: string;
  createdAt: string;
  course?: Course;
}

// Submission Types
export interface Submission {
  id: string;
  type: SubmissionTypeValue;
  content: string;
  sourceUrl?: string;
  mediaUrls: string[];
  context?: string;
  status: SubmissionStatusValue;
  priority: number;
  submitterId: string;
  submitterEmail?: string;
  isAnonymous: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  factCheck?: {
    id: string;
    title: string;
    slug: string;
  };
  submitter?: User;
}

export interface CreateSubmissionRequest {
  type: SubmissionTypeValue;
  content: string;
  sourceUrl?: string;
  mediaUrls?: string[];
  context?: string;
  isAnonymous?: boolean;
  submitterEmail?: string;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Query Parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FactCheckParams extends PaginationParams {
  verdict?: VeracityRatingValue;
  status?: ContentStatusValue;
  search?: string;
  featured?: boolean;
  isFeatured?: boolean;
}

export interface EventParams extends PaginationParams {
  type?: EventTypeValue;
  status?: EventStatusValue;
  upcoming?: boolean;
  search?: string;
}

export interface CourseParams extends PaginationParams {
  difficulty?: CourseDifficultyValue;
  isPublished?: boolean;
  search?: string;
}

export interface ResearchParams extends PaginationParams {
  category?: string;
  status?: ContentStatusValue;
  search?: string;
}

// Platform Statistics
export interface PlatformStats {
  factChecks: number;
  events: number;
  courses: number;
  research: number;
  users: number;
  submissions: number;
  enrollments: number;
  eventRegistrations: number;
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

      console.log(`[API] ${options.method || "GET"} ${endpoint}:`, {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[API] Error response from ${endpoint}:`, errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log(`[API] Raw response from ${endpoint}:`, result);

      // Unwrap the TransformInterceptor response structure
      // Backend wraps responses as: { success: true, data: T, message?, meta? }
      if (result && typeof result === "object" && "data" in result) {
        // For paginated responses: combine data array with meta pagination fields
        if (result.meta && typeof result.meta === "object") {
          console.log(`[API] Returning paginated response from ${endpoint}:`, {
            data: result.data,
            ...result.meta,
          });
          return {
            data: result.data,
            ...result.meta,
          } as T;
        }

        // For regular responses: just unwrap data
        console.log(`[API] Unwrapped data from ${endpoint}:`, result.data);
        return result.data as T;
      }

      console.log(`[API] Returning result as-is from ${endpoint}:`, result);
      return result;
    } catch (error) {
      console.error(`[API] Request failed for ${endpoint}:`, error);
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

    if (params) {
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.search) searchParams.append("search", params.search);
      if (params.verdict) searchParams.append("verdict", params.verdict);
      if (params.isFeatured !== undefined)
        searchParams.append("isFeatured", params.isFeatured.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/fact-checks${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<FactCheck>>(endpoint);
  }

  async getFactCheck(slug: string): Promise<FactCheck> {
    return this.request<FactCheck>(`/fact-checks/${slug}`);
  }

  async getFactCheckStats(): Promise<FactCheckStats> {
    return this.request<FactCheckStats>("/fact-checks/stats");
  }

  async getRelatedFactChecks(slug: string): Promise<FactCheck[]> {
    return this.request<FactCheck[]>(`/fact-checks/${slug}/related`);
  }

  // Events endpoints
  async getEvents(params?: EventParams): Promise<PaginatedResponse<Event>> {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
      if (params.search) searchParams.append("search", params.search);
      if (params.type) searchParams.append("type", params.type);
      if (params.status) searchParams.append("status", params.status);
      if (params.upcoming !== undefined)
        searchParams.append("upcoming", params.upcoming.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/events${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<Event>>(endpoint);
  }

  async getEvent(slug: string): Promise<Event> {
    return this.request<Event>(`/events/${slug}`);
  }

  async registerForEvent(eventId: string): Promise<any> {
    return this.request<any>(`/events/${eventId}/register`, {
      method: "POST",
    });
  }

  // Courses endpoints (Media Literacy)
  async getCourses(params?: CourseParams): Promise<PaginatedResponse<Course>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.difficulty)
      searchParams.append("difficulty", params.difficulty);
    if (params?.isPublished !== undefined)
      searchParams.append("isPublished", params.isPublished.toString());

    const queryString = searchParams.toString();
    const endpoint = `/media-literacy/courses${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<Course>>(endpoint);
  }

  async getCourse(slug: string): Promise<Course> {
    return this.request<Course>(`/media-literacy/courses/${slug}`);
  }

  async enrollInCourse(courseId: string): Promise<any> {
    return this.request<any>(`/media-literacy/courses/${courseId}/enroll`, {
      method: "POST",
    });
  }

  async getCourseProgress(courseId: string): Promise<CourseProgress> {
    return this.request<CourseProgress>(
      `/media-literacy/courses/${courseId}/progress`
    );
  }

  async markLessonComplete(
    lessonId: string,
    isCompleted: boolean = true
  ): Promise<any> {
    return this.request<any>(`/media-literacy/lessons/${lessonId}/complete`, {
      method: "POST",
      body: JSON.stringify({ isCompleted }),
    });
  }

  async getMyCourses(): Promise<any[]> {
    return this.request<any[]>(`/media-literacy/my-courses`);
  }

  // Research endpoints
  async getResearch(
    params?: ResearchParams
  ): Promise<PaginatedResponse<Research>> {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
      if (params.search) searchParams.append("search", params.search);
      if (params.category) searchParams.append("category", params.category);
      if (params.status) searchParams.append("status", params.status);
    }

    const queryString = searchParams.toString();
    const endpoint = `/research${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<Research>>(endpoint);
  }

  async getResearchArticle(slug: string): Promise<Research> {
    return this.request<Research>(`/research/${slug}`);
  }

  // Certificates endpoints
  async getUserCertificates(): Promise<Certificate[]> {
    return this.request<Certificate[]>("/certificates/my-certificates");
  }

  async verifyCertificate(
    verificationCode: string
  ): Promise<ApiResponse<Certificate>> {
    return this.request<ApiResponse<Certificate>>(
      `/certificates/verify/${verificationCode}`
    );
  }

  // Analytics endpoints
  async getPlatformStats(): Promise<ApiResponse<PlatformStats>> {
    return this.request<ApiResponse<PlatformStats>>(
      "/analytics/platform-stats"
    );
  }

  // Submission endpoints
  async createSubmission(
    data: CreateSubmissionRequest
  ): Promise<ApiResponse<Submission>> {
    return this.request<ApiResponse<Submission>>("/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMySubmissions(
    params?: PaginationParams
  ): Promise<PaginatedResponse<Submission>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/submissions/my-submissions${
      queryString ? `?${queryString}` : ""
    }`;

    return this.request<PaginatedResponse<Submission>>(endpoint);
  }

  async getSubmission(id: string): Promise<ApiResponse<Submission>> {
    return this.request<ApiResponse<Submission>>(`/submissions/${id}`);
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
