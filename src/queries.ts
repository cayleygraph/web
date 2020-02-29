import * as mime from "./mime";

export type Language = "gizmo" | "graphql" | "mql";

export type LanguageOption = {
  label: string;
  value: Language;
};

export const languageOptions: LanguageOption[] = [
  { label: "Gizmo", value: "gizmo" },
  { label: "GraphQL", value: "graphql" },
  { label: "MQL", value: "mql" }
];

export type QueryResult = { result: any[] | null } | { error: string };

export type Query = {
  id: string;
  text: string;
  language: Language;
  result: QueryResult | null;
  time: Date;
};

export async function runQuery(
  serverURL: string,
  language: string,
  query: string
): Promise<QueryResult> {
  const res = await fetch(
    `${serverURL}/api/v2/query?${new URLSearchParams({ lang: language })}`,
    {
      method: "POST",
      headers: {
        Accept: mime.JSON_LD
      },
      body: query
    }
  );
  return res.json();
}

export async function getShape(
  serverURL: string,
  language: string,
  query: string
): Promise<QueryResult> {
  const res = await fetch(`${serverURL}/api/v1/shape/${language}`, {
    method: "POST",
    body: query
  });
  const { error, ...result } = await res.json();
  if (error) {
    throw new Error(error);
  }
  return result;
}
