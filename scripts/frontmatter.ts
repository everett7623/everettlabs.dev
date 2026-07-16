export function frontmatterValue(content: string, field: string): string | undefined {
  return content.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'))?.[1]?.trim();
}
