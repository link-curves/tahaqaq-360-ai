// Admin API Client - Separate from main API client to keep files manageable
import type { components } from "./api-schema.gen";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// ==================== TYPES ====================

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

export interface DashboardStats {
  users: {
    total: number;
    newThisMonth: number;
    activeLastWeek: number;
    newToday: number;
  };
  content: {
    factChecks: {
      total: number;
      published: number;
      draft: number;
      newToday: number;
    };
    research: {
      total: number;
      published: number;
      draft: number;
    };
    events: {
      total: number;
      upcoming: number;
    };
    courses: {
      total: number;
      published: number;
      draft: number;
    };
    faqs: {
      total: number;
    };
  };
  engagement: {
    submissions: {
      total: number;
      pending: number;
      verified: number;
      rejected: number;
      newToday: number;
    };
    comments: {
      total: number;
    };
    certificates: {
      total: number;
    };
  };
  timestamp: string;
}

export interface CreateResearchDto {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  authors: string[];
  tags?: string[];
  featuredImage?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateResearchDto extends Partial<CreateResearchDto> {}

export interface Research {
  id: string;
  title: string;
  slug: string;
  fullContent: string;
  summary: string;
  category: string;
  authors: string[];
  tags: string[];
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  title: string;
  slug: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  order?: number;
  learningObjectives?: string[];
  prerequisites?: string[];
  coverImage?: string;
  isPublished?: boolean;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  difficulty: string;
  duration: number;
  order: number;
  isPublished: boolean;
  prerequisites: string[];
  learningObjectives: string[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    lessons: number;
    enrollments: number;
  };
}

export interface CreateLessonDto {
  title: string;
  content: string;
  duration: number;
  order: number;
  videoUrl?: string;
  resources?: any[];
}

export interface UpdateLessonDto extends Partial<CreateLessonDto> {}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  resources: any[];
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFaqDto {
  question: string;
  answer: string;
  category: string;
  order?: number;
  isPublished?: boolean;
}

export interface UpdateFaqDto extends Partial<CreateFaqDto> {}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: ContentStatusValue;
  publishedAt?: string;
  views: number;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: string;
  category: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: ContentStatusValue;
  readTime?: number;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> {}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ==================== HELPER FUNCTION ====================

const getAuthHeaders = (): HeadersInit => {
  return {
    "Content-Type": "application/json",
  };
};

// Fetch options that include credentials for cookie-based auth
const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    credentials: "include", // Always include cookies
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An error occurred",
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ==================== DASHBOARD API ====================

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(
      `${API_BASE_URL}/admin/dashboard/stats`,
      getFetchOptions()
    );
    return handleResponse<DashboardStats>(response);
  },
};

// ==================== RESEARCH API ====================

