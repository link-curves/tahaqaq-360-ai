-- CreateTable
CREATE TABLE "training_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "organization" TEXT NOT NULL,
    "position" TEXT,
    "trainingTopic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3),
    "alternativeDate" TIMESTAMP(3),
    "expectedAttendees" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "targetAudience" TEXT,
    "specificNeeds" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_requests_status_idx" ON "training_requests"("status");

-- CreateIndex
CREATE INDEX "training_requests_email_idx" ON "training_requests"("email");

-- CreateIndex
CREATE INDEX "training_requests_createdAt_idx" ON "training_requests"("createdAt");
