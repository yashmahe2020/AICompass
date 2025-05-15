export const ALLOWED_DOMAINS = [
  "edu",
  "k12.ca.us",
  "mvla.net",
  // add more as needed
];

export function isSchoolEmail(email: string) {
  if (!email) return false;
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return ALLOWED_DOMAINS.some((d) => domain.endsWith(d));
} 