export const researchApi = {
  create: async (data: CreateResearchDto): Promise<Research> => {
    const response = await fetch(
      `${API_BASE_URL}/research`,
      getFetchOptions({
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
    );
    return handleResponse<Research>(response);
  },

  update: async (slug: string, data: UpdateResearchDto): Promise<Research> => {
    const response = await fetch(
      `${API_BASE_URL}/research/${slug}`,
      getFetchOptions({
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      })
    );
    return handleResponse<Research>(response);
  },

  delete: async (slug: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/research/${slug}`,
      getFetchOptions({
        method: "DELETE",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      })
    );
    return handleResponse<void>(response);
  },

  togglePublish: async (slug: string): Promise<Research> => {
    const response = await fetch(
      `${API_BASE_URL}/research/${slug}/publish`,
      getFetchOptions({
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      })
    );
    return handleResponse<Research>(response);
  },

  toggleFeatured: async (slug: string): Promise<Research> => {
    const response = await fetch(
      `${API_BASE_URL}/research/${slug}/feature`,
      getFetchOptions({
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      })
    );
    return handleResponse<Research>(response);
  },
};

// ==================== COURSES API ====================

export const coursesApi = {
  create: async (data: CreateCourseDto): Promise<Course> => {
    const response = await fetch(`${API_BASE_URL}/media-literacy/courses`, {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<Course>(response);
  },

  update: async (slug: string, data: UpdateCourseDto): Promise<Course> => {
    const response = await fetch(
      `${API_BASE_URL}/media-literacy/courses/${slug}`,
      {
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),

        body: JSON.stringify(data),
      }
    );
    return handleResponse<Course>(response);
  },

  delete: async (slug: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/media-literacy/courses/${slug}`,
      {
        method: "DELETE",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },

  togglePublish: async (slug: string): Promise<Course> => {
    const response = await fetch(
      `${API_BASE_URL}/media-literacy/courses/${slug}/publish`,
      {
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<Course>(response);
  },

  // Lessons
  createLesson: async (
    courseSlug: string,
    data: CreateLessonDto
  ): Promise<Lesson> => {
    const response = await fetch(
      `${API_BASE_URL}/media-literacy/courses/${courseSlug}/lessons`,
      {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),

        body: JSON.stringify(data),
      }
    );
    return handleResponse<Lesson>(response);
  },

  updateLesson: async (
    lessonId: string,
    data: UpdateLessonDto
  ): Promise<Lesson> => {
    const response = await fetch(
      `${API_BASE_URL}/media-literacy/lessons/${lessonId}`,
      {
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),

        body: JSON.stringify(data),
      }
    );
    return handleResponse<Lesson>(response);
  },

  deleteLesson: async (lessonId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/media-literacy/lessons/${lessonId}`,
      {
        method: "DELETE",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },
};

// ==================== FAQ API ====================

export const faqApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: FAQ[]; meta: any }> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/faq?${query}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: FAQ[]; meta: any }>(response);
  },

  create: async (data: CreateFaqDto): Promise<FAQ> => {
    const response = await fetch(`${API_BASE_URL}/faq`, {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<FAQ>(response);
  },

  update: async (id: string, data: UpdateFaqDto): Promise<FAQ> => {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      method: "PATCH",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<FAQ>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      method: "DELETE",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  togglePublish: async (id: string): Promise<FAQ> => {
    const response = await fetch(`${API_BASE_URL}/faq/${id}/publish`, {
      method: "PATCH",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
    });
    return handleResponse<FAQ>(response);
  },
};

// ==================== BLOG API ====================

export const blogApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    category?: string;
    tag?: string;
    status?: ContentStatusValue;
    search?: string;
    isFeatured?: boolean;
    author?: string;
  }): Promise<{ data: BlogPost[]; meta: any }> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.sortBy) query.append("sortBy", params.sortBy);
    if (params?.sortOrder) query.append("sortOrder", params.sortOrder);
    if (params?.category) query.append("category", params.category);
    if (params?.tag) query.append("tag", params.tag);
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);
    if (params?.isFeatured !== undefined)
      query.append("isFeatured", params.isFeatured.toString());
    if (params?.author) query.append("author", params.author);

    const response = await fetch(`${API_BASE_URL}/blog?${query}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: BlogPost[]; meta: any }>(response);
  },

  getBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blog/${slug}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<BlogPost>(response);
  },

  create: async (data: CreateBlogPostDto): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<BlogPost>(response);
  },

  update: async (id: string, data: UpdateBlogPostDto): Promise<BlogPost> => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "PATCH",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<BlogPost>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "DELETE",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  getCategories: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/blog/categories`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<string[]>(response);
  },

  getTags: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/blog/tags`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<string[]>(response);
  },
};

// ==================== SUBMISSIONS API ====================

export const submissionsApi = {
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: "DELETE",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};

// ==================== EVENTS API ====================

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: EventTypeValue;
  status: "DRAFT" | "PUBLISHED" | "CANCELLED";
  startDate: string;
  endDate: string;
  location: string;
  onlineLink?: string;
  capacity: number;
  registeredCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  title: string;
  slug: string;
  description: string;
  type: EventTypeValue;
  startDate: string;
  endDate: string;
  location: string;
  onlineLink?: string;
  capacity: number;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: "DRAFT" | "PUBLISHED" | "CANCELLED";
}

