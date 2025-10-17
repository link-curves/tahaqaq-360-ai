import {
  apiClient,
  ApiResponse,
  Certificate,
  Course,
  CourseParams,
  CreateSubmissionRequest,
  Event,
  EventParams,
  FactCheck,
  FactCheckParams,
  FactCheckStats,
  PaginatedResponse,
  PaginationParams,
  PlatformStats,
  Research,
  ResearchParams,
  Submission,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fact Checks Hooks
export const useFactChecks = (params?: FactCheckParams) => {
  return useQuery<PaginatedResponse<FactCheck>>({
    queryKey: ["factChecks", params],
    queryFn: () => apiClient.getFactChecks(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useFactCheck = (slug: string) => {
  return useQuery<ApiResponse<FactCheck>>({
    queryKey: ["factCheck", slug],
    queryFn: () => apiClient.getFactCheck(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFactCheckStats = () => {
  return useQuery<ApiResponse<FactCheckStats>>({
    queryKey: ["factCheckStats"],
    queryFn: () => apiClient.getFactCheckStats(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useRelatedFactChecks = (slug: string) => {
  return useQuery<ApiResponse<FactCheck[]>>({
    queryKey: ["relatedFactChecks", slug],
    queryFn: () => apiClient.getRelatedFactChecks(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 429 (Too Many Requests) or 404
      if (
        error?.message?.includes("Too Many Requests") ||
        error?.status === 429
      ) {
        return false;
      }
      if (error?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Events Hooks
export const useEvents = (params?: EventParams) => {
  return useQuery<PaginatedResponse<Event>>({
    queryKey: ["events", params],
    queryFn: () => apiClient.getEvents(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEvent = (slug: string) => {
  return useQuery<ApiResponse<Event>>({
    queryKey: ["event", slug],
    queryFn: () => apiClient.getEvent(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Specialized hooks for home page
export const useFeaturedFactChecks = (limit: number = 6) => {
  // Use basic query without filters due to backend validation issues
  return useFactChecks();
};

export const useUpcomingEvents = (limit: number = 3) => {
  // Use basic query without filters due to backend validation issues
  return useEvents();
};

export const useLatestFactChecks = (limit: number = 4) => {
  // Use basic query without filters due to backend validation issues
  return useFactChecks();
};

// Courses Hooks (Media Literacy)
export const useCourses = (params?: CourseParams) => {
  return useQuery<PaginatedResponse<Course>>({
    queryKey: ["courses", params],
    queryFn: () => apiClient.getCourses(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCourse = (slug: string) => {
  return useQuery<ApiResponse<Course>>({
    queryKey: ["course", slug],
    queryFn: () => apiClient.getCourse(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useFeaturedCourses = (limit: number = 6) => {
  return useCourses({ isPublished: true });
};

// Research Hooks
export const useResearch = (params?: ResearchParams) => {
  return useQuery<PaginatedResponse<Research>>({
    queryKey: ["research", params],
    queryFn: () => apiClient.getResearch(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useResearchArticle = (slug: string) => {
  return useQuery<ApiResponse<Research>>({
    queryKey: ["research", slug],
    queryFn: () => apiClient.getResearchArticle(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useLatestResearch = (limit: number = 6) => {
  return useResearch();
};

// Certificates Hooks
export const useUserCertificates = () => {
  return useQuery<ApiResponse<Certificate[]>>({
    queryKey: ["userCertificates"],
    queryFn: () => apiClient.getUserCertificates(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useVerifyCertificate = (verificationCode: string) => {
  return useQuery<ApiResponse<Certificate>>({
    queryKey: ["verifyCertificate", verificationCode],
    queryFn: () => apiClient.verifyCertificate(verificationCode),
    enabled: !!verificationCode && verificationCode.length > 0,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Analytics hooks
export const usePlatformStats = () => {
  return useQuery<ApiResponse<PlatformStats>>({
    queryKey: ["platformStats"],
    queryFn: () => apiClient.getPlatformStats(),
    staleTime: 1000 * 60 * 10, // 10 minutes - stats don't change frequently
  });
};

// Submission Hooks
export const useSubmissions = (params?: PaginationParams) => {
  return useQuery<PaginatedResponse<Submission>>({
    queryKey: ["mySubmissions", params],
    queryFn: () => apiClient.getMySubmissions(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useSubmission = (id: string) => {
  return useQuery<ApiResponse<Submission>>({
    queryKey: ["submission", id],
    queryFn: () => apiClient.getSubmission(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubmissionRequest) =>
      apiClient.createSubmission(data),
    onSuccess: () => {
      // Invalidate submissions list to refetch
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
    },
  });
};
