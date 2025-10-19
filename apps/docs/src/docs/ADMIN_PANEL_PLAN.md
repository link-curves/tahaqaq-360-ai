# 🔐 Admin Panel API Audit & Implementation Plan

## 📊 Current State Analysis

### ✅ Modules with Complete CRUD
| Module | Create | Read | Update | Delete | Status |
|--------|--------|------|--------|--------|--------|
| **Fact Checks** | ✅ POST | ✅ GET | ✅ PATCH | ✅ DELETE | **Complete** |
| **Events** | ✅ POST | ✅ GET | ✅ PATCH | ✅ DELETE | **Complete** |
| **Submissions** | ✅ POST | ✅ GET | ✅ PATCH (status/priority) | ❌ | **Partial** |
| **Users** | ❌ | ✅ GET | ✅ PATCH (admin) | ✅ DELETE (admin) | **Partial** |

### ❌ Modules Missing CRUD Operations
| Module | Create | Read | Update | Delete | Priority |
|--------|--------|------|--------|--------|----------|
| **Research** | ❌ | ✅ GET | ❌ | ❌ | **HIGH** |
| **Courses (Media Literacy)** | ❌ | ✅ GET | ❌ | ❌ | **HIGH** |
| **Lessons** | ❌ | ✅ GET | ❌ | ❌ | **HIGH** |
| **FAQ** | ❌ | ✅ GET | ❌ | ❌ | **MEDIUM** |
| **Certificates** | ❌ | ✅ GET | ❌ | ❌ | **LOW** |
| **Analytics** | N/A | ✅ GET | N/A | N/A | **Complete** |

### 📈 Admin Dashboard Requirements
| Feature | Endpoint | Status |
|---------|----------|--------|
| Platform Statistics | `/admin/dashboard/stats` | ❌ Missing |
| User Analytics | `/admin/dashboard/users-analytics` | ❌ Missing |
| Content Analytics | `/admin/dashboard/content-analytics` | ❌ Missing |
| Recent Activity | `/admin/dashboard/recent-activity` | ❌ Missing |

---

## 🎯 Implementation Plan

### Phase 1: Research Module (HIGH PRIORITY)
**Endpoints to Add:**
- `POST /research` - Create research article
- `PATCH /research/:slug` - Update research article
- `DELETE /research/:slug` - Delete research article
- `PATCH /research/:slug/publish` - Toggle publish status
- `PATCH /research/:slug/feature` - Toggle featured status

### Phase 2: Media Literacy Module (HIGH PRIORITY)
**Courses:**
- `POST /media-literacy/courses` - Create course
- `PATCH /media-literacy/courses/:slug` - Update course
- `DELETE /media-literacy/courses/:slug` - Delete course
- `PATCH /media-literacy/courses/:slug/publish` - Toggle publish
- `POST /media-literacy/courses/:courseId/lessons` - Add lesson
- `PATCH /media-literacy/lessons/:id` - Update lesson
- `DELETE /media-literacy/lessons/:id` - Delete lesson
- `PATCH /media-literacy/lessons/:id/reorder` - Reorder lessons

### Phase 3: FAQ Module (MEDIUM PRIORITY)
**Endpoints to Add:**
- `POST /faq` - Create FAQ
- `PATCH /faq/:id` - Update FAQ
- `DELETE /faq/:id` - Delete FAQ
- `PATCH /faq/:id/reorder` - Reorder FAQs

### Phase 4: Admin Dashboard (HIGH PRIORITY)
**Endpoints to Add:**
- `GET /admin/dashboard/stats` - Overall platform stats
- `GET /admin/dashboard/users-analytics` - User growth, activity
- `GET /admin/dashboard/content-analytics` - Content metrics
- `GET /admin/dashboard/recent-activity` - Recent actions

### Phase 5: Submissions Enhancement
**Endpoints to Add:**
- `DELETE /submissions/:id` - Delete submission

---

## 🔨 Technical Implementation Details

### DTOs Required

#### Research DTOs
```typescript
CreateResearchDto {
  title, slug, content, summary, category, authors,
  tags, featuredImage, isPublished, isFeatured, 
  metaTitle, metaDescription
}

UpdateResearchDto extends CreateResearchDto {}
```

