export const entityLink = (iri: string): string =>
  `/entities/${encodeURIComponent(iri)}`;
