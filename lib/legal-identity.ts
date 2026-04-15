export const legalName = "SIKHWARI GROUP (Pty) Ltd";

export const registrationNumber =
  process.env.COMPANY_REGISTRATION_NUMBER?.trim() || "[to be issued]";

export const registeredAddress =
  process.env.COMPANY_REGISTERED_ADDRESS?.trim() ||
  "Unit 93 Amber Hill, 26 Lemonwood St, Centurion, Gauteng, 0144";

export const divisionStatement =
  "All service lines are divisions of a single legal entity (not separate companies).";
