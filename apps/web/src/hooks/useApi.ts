import {
  apiClient,
  ApiResponse,
  Event,
  EventParams,
  FactCheck,
  FactCheckParams,
  FactCheckStats,
  PaginatedResponse,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

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
