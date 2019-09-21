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

export type Query = {
  id: number;
  text: string;
  language: Language;
  result: { result: any } | { error: object } | null;
  time: Date;
};
