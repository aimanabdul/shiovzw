export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseTags(tags: string): string[] {
  try {
    return JSON.parse(tags);
  } catch {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

export function parseGallery(galleryImages: string): string[] {
  try {
    return JSON.parse(galleryImages);
  } catch {
    return [];
  }
}
