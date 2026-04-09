warn The configuration property `package.json#prisma` is deprecated and will be removed in Prisma 7. Please migrate to a Prisma config file (e.g., `prisma.config.ts`).
For more information, see: https://pris.ly/prisma-config

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('ARTICLE', 'TRANSCRIPT', 'YOUTUBE_TRANSCRIPT', 'SOCIAL_POST', 'PRESS_RELEASE', 'SPEECH', 'INTERVIEW', 'OTHER');

-- CreateEnum
CREATE TYPE "StatementType" AS ENUM ('PROMISE', 'PREDICTION', 'COMMITMENT', 'CLAIM');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNRESOLVED', 'KEPT', 'DELAYED', 'CONTRADICTED', 'PARTIALLY_FULFILLED', 'TOO_VAGUE');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('OFFICIAL_REPORT', 'NEWS_ARTICLE', 'GOVERNMENT_DATA', 'THIRD_PARTY_VERIFICATION', 'STATEMENT_BY_SUBJECT', 'OTHER');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('CONTEXT', 'EDITORIAL', 'RESEARCH');

-- CreateEnum
CREATE TYPE "DisputeType" AS ENUM ('MISQUOTE', 'MISSING_CONTEXT', 'WRONG_STATUS', 'WRONG_ATTRIBUTION', 'OTHER');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'NOTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackedSources" TEXT[],
    "coverageFrom" TIMESTAMP(3),
    "coverageTo" TIMESTAMP(3),

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "sourceDate" TIMESTAMP(3) NOT NULL,
    "rawText" TEXT NOT NULL,
    "excerpt" TEXT,
    "ingested" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statement" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "sourceDocumentId" TEXT,
    "exactQuote" TEXT NOT NULL,
    "context" TEXT,
    "interpretation" TEXT,
    "statementType" "StatementType" NOT NULL,
    "sourceTitle" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceDate" TIMESTAMP(3) NOT NULL,
    "impliedDeadline" TIMESTAMP(3),
    "measurableOutcome" TEXT,
    "confidenceScore" INTEGER NOT NULL DEFAULT 3,
    "status" "Status" NOT NULL DEFAULT 'UNRESOLVED',
    "adminNotes" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "aiExtracted" BOOLEAN NOT NULL DEFAULT false,
    "aiConfidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "sourceDocumentId" TEXT,
    "addedById" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "evidenceDate" TIMESTAMP(3) NOT NULL,
    "evidenceType" "EvidenceType" NOT NULL,
    "sourceUrl" TEXT,
    "sourceTitle" TEXT,
    "notes" TEXT,
    "statusChange" "Status",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "noteType" "NoteType" NOT NULL DEFAULT 'CONTEXT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "submitterEmail" TEXT,
    "content" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "disputeType" "DisputeType" NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "Person_slug_idx" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "SourceDocument_personId_idx" ON "SourceDocument"("personId");

-- CreateIndex
CREATE INDEX "SourceDocument_sourceDate_idx" ON "SourceDocument"("sourceDate");

-- CreateIndex
CREATE INDEX "Statement_personId_idx" ON "Statement"("personId");

-- CreateIndex
CREATE INDEX "Statement_status_idx" ON "Statement"("status");

-- CreateIndex
CREATE INDEX "Statement_statementType_idx" ON "Statement"("statementType");

-- CreateIndex
CREATE INDEX "Statement_sourceDate_idx" ON "Statement"("sourceDate");

-- CreateIndex
CREATE INDEX "Statement_approved_idx" ON "Statement"("approved");

-- CreateIndex
CREATE INDEX "Statement_sourceDocumentId_idx" ON "Statement"("sourceDocumentId");

-- CreateIndex
CREATE INDEX "Evidence_statementId_idx" ON "Evidence"("statementId");

-- CreateIndex
CREATE INDEX "Note_statementId_idx" ON "Note"("statementId");

-- CreateIndex
CREATE INDEX "Dispute_statementId_idx" ON "Dispute"("statementId");

-- CreateIndex
CREATE INDEX "Dispute_status_idx" ON "Dispute"("status");

-- AddForeignKey
ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_sourceDocumentId_fkey" FOREIGN KEY ("sourceDocumentId") REFERENCES "SourceDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