export const eventsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<{ data: Event[]; meta: any }> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.type) query.append("type", params.type);
    if (params?.status) query.append("status", params.status);

    const response = await fetch(`${API_BASE_URL}/events?${query}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: Event[]; meta: any }>(response);
  },

  getOne: async (slug: string): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events/${slug}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<Event>(response);
  },

  create: async (data: CreateEventDto): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<Event>(response);
  },

  update: async (slug: string, data: UpdateEventDto): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events/${slug}`, {
      method: "PATCH",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<Event>(response);
  },

  delete: async (slug: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/events/${slug}`, {
      method: "DELETE",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};

// ==================== FACT CHECKS API ====================

/**
 * Fact-check types are GENERATED from the API's OpenAPI document — regenerate
 * with `pnpm --filter api gen:api-types`. Everything else in this file is still
 * hand-written and can silently drift (ADR-0003).
 */
export type FactCheckListItem =
  components["schemas"]["FactCheckListItemDto"];
export type FactCheckDetail = components["schemas"]["FactCheckDetailDto"];
export type Evidence = components["schemas"]["EvidenceDto"];

/** A fact-check article is per-locale; a slug is unique WITHIN a locale. */
export type Locale = "AR" | "EN";

/**
 * @deprecated Authoring moved to the Claim / review / per-locale-article model
 * and is implemented in Phase 3 with the ADR-0006 revision invariants. The
 * create/update/delete endpoints below currently return 501 by design — a write
 * path that skipped those invariants would corrupt the editorial record.
 */
export interface CreateFactCheckDto {
  title: string;
  slug: string;
  claim: string;
  verdict: VeracityRatingValue;
  explanation: string;
  sources?: any[];
  claimDate?: string;
  featured?: boolean;
}

/**
 * @deprecated The flat FactCheck shape is gone — a fact-check is a Claim, a
 * review holding the shared verdict and evidence, and one article per locale
 * (ADR-0002). Kept as an alias so the existing admin screen compiles; the
 * authoring UI is rebuilt in Phase 4 against FactCheckDetail.
 */
export type FactCheck = FactCheckListItem;

export interface UpdateFactCheckDto extends Partial<CreateFactCheckDto> {}

export const factChecksApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    verdict?: string;
  }): Promise<{ data: FactCheckListItem[]; meta: any }> => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.verdict) query.append("verdict", params.verdict);

    const response = await fetch(`${API_BASE_URL}/fact-checks?${query}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<{ data: FactCheckListItem[]; meta: any }>(response);
  },

  getOne: async (slug: string, locale: Locale = "AR"): Promise<FactCheckDetail> => {
    const response = await fetch(`${API_BASE_URL}/fact-checks/${locale}/${slug}`, {
      credentials: "include",
      headers: getAuthHeaders(),
    });
    return handleResponse<FactCheckDetail>(response);
  },

  /** Returns 501 until Phase 3. */
  create: async (data: CreateFactCheckDto): Promise<FactCheckDetail> => {
    const response = await fetch(`${API_BASE_URL}/fact-checks`, {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<FactCheckDetail>(response);
  },

  update: async (
    slug: string,
    data: UpdateFactCheckDto
  ): Promise<FactCheckDetail> => {
    const response = await fetch(`${API_BASE_URL}/fact-checks/${slug}`, {
      method: "PATCH",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),

      body: JSON.stringify(data),
    });
    return handleResponse<FactCheckDetail>(response);
  },

  delete: async (slug: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/fact-checks/${slug}`, {
      method: "DELETE",
      credentials: "include" as RequestCredentials,
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  /**
   * NOTE: /fact-checks/:slug/toggle-featured does not exist on the API.
   * `isFeatured` is a per-locale article field now and will be set through the
   * Phase 3 authoring endpoints.
   */
  toggleFeatured: async (slug: string): Promise<FactCheckDetail> => {
    const response = await fetch(
      `${API_BASE_URL}/fact-checks/${slug}/toggle-featured`,
      {
        method: "PATCH",
        credentials: "include" as RequestCredentials,
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<FactCheckDetail>(response);
  },
};
