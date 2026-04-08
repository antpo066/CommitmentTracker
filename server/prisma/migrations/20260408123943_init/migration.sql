-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('PASTED_TEXT', 'ARTICLE_URL', 'YOUTUBE_TRANSCRIPT', 'TWEET', 'SPEECH', 'INTERVIEW', 'OTHER');

-- CreateEnum
CREATE TYPE "StatementType" AS ENUM ('PROMISE', 'PREDICTION', 'COMMITMENT', 'CLAIM');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('UNRESOLVED', 'KEPT', 'DELAYED', 'CONTRADICTED', 'PARTIALLY_FULFILLED');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('CONTEXT', 'DISPUTE', 'EVIDENCE', 'CORRECTION');

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

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statement" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "exactQuote" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "dateMade" TIMESTAMP(3) NOT NULL,
    "statementType" "StatementType" NOT NULL,
    "impliedDeadline" TIMESTAMP(3),
    "measurableOutcome" TEXT,
    "confidenceScore" INTEGER DEFAULT 3,
    "status" "Status" NOT NULL DEFAULT 'UNRESOLVED',
    "evidenceNote" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");

-- CreateIndex
CREATE INDEX "Statement_personId_idx" ON "Statement"("personId");

-- CreateIndex
CREATE INDEX "Statement_status_idx" ON "Statement"("status");

-- CreateIndex
CREATE INDEX "Statement_statementType_idx" ON "Statement"("statementType");

-- CreateIndex
CREATE INDEX "Statement_dateMade_idx" ON "Statement"("dateMade");

-- CreateIndex
CREATE INDEX "Statement_approved_idx" ON "Statement"("approved");

-- CreateIndex
CREATE INDEX "Note_statementId_idx" ON "Note"("statementId");

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "Statement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
