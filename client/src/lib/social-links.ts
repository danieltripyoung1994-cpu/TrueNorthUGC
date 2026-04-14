const PLATFORM_BASES: Record<string, string> = {
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  youtube: "https://youtube.com/@",
  twitter: "https://x.com/",
  facebook: "https://facebook.com/",
  linkedin: "https://linkedin.com/in/",
  canva: "https://canva.com/",
};

export function normalizeSocialLink(platform: string, value: string): string {
  const v = value?.trim();
  if (!v) return "";

  if (v.startsWith("http://") || v.startsWith("https://")) {
    return v.replace(/^http:\/\//, "https://");
  }

  const handle = v.startsWith("@") ? v.slice(1) : v;
  const base = PLATFORM_BASES[platform.toLowerCase()];

  if (!base) {
    return `https://${handle}`;
  }

  if (platform.toLowerCase() === "canva") {
    return `https://canva.com/${handle}`;
  }

  return `${base}${handle}`;
}

export function normalizeSocialLinks(
  platform: string,
  links: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, val] of Object.entries(links)) {
    const normalized = normalizeSocialLink(key, val);
    if (normalized) result[key] = normalized;
  }
  return result;
}
