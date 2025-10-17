"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.CourseDifficulty = exports.SubmissionStatus = exports.SubmissionType = exports.ContentStatus = exports.EventStatus = exports.EventType = exports.VeracityRating = exports.API_BASE_URL = void 0;
exports.API_BASE_URL = process.env.VITE_API_URL || "http://localhost:5000/api/v1";
var VeracityRating;
(function (VeracityRating) {
    VeracityRating["TRUE"] = "TRUE";
    VeracityRating["MOSTLY_TRUE"] = "MOSTLY_TRUE";
    VeracityRating["HALF_TRUE"] = "HALF_TRUE";
    VeracityRating["MOSTLY_FALSE"] = "MOSTLY_FALSE";
    VeracityRating["FALSE"] = "FALSE";
    VeracityRating["UNVERIFIABLE"] = "UNVERIFIABLE";
    VeracityRating["SATIRE"] = "SATIRE";
    VeracityRating["MISLEADING"] = "MISLEADING";
})(VeracityRating || (exports.VeracityRating = VeracityRating = {}));
var EventType;
(function (EventType) {
    EventType["WORKSHOP"] = "WORKSHOP";
    EventType["WEBINAR"] = "WEBINAR";
    EventType["EXHIBITION"] = "EXHIBITION";
    EventType["CONFERENCE"] = "CONFERENCE";
    EventType["TRAINING"] = "TRAINING";
})(EventType || (exports.EventType = EventType = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["UPCOMING"] = "UPCOMING";
    EventStatus["ONGOING"] = "ONGOING";
    EventStatus["COMPLETED"] = "COMPLETED";
    EventStatus["CANCELLED"] = "CANCELLED";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var ContentStatus;
(function (ContentStatus) {
    ContentStatus["DRAFT"] = "DRAFT";
    ContentStatus["PUBLISHED"] = "PUBLISHED";
    ContentStatus["ARCHIVED"] = "ARCHIVED";
    ContentStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
})(ContentStatus || (exports.ContentStatus = ContentStatus = {}));
var SubmissionType;
(function (SubmissionType) {
    SubmissionType["TEXT"] = "TEXT";
    SubmissionType["IMAGE"] = "IMAGE";
    SubmissionType["VIDEO"] = "VIDEO";
    SubmissionType["AUDIO"] = "AUDIO";
    SubmissionType["LINK"] = "LINK";
})(SubmissionType || (exports.SubmissionType = SubmissionType = {}));
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PENDING"] = "PENDING";
    SubmissionStatus["UNDER_REVIEW"] = "UNDER_REVIEW";
    SubmissionStatus["APPROVED"] = "APPROVED";
    SubmissionStatus["REJECTED"] = "REJECTED";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var CourseDifficulty;
(function (CourseDifficulty) {
    CourseDifficulty["BEGINNER"] = "Beginner";
    CourseDifficulty["INTERMEDIATE"] = "Intermediate";
    CourseDifficulty["ADVANCED"] = "Advanced";
})(CourseDifficulty || (exports.CourseDifficulty = CourseDifficulty = {}));
class ApiClient {
    baseURL;
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultHeaders = {
            "Content-Type": "application/json",
        };
        const config = {
            credentials: "include",
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
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    }
    async login(credentials) {
        return this.request("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
        });
    }
    async register(userData) {
        return this.request("/auth/signup", {
            method: "POST",
            body: JSON.stringify(userData),
        });
    }
    async getCurrentUser() {
        return this.request("/auth/me");
    }
    async refreshToken() {
        return this.request("/auth/refresh", {
            method: "POST",
        });
    }
    async logout() {
        return this.request("/auth/logout", {
            method: "POST",
        });
    }
    getGoogleAuthUrl() {
        return `${this.baseURL}/auth/google`;
    }
    async getFactChecks(params) {
        const searchParams = new URLSearchParams();
        const queryString = searchParams.toString();
        const endpoint = `/fact-checks${queryString ? `?${queryString}` : ""}`;
        return this.request(endpoint);
    }
    async getFactCheck(slug) {
        return this.request(`/fact-checks/${slug}`);
    }
    async getFactCheckStats() {
        return this.request("/fact-checks/stats");
    }
    async getRelatedFactChecks(slug) {
        return this.request(`/fact-checks/${slug}/related`);
    }
    async getEvents(params) {
        const searchParams = new URLSearchParams();
        const queryString = searchParams.toString();
        const endpoint = `/events${queryString ? `?${queryString}` : ""}`;
        return this.request(endpoint);
    }
    async getEvent(slug) {
        return this.request(`/events/${slug}`);
    }
    async registerForEvent(eventId) {
        return this.request(`/events/${eventId}/register`, {
            method: "POST",
        });
    }
    async getCourses(params) {
        const searchParams = new URLSearchParams();
        if (params?.search)
            searchParams.append("search", params.search);
        if (params?.difficulty)
            searchParams.append("difficulty", params.difficulty);
        if (params?.isPublished !== undefined)
            searchParams.append("isPublished", params.isPublished.toString());
        const queryString = searchParams.toString();
        const endpoint = `/media-literacy/courses${queryString ? `?${queryString}` : ""}`;
        return this.request(endpoint);
    }
    async getCourse(slug) {
        return this.request(`/media-literacy/courses/${slug}`);
    }
    async enrollInCourse(courseId) {
        return this.request(`/media-literacy/courses/${courseId}/enroll`, {
            method: "POST",
        });
    }
    async getResearch(params) {
        const searchParams = new URLSearchParams();
        if (params?.search)
            searchParams.append("search", params.search);
        if (params?.category)
            searchParams.append("category", params.category);
        if (params?.status)
            searchParams.append("status", params.status);
        const queryString = searchParams.toString();
        const endpoint = `/research${queryString ? `?${queryString}` : ""}`;
        return this.request(endpoint);
    }
    async getResearchArticle(slug) {
        return this.request(`/research/${slug}`);
    }
    async getUserCertificates() {
        return this.request("/certificates/my-certificates");
    }
    async verifyCertificate(verificationCode) {
        return this.request(`/certificates/verify/${verificationCode}`);
    }
    async getPlatformStats() {
        return this.request("/analytics/platform-stats");
    }
    async createSubmission(data) {
        return this.request("/submissions", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
    async getMySubmissions(params) {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.append("page", params.page.toString());
        if (params?.limit)
            searchParams.append("limit", params.limit.toString());
        const queryString = searchParams.toString();
        const endpoint = `/submissions/my-submissions${queryString ? `?${queryString}` : ""}`;
        return this.request(endpoint);
    }
    async getSubmission(id) {
        return this.request(`/submissions/${id}`);
    }
    buildQueryString(params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                searchParams.append(key, value.toString());
            }
        });
        return searchParams.toString();
    }
}
exports.apiClient = new ApiClient(exports.API_BASE_URL);
//# sourceMappingURL=api.js.map