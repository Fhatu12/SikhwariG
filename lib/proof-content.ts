import { ProofKind } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const PROOF_KIND_LABELS: Record<ProofKind, string> = {
  CERTIFICATION: "Certifications",
  PARTNER: "Partners",
  MEMBERSHIP: "Memberships",
  AWARD: "Awards",
};

const PROOF_KIND_ORDER: ProofKind[] = ["CERTIFICATION", "PARTNER", "MEMBERSHIP", "AWARD"];

export async function getActiveProofItems() {
  let items: Awaited<ReturnType<typeof prisma.proofItem.findMany>>;
  try {
    items = await prisma.proofItem.findMany({
      where: { isActive: true },
      orderBy: [{ kind: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }

  const rank = new Map(PROOF_KIND_ORDER.map((kind, index) => [kind, index]));

  return items.sort((a, b) => {
    const kindOrder = (rank.get(a.kind) ?? 999) - (rank.get(b.kind) ?? 999);
    if (kindOrder !== 0) {
      return kindOrder;
    }
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}
