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

export type QueryResult = { result: any } | { error: object } | null;

export type Query = {
  id: number;
  text: string;
  language: Language;
  result: QueryResult;
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
        Accept: "application/ld+json"
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
