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

export enum SubmissionType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  LINK = "LINK",
}

export enum SubmissionStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum CourseDifficulty {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
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

// Course Types (Media Literacy)
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  difficulty: CourseDifficulty;
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
  status: ContentStatus;
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
  type: SubmissionType;
  content: string;
  sourceUrl?: string;
  mediaUrls: string[];
  context?: string;
  status: SubmissionStatus;
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
  type: SubmissionType;
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

export interface CourseParams extends PaginationParams {
  difficulty?: CourseDifficulty;
  isPublished?: boolean;
  search?: string;
}

export interface ResearchParams extends PaginationParams {
  category?: string;
  status?: ContentStatus;
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

  async getCourse(slug: string): Promise<ApiResponse<Course>> {
    return this.request<ApiResponse<Course>>(`/media-literacy/courses/${slug}`);
  }

  async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>(
      `/media-literacy/courses/${courseId}/enroll`,
      {
        method: "POST",
      }
    );
  }

  // Research endpoints
  async getResearch(
    params?: ResearchParams
  ): Promise<PaginatedResponse<Research>> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.status) searchParams.append("status", params.status);

    const queryString = searchParams.toString();
    const endpoint = `/research${queryString ? `?${queryString}` : ""}`;

    return this.request<PaginatedResponse<Research>>(endpoint);
  }

  async getResearchArticle(slug: string): Promise<ApiResponse<Research>> {
    return this.request<ApiResponse<Research>>(`/research/${slug}`);
  }

  // Certificates endpoints
  async getUserCertificates(): Promise<ApiResponse<Certificate[]>> {
    return this.request<ApiResponse<Certificate[]>>(
      "/certificates/my-certificates"
    );
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