#### Course DTOs
```typescript
CreateCourseDto {
  title, slug, description, difficulty, estimatedHours,
  category, objectives, prerequisites, featuredImage,
  isPublished, isFeatured
}

UpdateCourseDto extends CreateCourseDto {}

CreateLessonDto {
  title, content, duration, order, videoUrl, resources
}

UpdateLessonDto extends CreateLessonDto {}
```

#### FAQ DTOs
```typescript
CreateFaqDto {
  question, answer, category, order, isPublished
}

UpdateFaqDto extends CreateFaqDto {}
```

---

## 🔐 Security & Permissions

All admin endpoints require:
- `@UseGuards(RolesGuard)`
- `@Roles(Role.ADMIN, Role.MODERATOR)` or `@Roles(Role.ADMIN, Role.SUPER_ADMIN)`
- `@ApiBearerAuth('JWT-auth')`

---

## 📱 Frontend Pages Required

### Admin Dashboard Structure
```
/admin
├── /dashboard (overview + stats)
├── /fact-checks (list, create, edit, delete)
├── /research (list, create, edit, delete)
├── /events (list, create, edit, delete)
├── /courses (list, create, edit, delete)
│   └── /:id/lessons (manage lessons)
├── /faq (list, create, edit, delete)
├── /submissions (list, review, approve/reject)
├── /users (list, manage roles, ban)
└── /analytics (detailed stats)
```

---

## 📦 Files to Create/Update

### Backend
- [ ] `apps/api/src/modules/research/dto/create-research.dto.ts`
- [ ] `apps/api/src/modules/research/research.controller.ts` (add CRUD)
- [ ] `apps/api/src/modules/media-literacy/dto/course.dto.ts`
- [ ] `apps/api/src/modules/media-literacy/dto/lesson.dto.ts`
- [ ] `apps/api/src/modules/media-literacy/media-literacy.controller.ts` (add CRUD)
- [ ] `apps/api/src/modules/faq/faq.controller.ts` (add CRUD)
- [ ] `apps/api/src/modules/faq/dto/faq.dto.ts`
- [ ] `apps/api/src/modules/admin/admin.controller.ts` (add dashboard)
- [ ] `apps/api/src/modules/submissions/submissions.controller.ts` (add DELETE)

### Frontend
- [ ] `apps/web/src/lib/api.ts` (add all admin endpoints)
- [ ] `apps/web/src/pages/admin/Dashboard.tsx`
- [ ] `apps/web/src/pages/admin/FactChecks.tsx`
- [ ] `apps/web/src/pages/admin/Research.tsx`
- [ ] `apps/web/src/pages/admin/Events.tsx`
- [ ] `apps/web/src/pages/admin/Courses.tsx`
- [ ] `apps/web/src/pages/admin/CourseEditor.tsx`
- [ ] `apps/web/src/pages/admin/FAQ.tsx`
- [ ] `apps/web/src/pages/admin/Submissions.tsx`
- [ ] `apps/web/src/pages/admin/Users.tsx`
- [ ] `apps/web/src/pages/admin/Analytics.tsx`
- [ ] `apps/web/src/components/admin/DataTable.tsx` (reusable)
- [ ] `apps/web/src/components/admin/ContentEditor.tsx` (reusable)
- [ ] `apps/web/src/components/admin/StatsCard.tsx` (reusable)

---

## ⏱️ Estimated Timeline

- **Phase 1 (Research):** 2-3 hours
- **Phase 2 (Media Literacy):** 3-4 hours  
- **Phase 3 (FAQ):** 1-2 hours
- **Phase 4 (Dashboard):** 2-3 hours
- **Phase 5 (Frontend):** 6-8 hours

**Total:** ~15-20 hours

---

## 🚀 Next Steps

1. ✅ Audit complete
2. ⏳ Implement Research CRUD
3. ⏳ Implement Media Literacy CRUD
4. ⏳ Implement FAQ CRUD
5. ⏳ Implement Admin Dashboard
6. ⏳ Build Frontend Admin Pages
