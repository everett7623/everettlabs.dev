export type JsonLdValue =
  string | number | boolean | null | JsonLdValue[] | { [key: string]: JsonLdValue };

export interface StructuredData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: JsonLdValue;
}
