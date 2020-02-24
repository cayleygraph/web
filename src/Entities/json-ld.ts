export type JsonLdReference = { "@id": string };

export type JsonLdPrimitiveValue =
  | { "@value": string; "@language": string }
  | { "@value": string; "@type": string };

export type JsonLdValue = JsonLdReference | JsonLdPrimitiveValue | string;

export function isReference(value: JsonLdValue): value is JsonLdReference {
  return typeof value === "object" && "@id" in value;
}
