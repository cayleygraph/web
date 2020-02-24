import * as jsonLd from "./json-ld";

type GizmoQueryResult<T extends Object> = {
  result: T[] | null;
};

type GizmoQueryError = {
  error: string;
};

export type GizmoQueryResponse<T extends Object> =
  | GizmoQueryResult<T>
  | GizmoQueryError;

export function getResult<T>(response: GizmoQueryResponse<T>): T[] | null {
  if ("error" in response) {
    throw new Error(response.error);
  }
  return response.result;
}

export function normalizeID<T extends { id: jsonLd.Reference }>(
  result: T[] | null
): Array<jsonLd.Reference & Pick<T, Exclude<keyof T, "id">>> | null {
  if (result !== null) {
    return result.map(({ id, ...rest }) => ({ "@id": id["@id"], ...rest }));
  }
  return result;
}

export function escapeID(id: string): string {
  if (id.startsWith("_:")) {
    return id;
  }
  return `<${id}>`;
}
