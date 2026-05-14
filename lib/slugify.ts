export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase() // affects English only
    .replace(/\s+/g, "-") // spaces → hyphen
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim hyphens
}
