import { EventType, VeracityRating } from "@/lib/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export const formatDate = (
  dateString: string,
  locale: string = "ar-SA"
): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (
  dateString: string,
  locale: string = "ar-SA"
): string => {
  const date = new Date(dateString);
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getRelativeTime = (
  dateString: string,
  locale: string = "ar-SA"
): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "منذ لحظات";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `منذ ${minutes} ${minutes === 1 ? "دقيقة" : "دقائق"}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `منذ ${hours} ${hours === 1 ? "ساعة" : "ساعات"}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `منذ ${days} ${days === 1 ? "يوم" : "أيام"}`;
  } else {
    return formatDate(dateString, locale);
  }
};

// Veracity rating utilities
export const getVeracityLabel = (rating: VeracityRating): string => {
  const labels: Record<VeracityRating, string> = {
    [VeracityRating.TRUE]: "صحيح",
    [VeracityRating.MOSTLY_TRUE]: "صحيح إلى حد كبير",
    [VeracityRating.HALF_TRUE]: "صحيح جزئياً",
    [VeracityRating.MOSTLY_FALSE]: "خاطئ إلى حد كبير",
    [VeracityRating.FALSE]: "خاطئ",
    [VeracityRating.UNVERIFIABLE]: "غير قابل للتحقق",
    [VeracityRating.SATIRE]: "ساخر",
    [VeracityRating.MISLEADING]: "مضلل",
  };
  return labels[rating] || "غير محدد";
};

export const getVeracityColor = (rating: VeracityRating): string => {
  const colors: Record<VeracityRating, string> = {
    [VeracityRating.TRUE]: "text-green-600 bg-green-100",
    [VeracityRating.MOSTLY_TRUE]: "text-green-500 bg-green-50",
    [VeracityRating.HALF_TRUE]: "text-yellow-600 bg-yellow-100",
    [VeracityRating.MOSTLY_FALSE]: "text-orange-600 bg-orange-100",
    [VeracityRating.FALSE]: "text-red-600 bg-red-100",
    [VeracityRating.UNVERIFIABLE]: "text-gray-600 bg-gray-100",
    [VeracityRating.SATIRE]: "text-purple-600 bg-purple-100",
    [VeracityRating.MISLEADING]: "text-red-500 bg-red-50",
  };
  return colors[rating] || "text-gray-600 bg-gray-100";
};

// Event type utilities
export const getEventTypeLabel = (type: EventType): string => {
  const labels: Record<EventType, string> = {
    [EventType.WORKSHOP]: "ورشة عمل",
    [EventType.WEBINAR]: "ندوة عبر الإنترنت",
    [EventType.EXHIBITION]: "معرض",
    [EventType.CONFERENCE]: "مؤتمر",
    [EventType.TRAINING]: "تدريب",
  };
  return labels[type] || "فعالية";
};

export const getEventTypeColor = (type: EventType): string => {
  const colors: Record<EventType, string> = {
    [EventType.WORKSHOP]: "text-blue-600 bg-blue-100",
    [EventType.WEBINAR]: "text-green-600 bg-green-100",
    [EventType.EXHIBITION]: "text-purple-600 bg-purple-100",
    [EventType.CONFERENCE]: "text-red-600 bg-red-100",
    [EventType.TRAINING]: "text-orange-600 bg-orange-100",
  };
  return colors[type] || "text-gray-600 bg-gray-100";
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export const stripHtml = (html: string): string => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

// Number formatting
export const formatNumber = (num: number, locale: string = "ar-SA"): string => {
  return num.toLocaleString(locale);
};

export const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return Math.floor(num / 1000) + "ك";
  return Math.floor(num / 1000000) + "م";
};

// URL utilities
export const getImageUrl = (path?: string): string => {
  if (!path) return "/placeholder-image.jpg";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_API_URL?.replace("/api/v1", "") || "http://localhost:5000"}${path}`;
};

// Content utilities
export const generateExcerpt = (
  content: string,
  wordLimit: number = 30
): string => {
  const plainText = stripHtml(content);
  const words = plainText.split(" ");
  if (words.length <= wordLimit) return plainText;
  return words.slice(0, wordLimit).join(" ") + "...";
};
