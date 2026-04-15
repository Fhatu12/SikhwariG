export const legalName = "SIKHWARI GROUP (Pty) Ltd";

export const registrationNumber =
  process.env.COMPANY_REGISTRATION_NUMBER?.trim() || "2026 / 166219 / 07";

export const registeredAddress =
  process.env.COMPANY_REGISTERED_ADDRESS?.trim() ||
  [
    "UNIT 93 AMBER HILL",
    "26 LEMONWOOD ST",
    "CENTURION",
    "GAUTENG",
    "0144",
  ].join("\n");

export const divisionStatement =
  "All service lines are divisions of a single legal entity (not separate companies).";
