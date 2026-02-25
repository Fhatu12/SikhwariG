import { PostStatus } from "@prisma/client";

export function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parsePostStatus(value: FormDataEntryValue | null) {
  return value === PostStatus.PUBLISHED ? PostStatus.PUBLISHED : PostStatus.DRAFT;
}
