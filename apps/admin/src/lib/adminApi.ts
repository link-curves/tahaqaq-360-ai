// Admin API Client - Separate from main API client to keep files manageable
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
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
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
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<DashboardStats>(response);
  },
};

// ==================== RESEARCH API ====================

export const researchApi = {
  create: async (data: CreateResearchDto): Promise<Research> => {
    const response = await fetch(`${API_BASE_URL}/research`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Research>(response);
  },

  update: async (slug: string, data: UpdateResearchDto): Promise<Research> => {
    const response = await fetch(`${API_BASE_URL}/research/${slug}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Research>(response);
  },

  delete: async (slug: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/research/${slug}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  togglePublish: async (slug: string): Promise<Research> => {
    const response = await fetch(`${API_BASE_URL}/research/${slug}/publish`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse<Research>(response);
  },

  toggleFeatured: async (slug: string): Promise<Research> => {
    const response = await fetch(`${API_BASE_URL}/research/${slug}/feature`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse<Research>(response);
  },
};

// ==================== COURSES API ====================

export const coursesApi = {
  create: async (data: CreateCourseDto): Promise<Course> => {
    const response = await fetch(`${API_BASE_URL}/media-literacy/courses`, {
      method: "POST",
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
        headers: getAuthHeaders(),
      }
    );
    return handleResponse<void>(response);
  },
};

// ==================== FAQ API ====================

export const faqApi = {
  getAll: async (): Promise<FAQ[]> => {
    const response = await fetch(`${API_BASE_URL}/faq`, {
      headers: getAuthHeaders(),
    });
    const result = await handleResponse<{ data: FAQ[] }>(response);
    return result.data;
  },

  create: async (data: CreateFaqDto): Promise<FAQ> => {
    const response = await fetch(`${API_BASE_URL}/faq`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FAQ>(response);
  },

  update: async (id: string, data: UpdateFaqDto): Promise<FAQ> => {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FAQ>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/faq/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },

  togglePublish: async (id: string): Promise<FAQ> => {
    const response = await fetch(`${API_BASE_URL}/faq/${id}/publish`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });
    return handleResponse<FAQ>(response);
  },
};

// ==================== SUBMISSIONS API ====================

export const submissionsApi = {
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse<void>(response);
  },
};
