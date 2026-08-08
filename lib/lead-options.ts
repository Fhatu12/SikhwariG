export const INTENT_OPTIONS = ["Request a quote", "Book consultation", "General enquiry"] as const;

export const SERVICE_AREA_OPTIONS = [
  "Telecommunications, ICT, and Network Services",
  "Cybersecurity Services",
  "Software Development and Digital Services",
  "Culinary and Hospitality Services",
  "General business enquiry",
  "Not sure",
] as const;

export const HOSPITALITY_SERVICE_AREA = "Culinary and Hospitality Services";

export const HOSPITALITY_SERVICE_TYPE_OPTIONS = [
  "Catering",
  "Chef Services",
  "Corporate Function",
  "Private Function",
  "Other",
] as const;

export type ContactIntent = (typeof INTENT_OPTIONS)[number];
export type ServiceAreaOption = (typeof SERVICE_AREA_OPTIONS)[number];
export type HospitalityServiceType = (typeof HOSPITALITY_SERVICE_TYPE_OPTIONS)[number];

export function isContactIntent(value: string): value is ContactIntent {
  return INTENT_OPTIONS.includes(value as ContactIntent);
}

export function isServiceAreaOption(value: string): value is ServiceAreaOption {
  return SERVICE_AREA_OPTIONS.includes(value as ServiceAreaOption);
}

export function isHospitalityServiceType(value: string): value is HospitalityServiceType {
  return HOSPITALITY_SERVICE_TYPE_OPTIONS.includes(value as HospitalityServiceType);
}

export function isHospitalityServiceArea(value: string) {
  return value === HOSPITALITY_SERVICE_AREA;
}
