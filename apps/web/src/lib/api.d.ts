export declare const API_BASE_URL: string;
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
export declare enum VeracityRating {
  TRUE = 'TRUE',
  MOSTLY_TRUE = 'MOSTLY_TRUE',
  HALF_TRUE = 'HALF_TRUE',
  MOSTLY_FALSE = 'MOSTLY_FALSE',
  FALSE = 'FALSE',
  UNVERIFIABLE = 'UNVERIFIABLE',
  SATIRE = 'SATIRE',
  MISLEADING = 'MISLEADING',
}
export declare enum EventType {
  WORKSHOP = 'WORKSHOP',
  WEBINAR = 'WEBINAR',
  EXHIBITION = 'EXHIBITION',
  CONFERENCE = 'CONFERENCE',
  TRAINING = 'TRAINING',
}
export declare enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
export declare enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}
export declare enum SubmissionType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  LINK = 'LINK',
}
export declare enum SubmissionStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export declare enum CourseDifficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}
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
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  difficulty: CourseDifficulty;
  duration: number;
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
declare class ApiClient {
  private baseURL;
  constructor(baseURL: string);
  private request;
  login(credentials: LoginRequest): Promise<AuthResponse>;
  register(userData: RegisterRequest): Promise<AuthResponse>;
  getCurrentUser(): Promise<{
    user: User;
  }>;
  refreshToken(): Promise<{
    message: string;
  }>;
  logout(): Promise<{
    message: string;
  }>;
  getGoogleAuthUrl(): string;
  getFactChecks(
    params?: FactCheckParams,
  ): Promise<PaginatedResponse<FactCheck>>;
  getFactCheck(slug: string): Promise<ApiResponse<FactCheck>>;
  getFactCheckStats(): Promise<ApiResponse<FactCheckStats>>;
  getRelatedFactChecks(slug: string): Promise<ApiResponse<FactCheck[]>>;
  getEvents(params?: EventParams): Promise<PaginatedResponse<Event>>;
  getEvent(slug: string): Promise<ApiResponse<Event>>;
  registerForEvent(eventId: string): Promise<ApiResponse<any>>;
  getCourses(params?: CourseParams): Promise<PaginatedResponse<Course>>;
  getCourse(slug: string): Promise<ApiResponse<Course>>;
  enrollInCourse(courseId: string): Promise<ApiResponse<any>>;
  getResearch(params?: ResearchParams): Promise<PaginatedResponse<Research>>;
  getResearchArticle(slug: string): Promise<ApiResponse<Research>>;
  getUserCertificates(): Promise<ApiResponse<Certificate[]>>;
  verifyCertificate(
    verificationCode: string,
  ): Promise<ApiResponse<Certificate>>;
  getPlatformStats(): Promise<ApiResponse<PlatformStats>>;
  createSubmission(
    data: CreateSubmissionRequest,
  ): Promise<ApiResponse<Submission>>;
  getMySubmissions(
    params?: PaginationParams,
  ): Promise<PaginatedResponse<Submission>>;
  getSubmission(id: string): Promise<ApiResponse<Submission>>;
  private buildQueryString;
}
export declare const apiClient: ApiClient;
export {};
