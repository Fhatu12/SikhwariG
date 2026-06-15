export const legalName = "SIKHWARI GROUP (Pty) Ltd";

export const registrationNumber =
  process.env.COMPANY_REGISTRATION_NUMBER?.trim() || "2026 / 166219 / 07";

const DEFAULT_REGISTERED_ADDRESS_PARTS = [
  "UNIT 93 AMBER HILL",
  "26 LEMONWOOD ST",
  "CENTURION",
  "GAUTENG",
  "0144",
] as const;

function normalizeRegisteredAddress(value: string) {
  return value
    .replace(/\\r\\n|\\n|\\r/g, ", ")
    .replace(/\r?\n/g, ", ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/(?:,\s*){2,}/g, ", ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[,\s.]+|[,\s.]+$/g, "")
    .trim();
}

export const registeredAddress =
  normalizeRegisteredAddress(
    process.env.COMPANY_REGISTERED_ADDRESS?.trim() || DEFAULT_REGISTERED_ADDRESS_PARTS.join(", ")
  );

export const divisionStatement =
  "All service lines are divisions of a single legal entity (not separate companies).";
