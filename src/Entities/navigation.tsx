export const entityLink = (iri: string): string =>
  `/entities/${encodeURIComponent(iri)}`;

export const getEntityID = (pathname: string): string => {
  return decodeURIComponent(pathname.replace(/^(\/)*entities(\/)*/, ""));
};
