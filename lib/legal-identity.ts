export const legalName = "SIKHWARI GROUP (Pty) Ltd";

export const registrationNumber =
  process.env.COMPANY_REGISTRATION_NUMBER?.trim() || "[to be issued]";

export const registeredAddress =
  process.env.COMPANY_REGISTERED_ADDRESS?.trim() || "[to be confirmed]";

export const divisionStatement =
  "All service lines are divisions of a single legal entity (not separate companies).";
