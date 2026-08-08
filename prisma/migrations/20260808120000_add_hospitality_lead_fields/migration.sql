-- Add nullable hospitality-specific fields for lead submissions.
ALTER TABLE "Lead"
  ADD COLUMN "hospitalityServiceType" TEXT,
  ADD COLUMN "eventDate" TIMESTAMP(3),
  ADD COLUMN "eventLocation" TEXT,
  ADD COLUMN "estimatedGuestCount" INTEGER;
