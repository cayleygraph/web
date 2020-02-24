import { XSD_STRING } from "./constants";

export type JsonLdReference = { "@id": string };

type JsonLDTypedPrimitiveValue = { "@value": string; "@type": string };
type JsonLDLocalizedPrimitiveValue = { "@value": string; "@language": string };

export type JsonLdPrimitiveValue =
  | string
  | JsonLDLocalizedPrimitiveValue
  | JsonLDTypedPrimitiveValue;

export type JsonLdValue = JsonLdReference | JsonLdPrimitiveValue;

export function isReference(value: JsonLdValue): value is JsonLdReference {
  return typeof value === "object" && "@id" in value;
}

export function isJsonLDTypedPrimitiveValue(
  value: JsonLdValue
): value is JsonLDTypedPrimitiveValue {
  return typeof value === "object" && "@type" in value;
}

export function isJsonLDLocalizedPrimitiveValue(
  value: JsonLdValue
): value is JsonLDLocalizedPrimitiveValue {
  return typeof value === "object" && "@language" in value;
}

export function normalizePrimitiveValue(
  value: JsonLdPrimitiveValue
): JsonLdPrimitiveValue {
  if (isJsonLDTypedPrimitiveValue(value) && value["@type"] === XSD_STRING) {
    return value["@value"];
  }
  return value;
}
