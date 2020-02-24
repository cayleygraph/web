import { XSD_STRING } from "./constants";

export type Reference = { "@id": string };

type TypedPrimitiveValue = { "@value": string; "@type": string };
type LocalizedText = { "@value": string; "@language": string };

export type PrimitiveValue = string | LocalizedText | TypedPrimitiveValue;

export type Value = Reference | PrimitiveValue;

export function isReference(value: Value): value is Reference {
  return typeof value === "object" && "@id" in value;
}

export function isTypedPrimitiveValue(
  value: Value
): value is TypedPrimitiveValue {
  return typeof value === "object" && "@type" in value;
}

export function isLocalizedText(value: Value): value is LocalizedText {
  return typeof value === "object" && "@language" in value;
}

export function normalizePrimitiveValue(value: PrimitiveValue): PrimitiveValue {
  if (isTypedPrimitiveValue(value) && value["@type"] === XSD_STRING) {
    return value["@value"];
  }
  return value;
}
